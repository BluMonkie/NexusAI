import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { initDatabase } from './db/database.js'

import authRoutes from './routes/auth.js'
import copilotRoutes from './routes/copilot.js'
import documentRoutes from './routes/documents.js'
import graphRoutes from './routes/graph.js'
import maintenanceRoutes from './routes/maintenance.js'
import complianceRoutes from './routes/compliance.js'
import lessonsRoutes from './routes/lessons.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/copilot', copilotRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/graph', graphRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/compliance', complianceRoutes)
app.use('/api/lessons', lessonsRoutes)

// Serve static frontend build (Vite dist) for fullstack production deployment
const distPath = path.join(__dirname, '../dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next()
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', service: 'NEXUS IQ Backend Server', version: '1.0.0' })
})

async function startServer() {
  await initDatabase()
  app.listen(PORT, () => {
    console.log(`🚀 NEXUS IQ Express Backend Server running on http://localhost:${PORT}`)
  })
}

startServer().catch(err => {
  console.error('Failed to start server:', err)
})
