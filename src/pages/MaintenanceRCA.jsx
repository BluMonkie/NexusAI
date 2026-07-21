import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wrench, AlertTriangle, TrendingDown, Clock, X,
  CheckCircle, Loader, ChevronRight, Activity,
  BarChart2, Calendar, FileText, Zap, ArrowUp, ArrowDown
} from 'lucide-react'
import {
  EQUIPMENT_HEALTH, WORK_ORDERS, RCA_CASES, PREDICTIVE_ALERTS,
  MAINTENANCE_KPIs, FAILURE_TIMELINE
} from '../data/maintenanceData'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  AreaChart, Area,
} from 'recharts'

const SEVERITY_COLORS = { critical: 'var(--red-400)', high: 'var(--amber-400)', medium: 'var(--blue-400)', low: 'var(--green-400)' }
const STATUS_COLORS = { open: 'amber', 'in-progress': 'blue', planned: 'purple', closed: 'green' }

function HealthGauge({ value, size = 80 }) {
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444'
  const radius = (size - 10) / 2
  const circ = 2 * Math.PI * radius
  const dashOffset = circ * (1 - value / 100)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color}
        strokeWidth={8} strokeDasharray={circ} strokeDashoffset={dashOffset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        filter={`drop-shadow(0 0 6px ${color})`}
      />
    </svg>
  )
}

