import { useLocation } from 'react-router-dom'
import { Bell, Search, User, Cpu } from 'lucide-react'
import { useState } from 'react'

const PAGE_TITLES = {
  '/dashboard': { title: 'Operations Dashboard', sub: 'Real-time asset & knowledge overview' },
  '/ingestion': { title: 'Document Ingestion', sub: 'AI-powered document processing pipeline' },
  '/knowledge-graph': { title: 'Knowledge Graph', sub: 'Unified entity relationship explorer' },
  '/copilot': { title: 'AI Copilot', sub: 'Expert knowledge query engine' },
  '/maintenance': { title: 'Maintenance Intelligence', sub: 'RCA & predictive maintenance engine' },
  '/compliance': { title: 'Compliance Intelligence', sub: 'Regulatory gap detection & audit support' },
  '/lessons': { title: 'Lessons Learned', sub: 'Failure pattern intelligence engine' },
  '/settings': { title: 'Settings & Configuration', sub: 'AI engine & API configuration' },
}

const NOTIFICATIONS = [
  { id: 1, type: 'critical', text: 'Compressor C-301 shows 87% failure probability in next 14 days', time: '2m ago' },
  { id: 2, type: 'warning', text: 'OISD-118 compliance gap detected in Tank Farm B', time: '18m ago' },
  { id: 3, type: 'info', text: '14 new documents ingested from Plant Data System', time: '1h ago' },
  { id: 4, type: 'info', text: 'RCA completed for Pump P-104 seal failure', time: '3h ago' },
]

export default function TopBar({ sidebarCollapsed }) {
  const { pathname } = useLocation()
  const page = PAGE_TITLES[pathname] || { title: 'NEXUS IQ', sub: '' }
  const [showNotifs, setShowNotifs] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const unread = NOTIFICATIONS.filter(n => n.type === 'critical' || n.type === 'warning').length

  return (
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
          color: 'var(--text-muted)',
        }} />
        <input
          className="input"
          style={{ paddingLeft: 32, fontSize: '0.8125rem', height: 36 }}
          placeholder="Search assets, documents, procedures..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
        />
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--green-400)' }} className="hide-mobile">
        <div className="status-dot online" />
        <span>Live</span>
      </div>

      {/* AI Status chip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '4px 10px',
        background: 'rgba(14,165,233,0.08)',
        border: '1px solid rgba(14,165,233,0.2)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        color: 'var(--blue-400)',
        fontWeight: 600,
      }} className="hide-mobile">
        <Cpu size={13} />
        AI Engine Online
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

      {/* User Avatar */}
      <div style={{
        width: 34, height: 34,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 700, fontSize: '0.8rem', color: 'white',
        flexShrink: 0,
      }}>
        RK
      </div>
    </header>
  )
}
