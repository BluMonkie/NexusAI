import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { db } from '../db/database.js'
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js'
import { parseDocument, chunkText } from '../services/documentParser.js'
import { generateEmbedding } from '../services/vectorStore.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})

const upload = multer({ storage })
const router = express.Router()

// GET /api/documents
router.get('/', authenticateToken, (req, res) => {
  const docs = db.data.documents || []
  const stats = {
    totalDocuments: docs.length,
    indexedChunks: (db.data.document_chunks || []).length,
    activeEntities: (db.data.graph_nodes || []).length,
  }
  res.json({ documents: docs, stats })
})

// POST /api/documents/upload
router.post('/upload', authenticateToken, requireRole('Plant Engineer', 'Plant Administrator'), upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const { category = 'Engineering Drawings', area = 'Global' } = req.body

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    const docId = `DOC_${Date.now()}`
    const extractedText = await parseDocument(file.path, file.mimetype)
    const chunks = chunkText(extractedText)

    // Save Document record
    const newDoc = {
      id: docId,
      name: file.originalname,
      type: path.extname(file.originalname).replace('.', '').toUpperCase() || 'PDF',
      category,
      status: 'indexed',
      file_path: file.path,
      uploaded_at: new Date().toISOString(),
    }
    db.data.documents.push(newDoc)

    // Generate Chunks & Vector Embeddings (Parallelized)
    const chunkPromises = chunks.slice(0, 15).map(async (chunkTextContent, i) => {
      const embeddingValues = await generateEmbedding(chunkTextContent)
      return {
        id: `chunk_${docId}_${i}`,
        document_id: docId,
        chunk_index: i,
        content: chunkTextContent,
        embedding: embeddingValues,
      }
    })

    const processedChunks = await Promise.all(chunkPromises)
    db.data.document_chunks.push(...processedChunks)

    // Auto-create Knowledge Graph Node for Document
    db.data.graph_nodes.push({
      id: docId,
      label: file.originalname,
      type: 'document',
      area,
      status: 'active',
      criticality: 'medium',
      properties: { category, chunksCount: chunks.length },
    })

    // Automatic Entity & Edge Extraction for Knowledge Graph
    const entityMatches = (extractedText || '').match(/(?:[A-Z]{1,4}-\d{2,4}[A-Z]?|[A-Z]{3}-\d{4}-\d{2})/g) || []
    const uniqueEntities = Array.from(new Set(entityMatches))

    for (const entityId of uniqueEntities) {
      if (entityId === docId) continue

      // Determine entity type
      let entityType = 'equipment'
      if (entityId.startsWith('INC-')) entityType = 'incident'
      else if (entityId.startsWith('SOP-')) entityType = 'document'
      else if (entityId.startsWith('OISD-') || entityId.startsWith('ISO-')) entityType = 'compliance'

      // Check if node exists
      let nodeExists = db.data.graph_nodes.some(n => n.id === entityId)
      if (!nodeExists) {
        db.data.graph_nodes.push({
          id: entityId,
          label: entityId,
          type: entityType,
          area: area || 'Area 200',
          status: 'active',
          criticality: entityType === 'incident' ? 'high' : 'medium',
          properties: { source_doc: file.originalname }
        })
      }

      // Add connecting edge
      const edgeId = `edge_${docId}_${entityId}`
      if (!db.data.graph_edges.some(e => e.id === edgeId)) {
        db.data.graph_edges.push({
          id: edgeId,
          source: docId,
          target: entityId,
          label: 'REFERENCES',
          type: 'references'
        })
      }
    }

    await db.write()

    res.status(201).json({
      message: 'Document successfully uploaded and indexed into RAG pipeline.',
      document: newDoc,
      chunksIndexed: chunks.length,
    })
  } catch (err) {
    console.error('Upload Error:', err)
    res.status(500).json({ error: `Upload failed: ${err.message}` })
  }
})

// DELETE /api/documents/:id
router.delete('/:id', authenticateToken, requireRole('Plant Administrator'), async (req, res) => {
  const { id } = req.params

  const docIndex = db.data.documents.findIndex(d => d.id === id)
  if (docIndex === -1) {
    return res.status(404).json({ error: 'Document not found.' })
  }

  const doc = db.data.documents[docIndex]
  if (doc.file_path && fs.existsSync(doc.file_path)) {
    try { fs.unlinkSync(doc.file_path) } catch {}
  }

  db.data.documents.splice(docIndex, 1)
  db.data.document_chunks = db.data.document_chunks.filter(c => c.document_id !== id)
  db.data.graph_nodes = db.data.graph_nodes.filter(n => n.id !== id)

  await db.write()
  res.json({ message: 'Document and indexed chunks successfully removed.' })
})

export default router
