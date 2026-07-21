import express from 'express'
import { db } from '../db/database.js'
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/maintenance/work-orders
router.get('/work-orders', authenticateToken, (req, res) => {
  const wos = db.data.work_orders || []
  const equipment = db.data.graph_nodes.filter(n => n.type === 'equipment')
  res.json({ workOrders: wos, equipment })
})

// POST /api/maintenance/work-orders
router.post('/work-orders', authenticateToken, requireRole('Maintenance Technician', 'Plant Engineer', 'Plant Administrator'), async (req, res) => {
  const { title, equipment, priority = 'Medium', assigned_to = 'Unassigned', desc = '' } = req.body

  if (!title || !equipment) {
    return res.status(400).json({ error: 'Title and equipment are required.' })
  }

  const woId = `WO-${Math.floor(1000 + Math.random() * 9000)}`
  const newWO = {
    id: woId,
    title,
    equipment,
    priority,
    status: 'Open',
    assigned_to,
    desc,
    created_at: new Date().toISOString(),
  }

  db.data.work_orders.push(newWO)
  
  // Link in Knowledge Graph
  db.data.graph_nodes.push({ id: woId, label: title, type: 'work_order', area: 'Global', status: 'open', criticality: priority.toLowerCase(), properties: { equipment } })
  const equipNode = db.data.graph_nodes.find(n => n.label.toLowerCase().includes(equipment.toLowerCase()) || n.id.toLowerCase().includes(equipment.toLowerCase()))
  if (equipNode) {
    db.data.graph_edges.push({ id: `e_${Date.now()}`, source_id: equipNode.id, target_id: woId, label: 'MAINTAINED_BY', strength: 0.9 })
  }

  await db.write()

  res.status(201).json({ message: 'Work order created and linked to Knowledge Graph.', workOrder: newWO })
})

export default router
