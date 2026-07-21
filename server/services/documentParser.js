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
