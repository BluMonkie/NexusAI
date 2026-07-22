import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, AlertTriangle, CheckCircle, Clock, X,
  Calendar, FileText, Download, Zap, ChevronRight, AlertOctagon
} from 'lucide-react'
import { apiFetch } from '../services/apiClient'
import {
  REGULATIONS, COMPLIANCE_REQUIREMENTS,
  AUDIT_CALENDAR, COMPLIANCE_SCORE, QUALITY_DEVIATIONS
} from '../data/complianceData'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts'

const SEVERITY_COLOR = { High: 'red', Medium: 'amber', Low: 'green' }
const STATUS_COLOR = { 'non-compliant': 'red', partial: 'amber', compliant: 'green' }
const STATUS_ICON = { 'non-compliant': AlertOctagon, partial: AlertTriangle, compliant: CheckCircle }

function ComplianceRing({ score }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - score / 100)
  const color = score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position: 'relative', width: 140, height: 140 }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
        <circle cx={70} cy={70} r={r} fill="none" stroke={color} strokeWidth={12}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          filter={`drop-shadow(0 0 8px ${color})`}
          style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{score}%</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Compliant</div>
      </div>
    </div>
  )
}

const TABS = ['Overview', 'Requirements', 'Gaps', 'Audit Calendar', 'Quality']

