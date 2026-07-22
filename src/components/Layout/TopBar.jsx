import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, Search, User, Cpu, LogIn, LogOut, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import LoginModal from '../Auth/LoginModal'

const PAGE_TITLES = {
  '/dashboard': { title: 'Operations Dashboard', sub: 'Real-time asset & knowledge overview' },
  '/ingestion': { title: 'Document Ingestion', sub: 'AI-powered document processing pipeline' },
  '/knowledge-graph': { title: 'Knowledge Graph', sub: 'Unified entity relationship explorer' },
  '/copilot': { title: 'AI Copilot', sub: 'Expert knowledge query engine' },
  '/maintenance': { title: 'Maintenance Intelligence', sub: 'RCA & predictive maintenance engine' },
  '/compliance': { title: 'Compliance Intelligence', sub: 'Regulatory gap detection & audit support' },
  '/lessons': { title: 'Lessons Learned', sub: 'Failure pattern intelligence engine' },
}

const SEARCH_ITEMS = [
  { title: 'V-204 High-Pressure Separator', type: 'Equipment', sub: 'Area 200 Hydrocracker', path: '/knowledge-graph' },
  { title: 'P-101A Crude Charge Pump A', type: 'Equipment', sub: 'Area 100 Crude Unit', path: '/knowledge-graph' },
  { title: 'C-301 Fluid Catalytic Cracker', type: 'Equipment', sub: 'Area 300 FCC Unit', path: '/knowledge-graph' },
  { title: 'SOP-CL-409-REV2: FCC V-204 Emergency Protocol', type: 'Document', sub: 'Indexed in RAG', path: '/ingestion' },
  { title: 'SOP-EHS-04: Lockout / Tagout Safety Protocol', type: 'Procedure', sub: 'OSHA 1910.147', path: '/compliance' },
  { title: 'INC-2024-88: P-101A Mechanical Seal Failure', type: 'Incident', sub: 'RCA Completed', path: '/lessons' },
  { title: 'OISD-STD-117: Fire Protection Systems', type: 'Compliance', sub: 'Refinery Deluge Coverage', path: '/compliance' },
]

const NOTIFICATIONS = [
  { id: 1, type: 'critical', text: 'Compressor C-301 shows 87% failure probability in next 14 days', time: '2m ago' },
  { id: 2, type: 'warning', text: 'OISD-118 compliance gap detected in Tank Farm B', time: '18m ago' },
  { id: 3, type: 'info', text: '14 new documents ingested from Plant Data System', time: '1h ago' },
  { id: 4, type: 'info', text: 'RCA completed for Pump P-104 seal failure', time: '3h ago' },
]

export default function TopBar({ sidebarCollapsed }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout, openLoginModal } = useAuth()
  const page = PAGE_TITLES[pathname] || { title: 'NEXUS IQ', sub: '' }
  const [showNotifs, setShowNotifs] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  const unread = NOTIFICATIONS.filter(n => n.type === 'critical' || n.type === 'warning').length

  const getInitials = (name) => {
    if (!name) return 'IQ'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        right: 0,
        height: 'var(--topbar-height)',
        background: 'rgba(5,13,26,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        zIndex: 100,
        transition: 'left var(--transition-base)',
      }}>
        {/* Page Title */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: 700,
            margin: 0,
            background: 'linear-gradient(135deg, var(--text-primary), var(--blue-400))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>{page.title}</h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{page.sub}</p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 280px' }} className="hide-mobile">
          <Search size={15} style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', zIndex: 2,
          }} />
          <input
            className="input"
            style={{ paddingLeft: 32, fontSize: '0.8125rem', height: 36, width: '100%' }}
            placeholder="Search assets, documents, SOPs..."
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); setShowSearchResults(true) }}
            onFocus={() => setShowSearchResults(true)}
            onKeyDown={e => {
              if (e.key === 'Enter' && searchVal.trim()) {
                setShowSearchResults(false)
                navigate(`/copilot?q=${encodeURIComponent(searchVal)}`)
              }
            }}
          />
          {showSearchResults && searchVal.trim().length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
              zIndex: 400, overflow: 'hidden', maxHeight: 300, overflowY: 'auto'
            }}>
              {SEARCH_ITEMS.filter(item =>
                item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                item.type.toLowerCase().includes(searchVal.toLowerCase()) ||
                item.sub.toLowerCase().includes(searchVal.toLowerCase())
              ).length === 0 ? (
                <div style={{ padding: 12, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No exact matches found. Press <kbd style={{ background: 'var(--bg-elevated)', padding: '2px 4px', borderRadius: 4 }}>Enter</kbd> to ask Copilot!
                </div>
              ) : (
                SEARCH_ITEMS.filter(item =>
                  item.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                  item.type.toLowerCase().includes(searchVal.toLowerCase()) ||
                  item.sub.toLowerCase().includes(searchVal.toLowerCase())
                ).map((item, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setShowSearchResults(false)
                      setSearchVal('')
                      navigate(item.path)
                    }}
                    style={{
                      padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                    </div>
                    <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{item.type}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--green-400)' }} className="hide-mobile">
          <div className="status-dot online" />
          <span>Backend REST API Live</span>
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(v => !v)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '7px 9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Bell size={17} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--red-500)',
                color: 'white',
                fontSize: '0.6rem',
                fontWeight: 700,
                width: 16, height: 16,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--bg-base)',
              }}>{unread}</span>
            )}
          </button>
          {showNotifs && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 340,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 300,
              overflow: 'hidden',
              animation: 'scale-in 0.2s ease',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Notifications</span>
                <span className="badge badge-red">{unread} urgent</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                    background: n.type === 'critical' ? 'var(--red-500)'
                      : n.type === 'warning' ? 'var(--amber-500)'
                      : 'var(--blue-500)',
                    boxShadow: `0 0 6px ${n.type === 'critical' ? 'var(--red-500)' : n.type === 'warning' ? 'var(--amber-500)' : 'var(--blue-500)'}`,
                  }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{n.text}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Auth Badge & Role Switcher */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              onClick={openLoginModal}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 12px', borderRadius: 20,
                background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
              title="Click to switch role or account"
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.7rem', color: 'white',
              }}>
                {getInitials(user.name)}
              </div>
              <div style={{ textAlign: 'left' }} className="hide-mobile">
                <div style={{ fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.1 }}>{user.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--blue-400)', fontWeight: 600 }}>{user.role}</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={logout} title="Sign Out">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={openLoginModal}>
            <LogIn size={14} /> Sign In
          </button>
        )}
      </header>
    </>
  )
}

