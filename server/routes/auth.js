import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db/database.js'
import { JWT_SECRET, authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const user = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' })
  }

  const isMatch = bcrypt.compareSync(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials. Password incorrect.' })
  }

  const payload = { id: user.id, email: user.email, name: user.name, role: user.role }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

  res.json({ token, user: payload })
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'All fields (email, password, name, role) are required.' })
  }

  const existing = db.data.users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists.' })
  }

  const salt = bcrypt.genSaltSync(10)
  const passHash = bcrypt.hashSync(password, salt)
  const id = `u_${Date.now()}`

  const newUser = { id, email, password: passHash, name, role }
  db.data.users.push(newUser)
  await db.write()

  const payload = { id, email, name, role }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })

  res.status(201).json({ token, user: payload })
})

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

export default router
