import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('nexusiq_token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        try {
          // Auto-authenticate as demo Plant Administrator if no token exists
          const res = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@nexusiq.io', password: 'admin123' }),
          })
          localStorage.setItem('nexusiq_token', res.token)
          setToken(res.token)
          setUser(res.user)
        } catch (err) {
          console.warn('Auto-login failed:', err.message)
        } finally {
          setLoading(false)
        }
        return
      }
      try {
        const res = await apiFetch('/auth/me')
        setUser(res.user)
      } catch (err) {
        console.warn('Auth session expired, attempting auto-login:', err.message)
        try {
          const res = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@nexusiq.io', password: 'admin123' }),
          })
          localStorage.setItem('nexusiq_token', res.token)
          setToken(res.token)
          setUser(res.user)
        } catch (autoErr) {
          logout()
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [token])

  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('nexusiq_token', res.token)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    localStorage.removeItem('nexusiq_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
