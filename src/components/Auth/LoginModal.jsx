import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LogIn, Shield, Wrench, FileText, CheckCircle, Lock, User } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { role: 'Plant Engineer', email: 'engineer@nexusiq.io', name: 'Rajesh Kumar', icon: Shield, badge: 'badge-blue', desc: 'Full RAG access, Knowledge Graph editing & asset creation.' },
  { role: 'Maintenance Technician', email: 'technician@nexusiq.io', name: 'Vikram Singh', icon: Wrench, badge: 'badge-amber', desc: 'Work order management & RCA logging.' },
  { role: 'EHS Specialist', email: 'ehs@nexusiq.io', name: 'Ananya Sharma', icon: FileText, badge: 'badge-purple', desc: 'Compliance audits & Incident lesson management.' },
  { role: 'Plant Administrator', email: 'admin@nexusiq.io', name: 'Admin User', icon: Lock, badge: 'badge-green', desc: 'Global administrative privileges & document deletion.' },
]

export default function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleCustomLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (accountEmail) => {
    setLoading(true)
    setError(null)
    try {
      await login(accountEmail, 'password')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(5, 13, 26, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div className="card" style={{
        maxWidth: 500, width: '100%', borderRadius: 16,
        border: '1px solid var(--border-default)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} color="white" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Enterprise Authentication</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select an industrial role or sign in</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Quick Demo Role Sign-In</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.icon
              return (
                <div key={acc.email} onClick={() => handleDemoLogin(acc.email)}
                  style={{
                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue-400)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 8, borderRadius: 8, background: 'rgba(14, 165, 233, 0.1)' }}>
                      <Icon size={18} color="var(--blue-400)" />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{acc.name}</span>
                        <span className={`badge ${acc.badge}`}>{acc.role}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{acc.desc}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="divider" style={{ margin: '16px 0' }} />

        <form onSubmit={handleCustomLogin}>
          <div className="section-label" style={{ marginBottom: 10 }}>Manual Credentials</div>
          <div style={{ marginBottom: 12 }}>
            <input className="input" type="email" placeholder="email@nexusiq.io" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input className="input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : <><LogIn size={15} /> Sign In</>}
          </button>
        </form>
      </div>
    </div>
  )
}