function FishboneModal({ rca, onClose }) {
  if (!rca) return null
  const categories = ['machine', 'method', 'man', 'material', 'measurement', 'environment']
  const catLabels = { machine: 'Machine', method: 'Method', man: 'Man', material: 'Material', measurement: 'Measurement', environment: 'Environment' }
  const catColors = { machine: '#0ea5e9', method: '#8b5cf6', man: '#10b981', material: '#f59e0b', measurement: '#f97316', environment: '#ef4444' }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 820, padding: 28 }}>
        <div className="flex-between mb-lg">
          <div>
            <h3 style={{ margin: '0 0 4px' }}>RCA — Fishbone Analysis</h3>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>{rca.title} · {rca.date}</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Summary */}
        <div className="alert alert-warning mb-lg">{rca.summary}</div>

        {/* Fishbone grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          {categories.map(cat => (
            <div key={cat} style={{
              background: `${catColors[cat]}10`, border: `1px solid ${catColors[cat]}25`,
              borderRadius: 10, padding: 12,
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: catColors[cat], marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {catLabels[cat]}
              </div>
              {rca.causes[cat]?.map((cause, i) => (
                <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${catColors[cat]}50` }}>
                  {cause}
                </div>
              ))}
              {(!rca.causes[cat] || rca.causes[cat].length === 0) && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No factors identified</div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="section-label mb-sm">Corrective Actions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {rca.actions.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
              {a.status === 'done' ? <CheckCircle size={15} color="var(--green-400)" /> :
               a.status === 'in-progress' ? <Loader size={15} color="var(--blue-400)" className="animate-spin" /> :
               <div style={{ width: 15, height: 15, borderRadius: '50%', border: '2px solid var(--text-muted)' }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.action}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.owner} · Due {a.due}</div>
              </div>
              <span className={`badge badge-${a.status === 'done' ? 'green' : a.status === 'in-progress' ? 'blue' : 'amber'}`}>
                {a.status === 'done' ? 'Done' : a.status === 'in-progress' ? 'In Progress' : 'Planned'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--red-400)' }}>{rca.downtime}</div>
            <div className="stat-label">Downtime</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--amber-400)' }}>{rca.cost}</div>
            <div className="stat-label">Total Cost</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
            <span className={`badge badge-${rca.status === 'Closed' ? 'green' : 'amber'}`}>{rca.status}</span>
            <div className="stat-label" style={{ marginTop: 4 }}>Status</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TABS = ['Overview', 'Equipment Health', 'Work Orders', 'RCA Cases']

export default function MaintenanceRCA() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedRCA, setSelectedRCA] = useState(null)
  const navigate = useNavigate()

  const criticalEquipment = EQUIPMENT_HEALTH.filter(e => e.criticalFlag)
  const openWOs = WORK_ORDERS.filter(w => w.status !== 'closed')

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h1>Maintenance Intelligence & RCA</h1>
          <p>Predictive maintenance, root cause analysis, and equipment health monitoring</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/copilot')}>
          <Zap size={14} /> Ask AI About Equipment
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-auto mb-lg">
        {Object.entries(MAINTENANCE_KPIs).map(([key, kpi]) => (
          <div key={key} className="card">
            <div className="section-label mb-sm">{kpi.label}</div>
            <div className="stat-number" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {kpi.value} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{kpi.unit}</span>
            </div>
            {kpi.trend && (
              <div style={{ marginTop: 4, fontSize: '0.75rem', color: kpi.trend.startsWith('+') || kpi.trend.startsWith('↑') ? 'var(--green-400)' : 'var(--amber-400)' }}>
                {kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Predictive Alerts */}
      <div className="card mb-lg">
        <div className="flex-between mb-md">
          <h4 style={{ margin: 0 }}>🤖 AI Predictive Alerts</h4>
          <span className="badge badge-red">{PREDICTIVE_ALERTS.filter(a => a.severity === 'critical').length} Critical</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PREDICTIVE_ALERTS.map(alert => (
            <div key={alert.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 10,
              background: alert.severity === 'critical' ? 'rgba(239,68,68,0.06)' : alert.severity === 'high' ? 'rgba(245,158,11,0.06)' : alert.severity === 'medium' ? 'rgba(14,165,233,0.06)' : 'rgba(16,185,129,0.06)',
              border: `1px solid ${alert.severity === 'critical' ? 'rgba(239,68,68,0.2)' : alert.severity === 'high' ? 'rgba(245,158,11,0.2)' : alert.severity === 'medium' ? 'rgba(14,165,233,0.2)' : 'rgba(16,185,129,0.2)'}`,
            }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: SEVERITY_COLORS[alert.severity] }}>{alert.probability}%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>failure risk</div>
              </div>
              <div style={{ width: 1, height: 40, background: 'var(--border-subtle)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{alert.equipment}</span>
                  <span className={`badge badge-${alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'amber' : alert.severity === 'medium' ? 'blue' : 'green'}`}>{alert.severity}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>· {alert.type}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{alert.message}</p>
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.daysToFailure}d</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>to failure</div>
              </div>
              <div style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 3,
                padding: '6px 10px', background: 'var(--bg-elevated)', borderRadius: 8,
                fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: 180,
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Action</div>
                <div>{alert.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-lg">
        {TABS.map(tab => (
          <button key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
          {/* Failure Timeline */}
          <div className="card">
            <h4 style={{ marginBottom: 16 }}>Failure Timeline (12 months)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAILURE_TIMELINE.map((event, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ textAlign: 'right', flexShrink: 0, width: 70 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{event.date.slice(5)}</div>
                  </div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: event.severity === 'High' ? 'var(--red-500)' : event.severity === 'Medium' ? 'var(--amber-500)' : 'var(--green-500)' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{event.equipment} — {event.type}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{event.downtime > 0 ? `${event.downtime}h downtime` : 'No downtime'}</div>
                  </div>
                  {event.rcaId && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ marginLeft: 'auto', fontSize: '0.7rem' }}
                      onClick={() => setSelectedRCA(RCA_CASES.find(r => r.id === event.rcaId))}
                    >
                      RCA <ChevronRight size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Open WOs */}
          <div className="card">
            <div className="flex-between mb-md">
              <h4 style={{ margin: 0 }}>Open Work Orders</h4>
              <span className="badge badge-amber">{openWOs.length} open</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {openWOs.map(wo => (
                <div key={wo.id} style={{ padding: '10px 12px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                  <div className="flex-between mb-sm">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--blue-400)' }}>{wo.id}</span>
                    <span className={`badge badge-${STATUS_COLORS[wo.status] || 'amber'}`}>{wo.status}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{wo.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{wo.equipment} · {wo.type} · Due {wo.due}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Health Tab */}
      {activeTab === 'Equipment Health' && (
        <div className="grid grid-3">
          {EQUIPMENT_HEALTH.sort((a, b) => a.health - b.health).map(eq => (
            <div key={eq.id} className={`card${eq.criticalFlag ? ' glow-red' : ''}`} style={{ borderColor: eq.criticalFlag ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)' }}>
              <div className="flex-between mb-md">
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--blue-400)', marginBottom: 2 }}>{eq.id}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{eq.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{eq.area} · {eq.type}</div>
                </div>
                <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                  <HealthGauge value={eq.health} size={64} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: eq.health >= 80 ? 'var(--green-400)' : eq.health >= 60 ? 'var(--amber-400)' : 'var(--red-400)' }}>
                      {eq.health}%
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {eq.vibration !== null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Vibration</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: eq.vibration > 25 ? 'var(--amber-400)' : 'var(--text-primary)' }}>{eq.vibration} μm</span>
                  </div>
                )}
                {eq.temp !== null && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Temperature</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{eq.temp}°C</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Next PM</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontSize: '0.7rem' }}>{eq.nextPM}</span>
                </div>
              </div>
              {eq.criticalFlag && (
                <div className="alert alert-danger" style={{ marginTop: 10, padding: '6px 10px', fontSize: '0.75rem' }}>
                  ⚠️ Critical — Action Required
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Work Orders Tab */}
      {activeTab === 'Work Orders' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['WO ID', 'Equipment', 'Title', 'Type', 'Priority', 'Status', 'Assigned', 'Due'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORK_ORDERS.map(wo => (
                  <tr key={wo.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--blue-400)', fontSize: '0.78rem' }}>{wo.id}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{wo.equipment}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{wo.title}</td>
                    <td style={{ padding: '10px 12px' }}><span className="badge badge-blue">{wo.type}</span></td>
                    <td style={{ padding: '10px 12px' }}><span className={`badge badge-${wo.priority === 'critical' ? 'red' : wo.priority === 'high' ? 'amber' : wo.priority === 'medium' ? 'blue' : 'green'}`}>{wo.priority}</span></td>
                    <td style={{ padding: '10px 12px' }}><span className={`badge badge-${STATUS_COLORS[wo.status]}`}>{wo.status}</span></td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{wo.assigned}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{wo.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RCA Cases Tab */}
      {activeTab === 'RCA Cases' && (
        <div className="grid grid-3">
          {RCA_CASES.map(rca => (
            <div key={rca.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedRCA(rca)}>
              <div className="flex-between mb-md">
                <span className={`badge badge-${rca.severity === 'High' ? 'red' : rca.severity === 'Medium' ? 'amber' : 'blue'}`}>{rca.severity}</span>
                <span className={`badge badge-${rca.status === 'Closed' ? 'green' : 'amber'}`}>{rca.status}</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: 6 }}>{rca.title}</h4>
              <p style={{ fontSize: '0.8rem', margin: '0 0 12px', color: 'var(--text-muted)' }}>{rca.summary.slice(0, 90)}...</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ textAlign: 'center', flex: 1, background: 'var(--bg-elevated)', borderRadius: 8, padding: '6px 8px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--red-400)', fontSize: '0.9rem' }}>{rca.downtime}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>downtime</div>
                </div>
                <div style={{ textAlign: 'center', flex: 1, background: 'var(--bg-elevated)', borderRadius: 8, padding: '6px 8px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--amber-400)', fontSize: '0.85rem' }}>{rca.cost}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>cost</div>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
                View Fishbone RCA <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* RCA Modal */}
      {selectedRCA && <FishboneModal rca={selectedRCA} onClose={() => setSelectedRCA(null)} />}
    </div>
  )
}
