import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../services/apiClient'
import LoginModal from '../components/Auth/LoginModal'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('nexusiq_token') || null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await apiFetch('/auth/me')
        setUser(res.user)
      } catch (err) {
        console.warn('Auth session expired or invalid:', err.message)
        logout()
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    const handleUnauthorized = () => setShowLoginModal(true)
    window.addEventListener('nexusiq_unauthorized', handleUnauthorized)
    return () => window.removeEventListener('nexusiq_unauthorized', handleUnauthorized)
  }, [token])

  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('nexusiq_token', res.token)
    setToken(res.token)
    setUser(res.user)
    setShowLoginModal(false)
    return res.user
  }

  const logout = () => {
    localStorage.removeItem('nexusiq_token')
    setToken(null)
    setUser(null)
  }

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, showLoginModal, openLoginModal, closeLoginModal }}>
      {children}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
