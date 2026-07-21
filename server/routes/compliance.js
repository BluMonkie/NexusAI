import express from 'express'
import { db } from '../db/database.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/compliance/requirements
router.get('/requirements', authenticateToken, (req, res) => {
  const rules = db.data.compliance_rules || []
  const compliantCount = rules.filter(r => r.status === 'compliant').length
  const score = Math.round((compliantCount / (rules.length || 1)) * 100)
  res.json({ rules, complianceScore: score })
})

export default router
