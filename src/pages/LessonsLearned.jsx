import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  BookOpen, AlertTriangle, TrendingUp, Search,
  Filter, X, ChevronRight, Eye, Zap, ArrowRight,
  AlertOctagon, Clock, Plus
} from 'lucide-react'
import { apiFetch } from '../services/apiClient'
import {
  INCIDENTS, PATTERN_CLUSTERS, PROACTIVE_WARNINGS, INCIDENT_TRENDS
} from '../data/lessonsLearnedData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const SEVERITY_COLOR = { Critical: 'red', High: 'amber', Medium: 'blue', Low: 'green' }
const SEVERITY_MAP = { critical: 'red', high: 'amber', medium: 'blue', low: 'green' }

const TABS = ['Proactive Warnings', 'Pattern Clusters', 'Incident Search', 'Trends']

function IncidentModal({ incident, onClose }) {
  if (!incident) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
        <div className="flex-between mb-md">
          <div>
            <span className={`badge badge-${SEVERITY_COLOR[incident.severity]}`} style={{ marginBottom: 8, display: 'inline-block' }}>{incident.severity}</span>
            <h3 style={{ margin: 0 }}>{incident.title}</h3>
          </div>
          <button className="btn btn-ghost" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="grid grid-2 mb-lg" style={{ gap: 10 }}>
          {[
            { label: 'Date', value: incident.date },
            { label: 'Equipment', value: incident.equipment },
            { label: 'Area', value: incident.area },
            { label: 'Downtime', value: incident.downtime > 0 ? `${incident.downtime}h` : 'None' },
            { label: 'Type', value: incident.type },
            { label: 'Status', value: incident.status },
          ].map(({ label, value }) => (
            <div key={label} className="card" style={{ padding: 12 }}>
              <div className="section-label mb-sm">{label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{value}</div>
            </div>
          ))}
        </div>
        <div className="section-label mb-sm">Description</div>
        <p style={{ margin: '0 0 16px', fontSize: '0.875rem', lineHeight: 1.6 }}>{incident.description}</p>
        <div className="section-label mb-sm">Tags</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {incident.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  )
}

export default function LessonsLearned() {
  const [activeTab, setActiveTab] = useState('Proactive Warnings')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [selectedSeverity, setSelectedSeverity] = useState('All')
  const navigate = useNavigate()

  const filteredIncidents = INCIDENTS.filter(inc => {
    const matchSearch = searchQuery === '' ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchSeverity = selectedSeverity === 'All' || inc.severity === selectedSeverity
    return matchSearch && matchSeverity
  })

  const pieData = INCIDENT_TRENDS.byType.map(t => ({ name: t.type, value: t.count }))
  const pieColors = ['#ef4444', '#8b5cf6', '#0ea5e9', '#f59e0b']

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h1>Lessons Learned & Failure Intelligence</h1>
          <p>AI-driven pattern recognition across {INCIDENTS.length} incidents and near-misses (2020–2024)</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/copilot')}>
          <Zap size={14} /> Query Incident Database
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-4 mb-lg">
        {[
          { label: 'Total Incidents', value: INCIDENTS.length, color: 'blue' },
          { label: 'Active Warnings', value: PROACTIVE_WARNINGS.filter(w => w.severity === 'critical' || w.severity === 'high').length, color: 'red' },
          { label: 'Pattern Clusters', value: PATTERN_CLUSTERS.length, color: 'purple' },
          { label: 'Total Downtime Hrs', value: INCIDENTS.reduce((a, b) => a + b.downtime, 0), color: 'amber' },
        ].map(({ label, value, color }) => {
          const c = { blue: 'var(--blue-400)', red: 'var(--red-400)', purple: 'var(--purple-400)', amber: 'var(--amber-400)' }[color]
          return (
            <div key={label} className="card" style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{ color: c }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="tabs mb-lg">
        {TABS.map(tab => (
          <button key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'Proactive Warnings' && PROACTIVE_WARNINGS.filter(w => w.severity === 'critical').length > 0 && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red-500)', display: 'inline-block', marginRight: 4 }} />
            )}
            {tab}
          </button>
        ))}
      </div>

      {/* Proactive Warnings Tab */}
      {activeTab === 'Proactive Warnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="alert alert-warning">
            AI has identified <strong>{PROACTIVE_WARNINGS.length} proactive warnings</strong> based on pattern matching with historical incidents. These are pushed to operational teams before similar conditions recur.
          </div>
          {PROACTIVE_WARNINGS.map(warning => (
            <div key={warning.id} className={`card glow-${warning.severity === 'critical' ? 'red' : warning.severity === 'high' ? 'amber' : ''}`} style={{
              borderColor: warning.severity === 'critical' ? 'rgba(239,68,68,0.35)' : warning.severity === 'high' ? 'rgba(245,158,11,0.35)' : 'var(--border-default)',
              background: warning.severity === 'critical' ? 'rgba(239,68,68,0.05)' : warning.severity === 'high' ? 'rgba(245,158,11,0.04)' : 'var(--bg-card)',
            }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <AlertOctagon size={28} color={warning.severity === 'critical' ? 'var(--red-400)' : warning.severity === 'high' ? 'var(--amber-400)' : 'var(--blue-400)'} />
                  <span className={`badge badge-${SEVERITY_MAP[warning.severity]}`}>{warning.severity}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 6px' }}>{warning.title}</h4>
                  <p style={{ margin: '0 0 10px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{warning.message}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Based on:</span>
                    {warning.basedOn.map(id => <span key={id} className="tag" style={{ fontSize: '0.68rem' }}>{id}</span>)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8, fontSize: '0.8rem', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--green-400)', fontWeight: 700 }}>→ Action: </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{warning.action}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />
                      {new Date(warning.pushed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pattern Clusters Tab */}
      {activeTab === 'Pattern Clusters' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {PATTERN_CLUSTERS.map(cluster => (
            <div key={cluster.id} className="card">
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <h4 style={{ margin: 0 }}>{cluster.title}</h4>
                    <span className={`badge badge-${SEVERITY_MAP[cluster.severity]}`}>{cluster.severity}</span>
                    <span className="badge badge-purple">{cluster.incidentCount} incidents</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                    <span>Total cost: <strong style={{ color: 'var(--red-400)' }}>₹{(cluster.totalCost / 100000).toFixed(1)} Lakhs</strong></span>
                    <span>Total downtime: <strong style={{ color: 'var(--amber-400)' }}>{cluster.totalDowntime}h</strong></span>
                    <span>Trend: <strong style={{ color: cluster.trend === 'recurring' ? 'var(--red-400)' : cluster.trend === 'seasonal' ? 'var(--amber-400)' : 'var(--blue-400)' }}>{cluster.trend}</strong></span>
                  </div>
                </div>
              </div>

              {/* Common factors */}
              <div className="section-label mb-sm">Common Factors</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {cluster.commonFactors.map(f => <span key={f} className="badge badge-amber">{f}</span>)}
              </div>

              {/* AI Insight */}
              <div style={{ padding: 14, background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 10, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Zap size={14} color="var(--blue-400)" />
                  <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--blue-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Insight</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{cluster.aiInsight}</p>
              </div>

              {/* Recommendation */}
              <div style={{ padding: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--green-400)', marginBottom: 4, textTransform: 'uppercase' }}>Recommendation</div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{cluster.recommendation}</p>
              </div>

              {/* Linked incidents */}
              <div className="section-label mb-sm">Linked Incidents</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {cluster.incidents.map(id => {
                  const inc = INCIDENTS.find(i => i.id === id)
                  return (
                    <button key={id} className="tag" onClick={() => setSelectedIncident(inc)}
                      style={{ cursor: 'pointer' }}>
                      {id}
                    </button>
                  )
                })}
              </div>

              {/* Proactive warning */}
              {cluster.proactiveWarning && (
                <div className="alert alert-danger" style={{ marginTop: 12 }}>
                  🔴 {cluster.proactiveWarning}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Incident Search Tab */}
      {activeTab === 'Incident Search' && (
        <div>
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" style={{ paddingLeft: 32, height: 38 }}
                placeholder="Search incidents by title, equipment, or tag..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
                <button key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`btn btn-sm ${selectedSeverity === sev ? 'btn-primary' : 'btn-secondary'}`}>
                  {sev}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filteredIncidents.length} incidents found</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredIncidents.map(inc => (
              <div key={inc.id} className="card" style={{ cursor: 'pointer' }}
                onClick={() => setSelectedIncident(inc)}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-active)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ flexShrink: 0, textAlign: 'center', width: 60 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inc.date}</div>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--blue-400)', marginTop: 2 }}>{inc.equipment}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{inc.title}</span>
                      <span className={`badge badge-${SEVERITY_COLOR[inc.severity]}`}>{inc.severity}</span>
                      <span className="badge badge-blue">{inc.type}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {inc.area} · {inc.downtime > 0 ? `${inc.downtime}h downtime` : 'No downtime'} · {inc.status}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 5 }}>
                      {inc.tags.slice(0, 4).map(t => <span key={t} className="tag" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>{t}</span>)}
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'Trends' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
          {/* Monthly trend */}
          <div className="card">
            <h4 style={{ marginBottom: 16 }}>Incidents & Downtime by Month (12M)</h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={INCIDENT_TRENDS.byMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8 }} />
                <Bar dataKey="count" name="Incidents" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
                <Bar dataKey="downtime" name="Downtime (h)" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div className="card">
              <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>By Type</h4>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: '0.78rem' }} />
                </PieChart>
              </ResponsiveContainer>
              {INCIDENT_TRENDS.byType.map((t, i) => (
                <div key={t.type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: pieColors[i], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', flex: 1 }}>{t.type}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{t.count}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h4 style={{ marginBottom: 12, fontSize: '0.95rem' }}>By Severity</h4>
              {INCIDENT_TRENDS.bySeverity.map(s => (
                <div key={s.severity} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span className={`badge badge-${SEVERITY_COLOR[s.severity]}`}>{s.severity}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 80, height: 6 }}>
                      <div className={`progress-fill ${SEVERITY_COLOR[s.severity]}`} style={{ width: `${(s.count / 15) * 100}%` }} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem' }}>{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedIncident && <IncidentModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} />}
    </div>
  )
}
