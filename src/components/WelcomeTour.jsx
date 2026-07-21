import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChevronRight, Zap, FileStack, Share2, Wrench, ShieldCheck, BookOpen } from 'lucide-react'

const TOUR_STEPS = [
  {
    id: 'welcome',
    icon: Zap,
    color: '#0ea5e9',
    title: 'Welcome to NEXUS IQ',
    subtitle: 'Your Unified Asset & Operations Brain',
    description: 'NEXUS IQ transforms fragmented industrial documents into a unified, queryable knowledge base — connected by AI.',
    action: null,
    route: null,
  },
  {
    id: 'ingestion',
    icon: FileStack,
    color: '#10b981',
    title: 'Step 1: Document Ingestion',
    subtitle: 'Multi-format AI processing pipeline',
    description: 'Upload P&IDs, work orders, scanned forms, emails and OEM manuals. AI extracts entities and builds knowledge connections automatically.',
    action: 'View Document Ingestion',
    route: '/ingestion',
  },
  {
    id: 'graph',
    icon: Share2,
    color: '#8b5cf6',
    title: 'Step 2: Knowledge Graph',
    subtitle: '49 entities · 61 relationships',
    description: 'Every document, equipment tag, person, procedure and regulation is connected in an interactive knowledge graph. Click any node to explore relationships.',
    action: 'Explore Knowledge Graph',
    route: '/knowledge-graph',
  },
  {
    id: 'copilot',
    icon: Zap,
    color: '#0ea5e9',
    title: 'Step 3: Ask the AI Copilot',
    subtitle: 'RAG-powered expert assistant',
    description: 'Ask any question in plain English — vibration limits, maintenance history, compliance status, failure patterns. Get expert answers with source citations.',
    action: 'Open AI Copilot',
    route: '/copilot',
  },
  {
    id: 'maintenance',
    icon: Wrench,
    color: '#f59e0b',
    title: 'Step 4: Predictive Maintenance',
    subtitle: '87% failure probability detected',
    description: 'AI predicts equipment failures before they happen. View root cause analyses with Fishbone diagrams. C-301 compressor needs urgent attention.',
    action: 'View Maintenance Intelligence',
    route: '/maintenance',
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    color: '#a78bfa',
    title: 'Step 5: Compliance Intelligence',
    subtitle: '78% compliance score · 6 gaps found',
    description: 'AI maps your operations against OISD-118, PESO, Factory Act, IBR and API standards. Gaps are auto-detected and remediation actions suggested.',
    action: 'View Compliance Dashboard',
    route: '/compliance',
  },
  {
    id: 'lessons',
    icon: BookOpen,
    color: '#f97316',
    title: 'Step 6: Lessons Learned',
    subtitle: 'Pattern recognition across 347 incidents',
    description: 'AI identifies recurring failure patterns and issues proactive warnings before similar conditions cause another incident — like the monsoon compressor risk today.',
    action: 'View Failure Intelligence',
    route: '/lessons',
  },
]

export default function WelcomeTour({ onClose }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const current = TOUR_STEPS[step]
  const Icon = current.icon
  const isLast = step === TOUR_STEPS.length - 1

  const handleAction = () => {
    if (current.route) {
      onClose()
      navigate(current.route)
    }
  }

  const handleNext = () => {
    if (isLast) onClose()
    else setStep(s => s + 1)
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div
        className="modal-panel"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 520,
          padding: 0,
          overflow: 'hidden',
          border: `1px solid ${current.color}30`,
        }}
      >
        {/* Hero gradient bar */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${current.color}, ${current.color}80)`,
          transition: 'background 0.4s ease',
        }} />

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 24px 0' }}>
          {TOUR_STEPS.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 20 : 8,
                height: 8,
                borderRadius: 4,
                background: i === step ? current.color : i < step ? `${current.color}50` : 'var(--bg-elevated)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '24px 32px 32px' }}>
          {/* Icon */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `${current.color}18`,
              border: `1px solid ${current.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${current.color}20`,
            }}>
              <Icon size={26} color={current.color} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: current.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                {step === 0 ? 'Getting Started' : `${step} of ${TOUR_STEPS.length - 1}`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{current.subtitle}</div>
            </div>
          </div>

          <h2 style={{
            fontSize: '1.5rem', margin: '0 0 12px',
            background: `linear-gradient(135deg, var(--text-primary), ${current.color})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {current.title}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {current.description}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {current.action && (
              <button className="btn btn-secondary" onClick={handleAction} style={{ flex: 1, justifyContent: 'center', border: `1px solid ${current.color}40`, color: current.color }}>
                {current.action} <ChevronRight size={14} />
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{
                flex: 1, justifyContent: 'center',
                background: `linear-gradient(135deg, ${current.color}, ${current.color}cc)`,
                boxShadow: `0 2px 12px ${current.color}40`,
              }}
            >
              {isLast ? 'Get Started →' : 'Next →'}
            </button>
          </div>

          {!isLast && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 14, display: 'block', textAlign: 'center', width: '100%' }}
            >
              Skip tour
            </button>
          )}
        </div>

        {/* Close */}
        <button className="btn btn-ghost" onClick={onClose} style={{ position: 'absolute', top: 12, right: 12 }}>
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
