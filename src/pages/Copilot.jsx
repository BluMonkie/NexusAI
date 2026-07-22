import { useState, useRef, useEffect } from 'react'
import { Send, Cpu, User, ChevronRight, RotateCcw, Zap, FileText, Star, X, LogIn, Shield } from 'lucide-react'
import { queryAI, AI_CONFIG } from '../services/aiService'
import { STARTER_QUESTIONS } from '../data/copilotResponses'
import { useAuth } from '../context/AuthContext'

const AI_AVATAR = () => (
  <div style={{
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 16px rgba(14,165,233,0.4)',
  }}>
    <Zap size={16} color="white" />
  </div>
)

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <AI_AVATAR />
      <div className="chat-bubble-ai" style={{ padding: '14px 18px' }}>
        <div className="typing-dots" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}

function SourceCitation({ source, index }) {
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 8,
      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
      fontSize: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <FileText size={11} color="var(--blue-400)" />
        <span style={{ color: 'var(--blue-400)', fontWeight: 700 }}>Source {index + 1}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: source.confidence >= 90 ? 'var(--green-400)' : source.confidence >= 75 ? 'var(--amber-400)' : 'var(--text-muted)' }}>
          {source.confidence}%
        </span>
      </div>
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>{source.doc}</div>
      {source.page && <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>Page {source.page}</div>}
      <div style={{ marginTop: 5 }}>
        <div className="confidence-bar">
          <div className="confidence-fill" style={{
            width: `${source.confidence}%`,
            background: source.confidence >= 90 ? 'var(--green-500)' : source.confidence >= 75 ? 'var(--amber-500)' : 'var(--blue-500)',
          }} />
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ msg }) {
  const [showSources, setShowSources] = useState(false)

  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <div className="chat-bubble-user">{msg.content}</div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 10, flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
          RK
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
      <AI_AVATAR />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="chat-bubble-ai">
          {/* Confidence badge */}
          {msg.confidence && (
            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px',
                borderRadius: 'var(--radius-full)', fontSize: '0.68rem', fontWeight: 700,
                background: msg.confidence >= 90 ? 'rgba(16,185,129,0.15)' : msg.confidence >= 75 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                color: msg.confidence >= 90 ? 'var(--green-400)' : msg.confidence >= 75 ? 'var(--amber-400)' : 'var(--red-400)',
                border: `1px solid ${msg.confidence >= 90 ? 'rgba(16,185,129,0.3)' : msg.confidence >= 75 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <Star size={9} />
                {msg.confidence}% confidence
              </div>
              {msg._fallback && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>(simulated)</span>}
            </div>
          )}
          {/* Answer text — render markdown-like */}
          <div style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
            {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>
                : <span key={i}>{part}</span>
            )}
          </div>

          {/* Entity tags */}
          {msg.entities?.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {msg.entities.map(e => <span key={e} className="tag" style={{ fontSize: '0.68rem' }}>{e}</span>)}
            </div>
          )}
        </div>

        {/* Sources toggle */}
        {msg.sources?.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => setShowSources(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--blue-400)', fontSize: '0.78rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0',
              }}
            >
              <FileText size={12} />
              {msg.sources.length} source{msg.sources.length > 1 ? 's' : ''} cited
              <ChevronRight size={12} style={{ transform: showSources ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
            </button>
            {showSources && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, animation: 'fade-in 0.3s ease' }}>
                {msg.sources.map((s, i) => <SourceCitation key={i} source={s} index={i} />)}
              </div>
            )}
            {msg.requiresAuth && (
              <div style={{ marginTop: 12 }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={msg.onSignIn}
                >
                  <LogIn size={14} /> Sign In to NEXUS IQ
                </button>
              </div>
            )}
          </div>
        )}

        {/* Related questions */}
        {msg.relatedQuestions?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>RELATED QUESTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {msg.relatedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => msg.onFollowUp?.(q)}
                  style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, padding: '6px 10px', cursor: 'pointer', text: 'left',
                    fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s ease',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-500)'; e.currentTarget.style.color = 'var(--blue-400)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <ChevronRight size={12} style={{ flexShrink: 0 }} />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Copilot() {
  const { user, openLoginModal } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 0, role: 'ai', content: `Hello! I'm **NEXUS IQ Copilot** — your AI-powered industrial knowledge assistant.

I have access to **1,247 documents** including P&IDs, maintenance records, safety procedures, inspection reports, OEM manuals, and regulatory standards for your plant.

Ask me anything about equipment, procedures, compliance, or maintenance history. I'll provide precise answers with source citations and confidence scores.

Try one of the suggested questions below, or type your own query.`,
      confidence: null, sources: [], entities: [], relatedQuestions: [],
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (text) => {
    const query = (text || input).trim()
    if (!query || isLoading) return
    setInput('')

    if (!user) {
      const userMsg = { id: Date.now(), role: 'user', content: query }
      const aiAuthMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Authentication Required: Access denied. Please sign in to query AI Copilot.',
        sources: [],
        confidence: 0,
        requiresAuth: true,
        onSignIn: openLoginModal,
      }
      setMessages(prev => [...prev, userMsg, aiAuthMsg])
      openLoginModal()
      return
    }

    const userMsg = { id: Date.now(), role: 'user', content: query }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
      const result = await queryAI(query, history)

      const addFollowUp = (q) => sendMessage(q)

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: result.answer,
        sources: result.sources,
        confidence: result.confidence,
        entities: result.entities,
        relatedQuestions: result.relatedQuestions,
        requiresAuth: result.requiresAuth,
        onSignIn: openLoginModal,
        onFollowUp: addFollowUp,
        _fallback: result._fallback,
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        content: 'I encountered an error processing your query. Please try again.',
        sources: [], confidence: null, entities: [], relatedQuestions: [],
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const clearChat = () => setMessages([messages[0]])

  return (
    <div style={{ height: 'calc(100vh - var(--topbar-height) - 48px)', display: 'flex', gap: 'var(--spacing-lg)' }}>
      {/* Chat panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>AI Copilot</h1>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>RAG-powered expert assistant · {AI_CONFIG.mode === 'simulated' ? 'Simulation mode' : `${AI_CONFIG.mode} connected`}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: 'var(--blue-400)', fontWeight: 600 }}>
            <Cpu size={13} /> AI Online
          </div>
          <button className="btn btn-ghost btn-sm" onClick={clearChat}>
            <RotateCcw size={14} /> Clear
          </button>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '4px 4px 4px 0',
          display: 'flex', flexDirection: 'column',
        }}>
          {messages.map(msg => (
            <ChatMessage key={msg.id} msg={{ ...msg, onFollowUp: (q) => sendMessage(q) }} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ flexShrink: 0, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                className="input"
                style={{ resize: 'none', minHeight: 48, maxHeight: 120, lineHeight: 1.5, paddingRight: 48, paddingTop: 12 }}
                placeholder="Ask about equipment, procedures, compliance, maintenance history..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ height: 48, width: 48, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
          <div style={{ marginTop: 6, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Press Enter to send · Shift+Enter for new line · Sources shown per response
          </div>
        </div>
      </div>

      {/* Suggestions sidebar */}
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', flexShrink: 0 }} className="hide-mobile">
        <div className="card" style={{ flex: 0 }}>
          <div className="section-label mb-sm">Suggested Questions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {STARTER_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={isLoading}
                style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                  fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'left',
                  transition: 'all 0.15s ease', fontFamily: 'var(--font-sans)', lineHeight: 1.4,
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue-500)'; e.currentTarget.style.color = 'var(--blue-400)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <ChevronRight size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-label mb-sm">Knowledge Base</div>
          {[
            { label: 'Documents indexed', value: '1,247' },
            { label: 'Equipment covered', value: '47 assets' },
            { label: 'Avg confidence', value: '91%' },
            { label: 'Regulations mapped', value: '8 standards' },
            { label: 'Incidents analysed', value: '347 records' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
