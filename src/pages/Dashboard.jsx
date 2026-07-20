import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cpu, FileText, AlertTriangle, ShieldCheck,
  Share2, MessageSquareText, TrendingUp, TrendingDown,
  Activity, Zap, ChevronRight, Clock, FileStack, Wrench, BookOpen
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
  DASHBOARD_KPIs, ACTIVITY_FEED, COVERAGE_DATA, TREND_DATA
} from '../data/dashboardData'

const ICON_MAP = { Cpu, FileText, AlertTriangle, ShieldCheck, Share2, MessageSquareText, FileStack, Wrench, BookOpen, Activity }

const COLOR_MAP = {
  blue: { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.2)', text: 'var(--blue-400)', glow: 'var(--shadow-glow-blue)' },
  green: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: 'var(--green-400)', glow: 'var(--shadow-glow-green)' },
  amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: 'var(--amber-400)', glow: 'var(--shadow-glow-amber)' },
  purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: 'var(--purple-400)', glow: '' },
  red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: 'var(--red-400)', glow: 'var(--shadow-glow-red)' },
  orange: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', text: 'var(--orange-400)', glow: '' },
}

function StatCard({ kpi, delay }) {
  const [count, setCount] = useState(0)
  const Icon = ICON_MAP[kpi.icon] || Activity
  const c = COLOR_MAP[kpi.color] || COLOR_MAP.blue

  useEffect(() => {
    const target = typeof kpi.value === 'number' ? kpi.value : 0
    const step = target / 40
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 30)
    return () => clearInterval(timer)
  }, [kpi.value])

  return (
    <div className="card animate-fade-in" style={{
      animationDelay: `${delay}ms`,
      opacity: 0,
      background: `linear-gradient(135deg, ${c.bg}, transparent)`,
      border: `1px solid ${c.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: c.bg, border: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={c.text} />
        </div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, color: kpi.trendDir === 'up' ? 'var(--green-400)' : kpi.trendDir === 'down' ? 'var(--amber-400)' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          {kpi.trendDir === 'up' ? <TrendingUp size={12} /> : kpi.trendDir === 'down' ? <TrendingDown size={12} /> : null}
          {kpi.trend}
        </span>
      </div>
      <div className="stat-number" style={{ color: c.text }}>
        {count.toLocaleString()}{kpi.unit}
      </div>
      <div className="stat-label">{kpi.label}</div>
    </div>
  )
}

function ActivityItem({ item }) {
  const Icon = ICON_MAP[item.icon] || Activity
  const c = COLOR_MAP[item.color] || COLOR_MAP.blue
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '10px 0',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: c.bg, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={15} color={c.text} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0', lineHeight: 1.3 }}>{item.sub}</p>
      </div>
      <div style={{ flexShrink: 0, fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
        <Clock size={10} />
        {item.time}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem' }}>
      <p style={{ color: 'var(--text-muted)', margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: 'var(--blue-400)', margin: 0, fontWeight: 700 }}>{payload[0].value}{payload[0].name === 'uptime' || payload[0].name === 'compliance' ? '%' : ''}</p>
    </div>
  )
  return null
}

export default function Dashboard() {
  const navigate = useNavigate()

  const quickActions = [
    { label: 'Upload Document', icon: FileStack, color: 'green', to: '/ingestion' },
    { label: 'Ask AI Copilot', icon: MessageSquareText, color: 'blue', to: '/copilot' },
    { label: 'View Alerts', icon: AlertTriangle, color: 'amber', to: '/maintenance' },
    { label: 'Compliance Check', icon: ShieldCheck, color: 'purple', to: '/compliance' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1>Operations Dashboard</h1>
          <p>Real-time view of your industrial knowledge ecosystem — July 20, 2024</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--green-400)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="status-dot online" />
            All systems operational
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/copilot')}>
            <Zap size={14} /> Ask AI Copilot
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-auto mb-lg">
        {DASHBOARD_KPIs.map((kpi, i) => (
          <StatCard key={kpi.id} kpi={kpi} delay={i * 80} />
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {quickActions.map(({ label, icon: Icon, color, to }) => {
          const c = COLOR_MAP[color]
          return (
            <button key={label} className="btn btn-secondary" onClick={() => navigate(to)}
              style={{ border: `1px solid ${c.border}`, gap: 8 }}>
              <Icon size={15} color={c.text} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
        {/* Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Uptime Trend */}
          <div className="card">
            <div className="flex-between mb-md">
              <div>
                <h4 style={{ margin: 0 }}>Equipment Availability Trend</h4>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>6-month rolling average across all assets</p>
              </div>
              <span className="badge badge-green">96.4% Current</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={TREND_DATA.uptime}>
                <defs>
                  <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="uptime" stroke="#10b981" strokeWidth={2} fill="url(#uptimeGrad)" dot={{ fill: '#10b981', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance + Query Volume */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
            <div className="card">
              <div className="flex-between mb-md">
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Compliance Score</h4>
                <span className="badge badge-amber">78%</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={TREND_DATA.compliance}>
                  <defs>
                    <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" name="compliance" stroke="#8b5cf6" strokeWidth={2} fill="url(#compGrad)" dot={{ fill: '#8b5cf6', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="flex-between mb-md">
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Copilot Queries/Month</h4>
                <span className="badge badge-blue">↑ 54%</span>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={TREND_DATA.queryVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card" style={{ maxHeight: 500, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div className="flex-between mb-md">
            <h4 style={{ margin: 0 }}>Live Activity</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--green-400)' }}>
              <div className="status-dot online" />
              Live
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {ACTIVITY_FEED.map(item => <ActivityItem key={item.id} item={item} />)}
          </div>
        </div>
      </div>

      {/* Knowledge Coverage */}
      <div className="card mb-lg">
        <div className="flex-between mb-lg">
          <div>
            <h4 style={{ margin: 0 }}>Knowledge Coverage by Plant Area</h4>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>% of assets with complete documentation in knowledge graph</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/knowledge-graph')}>
            View Graph <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COVERAGE_DATA.map(area => (
            <div key={area.area}>
              <div className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{area.area}</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{area.assets} assets · {area.docs} docs</span>
                  <span style={{
                    fontWeight: 700, fontSize: '0.875rem',
                    color: area.coverage >= 85 ? 'var(--green-400)' : area.coverage >= 70 ? 'var(--amber-400)' : 'var(--red-400)'
                  }}>{area.coverage}%</span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${area.coverage >= 85 ? 'green' : area.coverage >= 70 ? 'amber' : 'red'}`}
                  style={{ width: `${area.coverage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
