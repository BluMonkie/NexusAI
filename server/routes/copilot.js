import express from 'express'
import dotenv from 'dotenv'
import { db } from '../db/database.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { generateEmbedding, cosineSimilarity, keywordScore } from '../services/vectorStore.js'

dotenv.config()
const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY || ''
const GEMINI_MODEL = process.env.VITE_AI_MODEL || 'gemini-2.0-flash'

const router = express.Router()

// POST /api/copilot/chat
router.post('/chat', authenticateToken, async (req, res) => {
  const { message, history = [] } = req.body

  if (!message) {
    return res.status(400).json({ error: 'User message is required.' })
  }

  try {
    // 1. Vector Search across Document Chunks
    const queryVec = await generateEmbedding(message)
    const chunks = db.data.document_chunks || []
    
    const scoredChunks = chunks.map(chunk => {
      let score = 0
      if (queryVec && chunk.embedding) {
        score = cosineSimilarity(queryVec, chunk.embedding)
      } else {
        score = keywordScore(chunk.content, message) * 0.2
      }
      return { ...chunk, score }
    }).sort((a, b) => b.score - a.score).slice(0, 4)

    // 2. Fetch Relevant Context from Database Tables
    const equipmentList = db.data.graph_nodes.filter(n => n.type === 'equipment').map(e => `[${e.id}] ${e.label} (${e.area}) - Status: ${e.status}`).join('\n')
    const workOrders = db.data.work_orders.map(w => `[${w.id}] ${w.equipment}: ${w.title} (${w.status}) - ${w.desc}`).join('\n')
    const incidents = db.data.incidents.map(i => `[${i.date}] ${i.equipment}: ${i.title} (${i.severity}) - Cause: ${i.root_cause}`).join('\n')
    const complianceGaps = db.data.compliance_rules.map(c => `[${c.standard}] ${c.title}: ${c.desc} (${c.status})`).join('\n')
    
    const retrievedDocText = scoredChunks.length > 0
      ? scoredChunks.map(c => `[Chunk from Doc ${c.document_id}]: "${c.content}"`).join('\n\n')
      : 'No specific document chunks matched the query vector.'

    const dynamicSystemPrompt = `You are NEXUS IQ, an AI assistant for industrial knowledge management at an oil refinery / petrochemical complex.
You have access to live database records and indexed engineering documents.

=== RETRIEVED DOCUMENT CHUNKS ===
${retrievedDocText}

=== PLANT EQUIPMENT RECORDS ===
${equipmentList}

=== ACTIVE WORK ORDERS ===
${workOrders}

=== INCIDENTS & LESSONS LEARNED ===
${incidents}

=== COMPLIANCE & SAFETY RULES ===
${complianceGaps}

Answer the user with technical precision based on the retrieved context above.
Include a confidence score (0-100%) and cite document names or equipment tags where applicable.`

    // 3. Construct Gemini Contents Array
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
    contents.push({ role: 'user', parts: [{ text: message }] })

    // 4. Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: dynamicSystemPrompt }] },
          contents,
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API call failed.')
    }

    const rawAnswer = data.candidates[0].content.parts[0].text
    const matchedDocs = scoredChunks.map(c => {
      const doc = db.data.documents.find(d => d.id === c.document_id)
      return { doc: doc ? doc.name : c.document_id, confidence: Math.round(c.score * 100) || 85 }
    })

    res.json({
      answer: rawAnswer,
      sources: matchedDocs.length > 0 ? matchedDocs : [{ doc: 'Live Enterprise Database', confidence: 92 }],
      confidence: 92,
      retrievedChunksCount: scoredChunks.length,
    })
  } catch (err) {
    console.error('Copilot Chat Error:', err)
    res.status(500).json({ error: `RAG Pipeline Error: ${err.message}` })
  }
})

export default router
