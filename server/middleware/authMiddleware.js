import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'nexus_iq_secret_key_2026'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No authentication token provided.' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token.' })
    }
    req.user = user
    next()
  })
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' })
    }
    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'Plant Administrator') {
      return res.status(403).json({ error: `Permission denied. Requires one of: ${allowedRoles.join(', ')}` })
    }
    next()
  }
}
