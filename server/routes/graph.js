import express from 'express'
import { db } from '../db/database.js'
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/graph
router.get('/', authenticateToken, (req, res) => {
  const nodes = db.data.graph_nodes || []
  const edges = db.data.graph_edges || []
  const stats = {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    equipmentCount: nodes.filter(n => n.type === 'equipment').length,
    documentCount: nodes.filter(n => n.type === 'document').length,
  }
  res.json({ nodes, edges, stats })
})

// POST /api/graph/node
router.post('/node', authenticateToken, requireRole('Plant Engineer', 'Plant Administrator'), async (req, res) => {
  const { id, label, type = 'equipment', area = 'Global', criticality = 'medium', properties = {} } = req.body

  if (!id || !label) {
    return res.status(400).json({ error: 'Node id and label are required.' })
  }

  const existing = db.data.graph_nodes.find(n => n.id === id)
  if (existing) {
    return res.status(400).json({ error: 'Graph node with this ID already exists.' })
  }

  const newNode = { id, label, type, area, status: 'healthy', criticality, properties }
  db.data.graph_nodes.push(newNode)
  await db.write()

  res.status(201).json({ message: 'Node added to Knowledge Graph.', node: newNode })
})

// POST /api/graph/edge
router.post('/edge', authenticateToken, requireRole('Plant Engineer', 'Plant Administrator'), async (req, res) => {
  const { source_id, target_id, label, strength = 1.0 } = req.body

  if (!source_id || !target_id || !label) {
    return res.status(400).json({ error: 'source_id, target_id, and label are required.' })
  }

  const edgeId = `e_${Date.now()}`
  const newEdge = { id: edgeId, source_id, target_id, label, strength }
  db.data.graph_edges.push(newEdge)
  await db.write()

  res.status(201).json({ message: 'Relationship edge added to Knowledge Graph.', edge: newEdge })
})

export default router
