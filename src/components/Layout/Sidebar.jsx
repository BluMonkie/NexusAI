import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileStack, Share2, MessageSquareText,
  Wrench, ShieldCheck, BookOpen, Settings, ChevronLeft,
  ChevronRight, Zap
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ingestion', icon: FileStack, label: 'Doc Ingestion' },
  { to: '/knowledge-graph', icon: Share2, label: 'Knowledge Graph' },
  { to: '/copilot', icon: MessageSquareText, label: 'AI Copilot' },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance RCA' },
  { to: '/compliance', icon: ShieldCheck, label: 'Compliance' },
  { to: '/lessons', icon: BookOpen, label: 'Lessons Learned' },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className="sidebar" style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      background: 'linear-gradient(180deg, #07111f 0%, #050d1a 100%)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      transition: 'width var(--transition-base)',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        height: 'var(--topbar-height)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid var(--border-subtle)',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 20px rgba(14,165,233,0.4)',
        }}>
          <Zap size={18} color="white" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              NEXUS <span style={{ color: 'var(--blue-400)' }}>IQ</span>
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Industrial Intelligence
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && (
          <div className="section-label" style={{ padding: '4px 8px 8px' }}>Navigation</div>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '10px' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 'var(--radius-md)',
              marginBottom: 2,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all var(--transition-fast)',
              whiteSpace: 'nowrap',
              color: isActive ? 'var(--blue-400)' : 'var(--text-muted)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(139,92,246,0.06))'
                : 'transparent',
              border: isActive ? '1px solid rgba(14,165,233,0.2)' : '1px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--blue-400)' : 'var(--text-muted)' }} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        <div className="divider" style={{ margin: '12px 4px' }} />

        <NavLink
          to="/settings"
          title="Settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px' : '10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap',
            color: isActive ? 'var(--blue-400)' : 'var(--text-muted)',
            background: isActive ? 'rgba(14,165,233,0.1)' : 'transparent',
            border: '1px solid transparent',
          })}
        >
          <Settings size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
        }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}>System Status</div>
          {[
            { label: 'AI Engine', color: 'var(--green-500)' },
            { label: 'Knowledge Graph', color: 'var(--green-500)' },
            { label: 'RAG Pipeline', color: 'var(--amber-500)' },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
              <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: 20,
          right: -12,
          width: 24, height: 24,
          borderRadius: '50%',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-secondary)',
          transition: 'all var(--transition-fast)',
          zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </aside>
  )
}
