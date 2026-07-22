import fs from 'fs'

export function chunkText(text, chunkSize = 180, overlap = 30) {
  const paragraphs = text.split(/\n\s*\n/)
  const chunks = []

  for (const para of paragraphs) {
    const words = para.split(/\s+/)
    if (words.length <= chunkSize) {
      if (para.trim().length > 10) chunks.push(para.trim())
    } else {
      for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunk = words.slice(i, i + chunkSize).join(' ')
        if (chunk.trim().length > 10) {
          chunks.push(chunk.trim())
        }
      }
    }
  }

  return chunks.length > 0 ? chunks : [text.trim()]
}

export async function parseDocument(filePath, fileType) {
  try {
    const fileBuffer = fs.readFileSync(filePath)
    let extractedText = ''

    if (fileType.toLowerCase().includes('pdf') || filePath.toLowerCase().endsWith('.pdf')) {
      try {
        const { PDFParse } = await import('pdf-parse')
        const parser = new PDFParse({ url: filePath })
        await parser.load()
        const textResult = await parser.getText()
        extractedText = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult))
      } catch (pdfErr) {
        console.warn('PDFParse failed/timed out, trying Uint8Array fallback:', pdfErr.message)
        try {
          const { PDFParse } = await import('pdf-parse')
          const parser = new PDFParse({ data: new Uint8Array(fileBuffer) })
          await parser.load()
          const textResult = await parser.getText()
          extractedText = typeof textResult === 'string' ? textResult : (textResult.text || '')
        } catch (err2) {
          console.warn('PDF string stream fallback:', err2.message)
          const str = fileBuffer.toString('latin1')
          const matches = str.match(/\(([^()]{2,120})\)/g) || []
          extractedText = matches.map(m => m.slice(1, -1).replace(/\\/g, '')).join(' ')
        }
      }
    } else {
      extractedText = fileBuffer.toString('utf-8')
    }

    return extractedText.replace(/\r\n/g, '\n').trim()
  } catch (err) {
    console.error('Error parsing document:', err)
    throw new Error(`Failed to extract text from document: ${err.message}`)
  }
}