export default function ComplianceIntelligence() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')
  const [selectedReq, setSelectedReq] = useState(null)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [requirements, setRequirements] = useState([])
  const [gaps, setGaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiFetch('/compliance/requirements')
        setRequirements(data.requirements || [])
        setGaps(data.gaps || [])
      } catch (err) {
        console.warn('Failed to fetch compliance requirements:', err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleGenerateAuditPackage = () => {
    const report = {
      title: "NEXUS IQ — Compliance Audit Package",
      timestamp: new Date().toISOString(),
      overallScore: "87.4%",
      status: "Audit Ready with Minor Warnings",
      standards: ["OISD-STD-117", "PESO Static Pressure Rules", "ISO 45001:2018", "OSHA 1910.147"],
      totalRequirements: requirements.length,
      gapsIdentified: gaps.length
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Compliance_Audit_Package_${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setShowAuditModal(true)
  }

  const radarData = COMPLIANCE_SCORE.byRegulation.map(r => ({ subject: r.reg, score: r.score }))

  return (
    <div>
      {/* Header */}
      <div className="page-header flex-between">
        <div>
          <h1>Compliance Intelligence</h1>
          <p>Regulatory gap detection, audit readiness, and quality deviation monitoring</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleGenerateAuditPackage}>
            <Download size={14} /> Generate Audit Package
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/copilot')}>
            <Zap size={14} /> Ask AI About Compliance
          </button>
        </div>
      </div>

      {/* Score row */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)', alignItems: 'center' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
          <ComplianceRing score={COMPLIANCE_SCORE.overall} />
          <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Overall Compliance Score
          </div>
        </div>
        {[
          { label: 'Total Requirements', value: COMPLIANCE_REQUIREMENTS.length, color: 'blue', targetTab: 'Requirements' },
          { label: 'Non-Compliant', value: COMPLIANCE_REQUIREMENTS.filter(r => r.status === 'non-compliant').length, color: 'red', targetTab: 'Gaps' },
          { label: 'Partial Compliance', value: COMPLIANCE_REQUIREMENTS.filter(r => r.status === 'partial').length, color: 'amber', targetTab: 'Gaps' },
          { label: 'Fully Compliant', value: COMPLIANCE_REQUIREMENTS.filter(r => r.status === 'compliant').length, color: 'green', targetTab: 'Requirements' },
        ].map(({ label, value, color, targetTab }) => {
          const c = { blue: 'var(--blue-400)', red: 'var(--red-400)', amber: 'var(--amber-400)', green: 'var(--green-400)' }[color]
          return (
            <div
              key={label}
              className="card"
              onClick={() => setActiveTab(targetTab)}
              style={{ textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = c}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div className="stat-number" style={{ color: c, fontSize: '2.5rem' }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          )
        })}
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
          {/* Radar chart */}
          <div className="card">
            <h4 style={{ marginBottom: 16 }}>Compliance by Regulation</h4>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Radar name="Compliance" dataKey="score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Per-regulation breakdown */}
          <div className="card">
            <h4 style={{ marginBottom: 16 }}>Breakdown by Standard</h4>
            {COMPLIANCE_SCORE.byRegulation.map(reg => (
              <div key={reg.reg} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{reg.reg}</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {reg.nonCompliant > 0 && <span className="badge badge-red">{reg.nonCompliant}</span>}
                      {reg.partial > 0 && <span className="badge badge-amber">{reg.partial}</span>}
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: reg.score >= 85 ? 'var(--green-400)' : reg.score >= 70 ? 'var(--amber-400)' : 'var(--red-400)' }}>{reg.score}%</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${reg.score >= 85 ? 'green' : reg.score >= 70 ? 'amber' : 'red'}`} style={{ width: `${reg.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements Tab */}
      {activeTab === 'Requirements' && (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Regulation', 'Section', 'Requirement', 'Equipment', 'Frequency', 'Last Done', 'Next Due', 'Status'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPLIANCE_REQUIREMENTS.map(req => {
                  const Icon = STATUS_ICON[req.status]
                  return (
                    <tr key={req.id} style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelectedReq(req)}
                    >
                      <td style={{ padding: '10px 12px' }}><span className="badge badge-blue">{req.regId}</span></td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.section}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{req.title}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{req.equipment.join(', ')}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{req.frequency}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.lastDate || 'N/A'}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: req.nextDue ? 'var(--text-primary)' : 'var(--text-muted)' }}>{req.nextDue || 'N/A'}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge badge-${STATUS_COLOR[req.status]}`} style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                          <Icon size={10} />{req.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gaps Tab */}
      {activeTab === 'Gaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="alert alert-warning">
            AI identified <strong>{COMPLIANCE_GAPS.length} compliance gaps</strong> requiring attention. Auto-generated evidence packages available for compliant items.
          </div>
          {COMPLIANCE_GAPS.map(gap => (
            <div key={gap.id} className="card" style={{
              borderColor: gap.status === 'non-compliant' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)',
              background: gap.status === 'non-compliant' ? 'rgba(239,68,68,0.04)' : 'rgba(245,158,11,0.04)',
            }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ padding: '4px 8px', borderRadius: 6, background: gap.status === 'non-compliant' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', border: `1px solid ${gap.status === 'non-compliant' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`, marginBottom: 6 }}>
                    <span className={`badge badge-${STATUS_COLOR[gap.status]}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertTriangle size={10} />{gap.status === 'non-compliant' ? 'NON-COMPLIANT' : 'PARTIAL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>{gap.severity} severity</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge badge-blue">{gap.regId}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>§{gap.section}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{gap.title}</h4>
                  <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{gap.finding}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Equipment: {gap.equipment.join(', ')}</span>
                    {gap.nextDue && <span style={{ fontSize: '0.75rem', color: 'var(--amber-400)', fontFamily: 'var(--font-mono)' }}>Due: {gap.nextDue}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0, background: 'var(--bg-elevated)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', maxWidth: 220, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--green-400)', marginBottom: 4, fontSize: '0.72rem', textTransform: 'uppercase' }}>Remediation</div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: 10 }}>{gap.remediation}</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', fontSize: '0.72rem', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    onClick={() => navigate(`/copilot?q=${encodeURIComponent(`How to fix compliance gap for ${gap.regId} §${gap.section}: ${gap.title}? Finding: ${gap.finding}`)}`)}
                  >
                    <Zap size={12} /> Fix with AI Copilot
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Calendar Tab */}
      {activeTab === 'Audit Calendar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AUDIT_CALENDAR.map(audit => (
            <div key={audit.id} className="card" style={{
              borderColor: audit.status === 'completed' ? 'var(--border-subtle)' : audit.priority === 'critical' ? 'rgba(239,68,68,0.25)' : 'var(--border-default)',
              opacity: audit.status === 'completed' ? 0.7 : 1,
            }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flexShrink: 0, width: 60 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: audit.status === 'completed' ? 'var(--text-muted)' : audit.priority === 'critical' ? 'var(--red-400)' : 'var(--blue-400)' }}>
                    {audit.date.slice(8, 10)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(audit.date).toLocaleString('default', { month: 'short', year: '2-digit' })}
                  </div>
                </div>
                <div style={{ width: 1, height: 50, background: 'var(--border-subtle)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{audit.title}</span>
                    <span className={`badge badge-${audit.priority === 'critical' ? 'red' : audit.priority === 'high' ? 'amber' : 'blue'}`}>{audit.priority}</span>
                    <span className={`badge badge-${audit.type === 'Statutory' ? 'red' : audit.type === 'External' ? 'amber' : 'blue'}`}>{audit.type}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Lead: {audit.lead} · Scope: {audit.scope}
                  </div>
                </div>
                <span className={`badge badge-${audit.status === 'completed' ? 'green' : audit.status === 'upcoming' ? 'amber' : 'blue'}`}>
                  {audit.status === 'completed' ? <CheckCircle size={10} style={{ display: 'inline' }} /> : <Clock size={10} style={{ display: 'inline' }} />}
                  {' '}{audit.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quality Tab */}
      {activeTab === 'Quality' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="alert alert-info">
            AI is continuously monitoring {QUALITY_DEVIATIONS.length} quality parameters across all process units.
            Deviations are flagged automatically against specification limits.
          </div>
          {QUALITY_DEVIATIONS.map(dev => (
            <div key={dev.id} className="card" style={{ borderColor: dev.severity === 'high' ? 'rgba(245,158,11,0.3)' : 'var(--border-subtle)' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: dev.deviation.startsWith('+') ? 'var(--red-400)' : 'var(--amber-400)' }}>{dev.deviation}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>deviation</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{dev.parameter}</span>
                    <span className={`badge badge-${dev.severity === 'high' ? 'red' : dev.severity === 'medium' ? 'amber' : 'green'}`}>{dev.severity}</span>
                    <span className={`badge badge-${dev.status === 'resolved' ? 'green' : dev.status === 'monitoring' ? 'blue' : 'amber'}`}>{dev.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>Expected: <span style={{ color: 'var(--green-400)' }}>{dev.expected}</span></span>
                    <span>Actual: <span style={{ color: 'var(--red-400)' }}>{dev.actual}</span></span>
                    <span>Area: {dev.area}</span>
                    <span>{dev.date}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--amber-400)' }}>⚠️ Impact: {dev.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Requirement Detail Modal */}
      {selectedReq && (
        <div className="modal-overlay" onClick={() => setSelectedReq(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <div className="flex-between mb-lg">
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span className="badge badge-blue">{selectedReq.regId}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>§{selectedReq.section}</span>
                </div>
                <h3 style={{ margin: 0 }}>{selectedReq.title}</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedReq(null)}><X size={18} /></button>
            </div>
            <div className="grid grid-2 mb-lg" style={{ gap: 10 }}>
              {[
                { label: 'Status', value: selectedReq.status, badge: true },
                { label: 'Severity', value: selectedReq.severity },
                { label: 'Frequency', value: selectedReq.frequency },
                { label: 'Next Due', value: selectedReq.nextDue || 'N/A' },
              ].map(({ label, value, badge }) => (
                <div key={label} className="card" style={{ padding: 12 }}>
                  <div className="section-label mb-sm">{label}</div>
                  {badge
                    ? <span className={`badge badge-${STATUS_COLOR[value]}`}>{value}</span>
                    : <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{value}</div>
                  }
                </div>
              ))}
            </div>
            {selectedReq.finding && (
              <div className="alert alert-warning mb-md">{selectedReq.finding}</div>
            )}
            {selectedReq.remediation && (
              <div className="alert alert-info">{selectedReq.remediation}</div>
            )}
          </div>
        </div>
      )}
      {/* Audit Package Success Modal */}
      {showAuditModal && (
        <div className="modal-overlay" onClick={() => setShowAuditModal(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <div className="flex-between mb-md">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={24} color="var(--green-400)" />
                <h3 style={{ margin: 0 }}>Compliance Audit Package Exported</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowAuditModal(false)}><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
              The comprehensive regulatory compliance audit package has been generated and saved to your downloads folder as a JSON package.
            </p>
            <div className="grid grid-2 mb-lg" style={{ gap: 10 }}>
              {[
                { label: 'Overall Readiness', value: '87.4% (Audit Ready)' },
                { label: 'Standards Covered', value: 'OISD, PESO, ISO, OSHA' },
                { label: 'Total Requirements', value: '14 Standards' },
                { label: 'Export Format', value: 'JSON / PDF Ready' },
              ].map(({ label, value }) => (
                <div key={label} className="card" style={{ padding: 12 }}>
                  <div className="section-label mb-sm">{label}</div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAuditModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
