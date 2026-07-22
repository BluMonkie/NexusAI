import fs from 'fs'

export function chunkText(text, chunkSize = 500, overlap = 50) {
  const words = text.split(/\s+/)
  const chunks = []

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim().length > 0) {
      chunks.push(chunk)
    }
  }
  return chunks
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

export function extractIndustrialEntities(text, fileName = '', defaultArea = 'Area 300') {
  const textContent = text || ''
  const extractedNodes = []
  const extractedEdges = []

  // Pattern matchers
  const equipmentRegex = /\b(?:[A-Z]{1,4}-\d{2,4}(?:-[A-Z0-9]+)*[A-Z0-9]?|[A-Z]{1,3}\s\d{2,4})\b/g
  const incidentRegex = /\b(?:INC|TRN|CAPA)-\d{4}-\d{2,4}\b/g
  const sopRegex = /\bSOP-[A-Z0-9-]+(?:-REV\d+)?\b/g
  const complianceRegex = /\b(?:OISD-STD-\d+|API\s\d+|ISO\s\d+:\d+|PESO\s[A-Za-z0-9\s]+Rules\s\d+)\b/gi

  const eqMatches = Array.from(new Set(textContent.match(equipmentRegex) || []))
  const incMatches = Array.from(new Set(textContent.match(incidentRegex) || []))
  const sopMatches = Array.from(new Set(textContent.match(sopRegex) || []))
  const compMatches = Array.from(new Set(textContent.match(complianceRegex) || []))

  const findContext = (tag) => {
    const lines = textContent.split(/\r?\n/)
    for (const line of lines) {
      if (line.includes(tag)) {
        const cleaned = line.replace(/[•\-\*\t]/g, '').trim()
        if (cleaned.length > 3 && cleaned.length < 90) return cleaned
      }
    }
    return tag
  }

  // Equipment Nodes
  for (const tag of eqMatches) {
    const upper = tag.toUpperCase()
    if (['SOP', 'INC', 'TRN', 'REV', 'AREA', 'MAWP', 'LOTO', 'CAPA', 'CCR', 'PDF', 'TXT', 'DOC'].includes(upper)) continue
    if (tag.startsWith('INC-') || tag.startsWith('TRN-') || tag.startsWith('SOP-') || tag.startsWith('OISD-')) continue

    const labelContext = findContext(tag)
    let type = 'equipment'
    let criticality = 'medium'
    if (tag.startsWith('D-') || tag.startsWith('V-') || tag.startsWith('C-') || tag.startsWith('T-')) criticality = 'high'
    if (tag.startsWith('BDV-') || tag.startsWith('PSV-') || tag.startsWith('EDV-') || tag.startsWith('EIV-')) criticality = 'critical'

    extractedNodes.push({
      id: tag,
      label: labelContext !== tag ? labelContext : tag,
      type,
      area: defaultArea,
      status: 'active',
      criticality,
      properties: { tag, source_doc: fileName }
    })
  }

  // Incident Nodes
  for (const tag of incMatches) {
    const labelContext = findContext(tag)
    extractedNodes.push({
      id: tag,
      label: labelContext !== tag ? labelContext : `Incident ${tag}`,
      type: 'incident',
      area: defaultArea,
      status: 'investigated',
      criticality: 'high',
      properties: { tag, source_doc: fileName }
    })
  }

  // SOP / Document Nodes
  for (const tag of sopMatches) {
    const labelContext = findContext(tag)
    extractedNodes.push({
      id: tag,
      label: labelContext !== tag ? labelContext : `Procedure ${tag}`,
      type: 'procedure',
      area: defaultArea,
      status: 'active',
      criticality: 'high',
      properties: { tag, source_doc: fileName }
    })
  }

  // Compliance Nodes
  for (const tag of compMatches) {
    const cleanTag = tag.trim()
    extractedNodes.push({
      id: cleanTag,
      label: cleanTag,
      type: 'regulation',
      area: 'Global',
      status: 'compliant',
      criticality: 'critical',
      properties: { standard: cleanTag, source_doc: fileName }
    })
  }

  return { extractedNodes, extractedEdges }
}