export async function extractIndustrialEntities(text, fileName = '', defaultArea = 'Area 300') {
  const textContent = text || ''
  const extractedNodes = []
  const extractedEdges = []
  const seenIds = new Set()

  const addNode = (id, label, type, area = defaultArea, status = 'active', criticality = 'medium', properties = {}) => {
    let cleanId = String(id).replace(/[\r\n\t]+/g, ' ').replace(/^(?:Associated|Primary|Relief|Emergency|Title|Document|Incident)\s+(?:Blower|Pump|Compressor|Vessel|Valve|Motor|Turbine|Exchanger|Asset|ID|Procedure)?\s*/i, '').trim()
    
    // Extract primary tag if cleanId contains parentheses or prefix
    const tagMatch = cleanId.match(/\b(?:[A-Z]{1,5}-\d{1,5}(?:-[A-Z0-9]+)*|OISD[-_\s]STD[-_\s]?\d+|API[-_\s]?\d+|ISO[-_\s]?\d+(?::\d+)?|SOP[-_][A-Z0-9_-]+|TRN[-_]\d{4}[-_]\d+)\b/i)
    if (tagMatch) cleanId = tagMatch[0].toUpperCase()

    if (!cleanId || cleanId.length < 2 || cleanId.length > 35 || seenIds.has(cleanId)) return
    // Reject common English words or sentence fragments
    if (/^(?:valves?|vessel|drum|filter|pump|blower|complex|scenario|notice|title|purpose|loto|operating|procedure|illustrative|associated|primary)$/i.test(cleanId)) return
    if (cleanId.includes(' ') && !/^(?:API|ISO|OISD|PESO|OSHA|ASME)\b/i.test(cleanId)) return

    seenIds.add(cleanId)

    extractedNodes.push({
      id: cleanId,
      label: label ? String(label).replace(/[\r\n\t]+/g, ' ').trim() : cleanId,
      type: type || 'equipment',
      area,
      status,
      criticality,
      properties: { tag: cleanId, source_doc: fileName, ...properties },
    })
  }

  // ── 1. Try Gemini AI Structured NER Extraction ────────────
  const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY || ''
  if (GEMINI_KEY && textContent.trim().length > 10) {
    try {
      const prompt = `You are an industrial NLP knowledge extraction engine. Extract all industrial entities from this document text.
Return ONLY valid JSON (no markdown ticks, no commentary) in this exact array format:
[
  {"id": "TAG_OR_ID", "label": "Full Descriptive Name", "type": "equipment|incident|procedure|regulation|work_order", "criticality": "critical|high|medium|low"}
]
Rules:
- "equipment": Any pump, compressor, drum, vessel, valve, heat exchanger, blower, turbine, tank, sensor, instrument, motor, fan, heater, ejector.
- "incident": Any incident ID, event, failure, breakdown, near-miss, CAPA, investigation.
- "procedure": Any SOP, MOP, EOP, protocol, standard operating procedure, maintenance manual, instruction document.
- "regulation": Any safety standard, OISD, API, ISO, OSHA, ASME, NFPA, PESO, environmental regulation.
- "work_order": Any work order ID, WO, maintenance ticket, PM task.

Document Text:
${textContent.slice(0, 4000)}`

      const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      })

      if (aiRes.ok) {
        const aiData = await aiRes.json()
        const aiText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const jsonMatch = aiText.match(/\[\s*\{.*\}\s*\]/s) || [aiText]
        const parsed = JSON.parse(jsonMatch[0])
        if (Array.isArray(parsed) && parsed.length > 0) {
          for (const item of parsed) {
            if (item.id && item.type) {
              addNode(item.id, item.label || item.id, item.type, defaultArea, 'active', item.criticality || 'medium')
            }
          }
          if (extractedNodes.length > 0) {
            return { extractedNodes, extractedEdges }
          }
        }
      }
    } catch (aiErr) {
      console.warn('Gemini AI entity extraction fallback to rule engine:', aiErr.message)
    }
  }

  // ── 2. Universal Key-Value & Label Matcher ─────────────────────
  const kvRegex = /(?:Primary\s+Asset|Associated\s+(?:Blower|Pump|Compressor|Vessel|Valve|Motor|Turbine|Exchanger)|Relief\s+Valve|Emergency\s+Isolation\s+Valve|Equipment(?:\s+Name)?|Asset(?:\s+Name)?|Incident\s+ID|Document\s+ID|Reference\s+Standards?|Standard|SOP(?:\s+ID)?|Work\s+Order(?:\s+ID)?)\s*[:\t-]\s*([^\n\r,;(]{2,100})/gi
  let kvMatch
  while ((kvMatch = kvRegex.exec(textContent)) !== null) {
    const rawVal = kvMatch[1].trim()
    // Extract tag ID from parentheses or capital word boundary e.g. "Sulfur Recovery Knockout Drum (KD-801)"
    const tagInParen = rawVal.match(/\(([^()]+)\)/)
    const tagMatch = tagInParen ? tagInParen[1] : rawVal.match(/\b(?:[A-Z0-9_-]{2,20})\b/)?.[0] || rawVal
    const cleanId = tagMatch.trim()

    let type = 'equipment'
    let criticality = 'medium'
    const lowerRaw = rawVal.toLowerCase()
    if (lowerRaw.includes('incident') || lowerRaw.includes('trn-') || lowerRaw.includes('inc-')) type = 'incident'
    else if (lowerRaw.includes('sop-') || lowerRaw.includes('procedure') || lowerRaw.includes('rev')) type = 'procedure'
    else if (lowerRaw.includes('api') || lowerRaw.includes('iso') || lowerRaw.includes('oisd') || lowerRaw.includes('standard')) type = 'regulation'
    else if (lowerRaw.includes('psv') || lowerRaw.includes('eiv') || lowerRaw.includes('relief') || lowerRaw.includes('emergency')) criticality = 'critical'
    else if (lowerRaw.includes('drum') || lowerRaw.includes('vessel') || lowerRaw.includes('pump') || lowerRaw.includes('blower')) criticality = 'high'

    addNode(cleanId, rawVal, type, defaultArea, 'active', criticality)
  }

  // ── 3. Flexible Multi-Pattern Matchers ─────────────────────────
  const equipmentRegex = /\b(?:[A-Z]{1,5}-\d{1,5}(?:-[A-Z0-9]+)*|\b(?:PUMP|COMP|TURBINE|VALVE|BLOWER|VESSEL|DRUM|HEATER|EXCHANGER|FILTER|TANK|MOTOR)\s*[A-Z0-9_-]{1,10})\b/gi
  const incidentRegex = /\b(?:INC|TRN|CAPA|EVENT|TICKET)[-_]\d{3,6}[-_]?\d{0,4}\b/gi
  const sopRegex = /\b(?:SOP|MOP|EOP)[-_][A-Z0-9_-]{3,25}\b/gi
  const complianceRegex = /\b(?:OISD[-_\s]STD[-_\s]?\d+|API[-_\s]?\d+|ISO[-_\s]?\d+(?::\d+)?|OSHA[-_\s]?\d+|PESO[A-Za-z0-9\s]+Rules?\s*\d+)\b/gi

  const eqMatches = Array.from(new Set(textContent.match(equipmentRegex) || []))
  const incMatches = Array.from(new Set(textContent.match(incidentRegex) || []))
  const sopMatches = Array.from(new Set(textContent.match(sopRegex) || []))
  const compMatches = Array.from(new Set(textContent.match(complianceRegex) || []))

  const findContext = (tag) => {
    const lines = textContent.split(/\r?\n/)
    for (const line of lines) {
      if (line.includes(tag)) {
        const cleaned = line.replace(/[•\*\t]/g, '').trim()
        if (cleaned.length > 3 && cleaned.length < 90) return cleaned
      }
    }
    return tag
  }

  for (const tag of eqMatches) {
    const upper = tag.toUpperCase().trim()
    if (['SOP', 'INC', 'TRN', 'REV', 'AREA', 'MAWP', 'LOTO', 'CAPA', 'CCR', 'PDF', 'TXT', 'DOC', 'API', 'ISO'].includes(upper)) continue
    if (upper.startsWith('INC') || upper.startsWith('TRN') || upper.startsWith('SOP') || upper.startsWith('OISD') || upper.startsWith('API') || upper.startsWith('ISO')) continue

    const labelContext = findContext(tag)
    let type = 'equipment'
    let criticality = 'medium'
    if (upper.startsWith('D-') || upper.startsWith('V-') || upper.startsWith('C-') || upper.startsWith('T-') || upper.startsWith('KD-')) criticality = 'high'
    if (upper.startsWith('BDV-') || upper.startsWith('PSV-') || upper.startsWith('EDV-') || upper.startsWith('EIV-')) criticality = 'critical'

    addNode(tag, labelContext !== tag ? labelContext : tag, type, defaultArea, 'active', criticality)
  }

  for (const tag of incMatches) {
    const labelContext = findContext(tag)
    addNode(tag, labelContext !== tag ? labelContext : `Incident ${tag}`, 'incident', defaultArea, 'investigated', 'high')
  }

  for (const tag of sopMatches) {
    const labelContext = findContext(tag)
    addNode(tag, labelContext !== tag ? labelContext : `Procedure ${tag}`, 'procedure', defaultArea, 'active', 'high')
  }

  for (const tag of compMatches) {
    const cleanTag = tag.trim()
    addNode(cleanTag, cleanTag, 'regulation', 'Global', 'compliant', 'critical')
  }

  return { extractedNodes, extractedEdges }
}
