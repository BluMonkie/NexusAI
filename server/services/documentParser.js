import fs from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const rawPdfParse = require('pdf-parse')
const pdfParse = typeof rawPdfParse === 'function' ? rawPdfParse : rawPdfParse.default

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

    if (fileType.toLowerCase().includes('pdf')) {
      try {
        const pdfPromise = pdfParse(fileBuffer)
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('pdf-parse timed out after 3s')), 3000))
        const pdfData = await Promise.race([pdfPromise, timeoutPromise])
        extractedText = pdfData.text || ''
      } catch (pdfErr) {
        console.warn('pdf-parse failed/timed out, using regex stream fallback:', pdfErr.message)
        extractedText = fileBuffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ')
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
  const incidentRegex = /\bINC-\d{4}-\d{2,4}\b/g
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
    if (['SOP', 'INC', 'REV', 'AREA', 'MAWP', 'LOTO', 'CAPA', 'CCR', 'PDF', 'TXT', 'DOC'].includes(upper)) continue
    if (tag.startsWith('INC-') || tag.startsWith('SOP-') || tag.startsWith('OISD-')) continue

    const labelContext = findContext(tag)
    let type = 'equipment'
    let criticality = 'medium'
    if (tag.startsWith('D-') || tag.startsWith('V-') || tag.startsWith('C-')) criticality = 'high'
    if (tag.startsWith('BDV-') || tag.startsWith('PSV-') || tag.startsWith('EDV-')) criticality = 'critical'

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
