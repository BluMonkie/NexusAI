import express from 'express'
import { db } from '../db/database.js'
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/lessons
router.get('/', authenticateToken, (req, res) => {
  const incidents = db.data.incidents || []
  res.json({ incidents })
})

// POST /api/lessons
router.post('/', authenticateToken, requireRole('EHS Specialist', 'Plant Engineer', 'Plant Administrator'), async (req, res) => {
  const { title, equipment, severity = 'Medium', root_cause = '', mitigation = '' } = req.body

  if (!title || !equipment) {
    return res.status(400).json({ error: 'Title and equipment are required.' })
  }

  const id = `INC-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`
  const newIncident = {
    id,
    title,
    equipment,
    severity,
    date: new Date().toISOString().split('T')[0],
    root_cause,
    mitigation,
  }

  db.data.incidents.push(newIncident)
  await db.write()

  res.status(201).json({ message: 'Incident lesson logged into database.', incident: newIncident })
})

export default router
