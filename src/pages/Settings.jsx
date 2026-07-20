import { useState } from 'react'
import { Settings, Key, Cpu, Eye, EyeOff, CheckCircle, AlertTriangle, Save, RotateCcw } from 'lucide-react'
import { AI_CONFIG, setAIConfig } from '../services/aiService'

const MODE_INFO = {
  simulated: { label: 'Simulated (Demo)', color: 'green', desc: 'Pre-computed realistic responses. No API key needed. Best for demos.' },
  openai: { label: 'OpenAI GPT', color: 'blue', desc: 'Live responses using OpenAI API. Requires OPENAI_API_KEY.' },
  gemini: { label: 'Google Gemini', color: 'purple', desc: 'Live responses using Google Gemini API. Requires GEMINI_API_KEY.' },
}

const MODELS = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  simulated: ['nexus-sim-v1'],
}

export default function Settings() {
  const [config, setConfig] = useState({ ...AI_CONFIG })
  const [showKey, setShowKey] = useState({ openai: false, gemini: false })
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleSave = () => {
    setAIConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const { queryAI } = await import('../services/aiService')
      const prev = AI_CONFIG.mode
      setAIConfig(config)
      const result = await queryAI('Test connection — what is NEXUS IQ?')
      setTestResult({ success: true, message: `Connection successful! Got response with ${result.confidence}% confidence.` })
      setAIConfig({ mode: prev })
    } catch (err) {
      setTestResult({ success: false, message: `Connection failed: ${err.message}` })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <h1>Settings & Configuration</h1>
        <p>Configure the AI engine, API keys, and system preferences for NEXUS IQ</p>
      </div>

      {/* AI Engine Mode */}
      <div className="card mb-lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Cpu size={18} color="var(--blue-400)" />
          <h4 style={{ margin: 0 }}>AI Engine Mode</h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {Object.entries(MODE_INFO).map(([mode, info]) => (
            <div key={mode}
              onClick={() => setConfig(c => ({ ...c, mode }))}
              style={{
                padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                border: `2px solid ${config.mode === mode ? `var(--${info.color}-500)` : 'var(--border-subtle)'}`,
                background: config.mode === mode ? `rgba(${info.color === 'green' ? '16,185,129' : info.color === 'blue' ? '14,165,233' : '139,92,246'},0.08)` : 'var(--bg-elevated)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                {config.mode === mode && <CheckCircle size={14} color={`var(--${info.color}-400)`} />}
                <span style={{ fontWeight: 700, color: config.mode === mode ? `var(--${info.color}-400)` : 'var(--text-primary)' }}>{info.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{info.desc}</p>
            </div>
          ))}
        </div>

        {/* Current mode description */}
        <div className="alert alert-info" style={{ marginBottom: 0 }}>
          <strong>Active mode:</strong> {MODE_INFO[config.mode]?.label} — {MODE_INFO[config.mode]?.desc}
        </div>
      </div>

      {/* API Keys */}
      <div className="card mb-lg">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Key size={18} color="var(--amber-400)" />
          <h4 style={{ margin: 0 }}>API Keys</h4>
          <span className="badge badge-amber">Stored locally only</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* OpenAI Key */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>
              OpenAI API Key
              {config.mode === 'openai' && <span className="badge badge-blue" style={{ marginLeft: 8 }}>Active</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={showKey.openai ? 'text' : 'password'}
                placeholder="sk-proj-..." value={config.openaiKey}
                onChange={e => setConfig(c => ({ ...c, openaiKey: e.target.value }))}
                style={{ paddingRight: 44, fontFamily: 'var(--font-mono)' }} />
              <button onClick={() => setShowKey(k => ({ ...k, openai: !k.openai }))}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showKey.openai ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Model selection for OpenAI */}
          {config.mode === 'openai' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>OpenAI Model</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {MODELS.openai.map(m => (
                  <button key={m} onClick={() => setConfig(c => ({ ...c, model: m }))}
                    className={`btn btn-sm ${config.model === m ? 'btn-primary' : 'btn-secondary'}`}>{m}</button>
                ))}
              </div>
            </div>
          )}

          {/* Gemini Key */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>
              Google Gemini API Key
              {config.mode === 'gemini' && <span className="badge badge-purple" style={{ marginLeft: 8 }}>Active</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={showKey.gemini ? 'text' : 'password'}
                placeholder="AIza..." value={config.geminiKey}
                onChange={e => setConfig(c => ({ ...c, geminiKey: e.target.value }))}
                style={{ paddingRight: 44, fontFamily: 'var(--font-mono)' }} />
              <button onClick={() => setShowKey(k => ({ ...k, gemini: !k.gemini }))}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showKey.gemini ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Gemini model */}
          {config.mode === 'gemini' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>Gemini Model</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {MODELS.gemini.map(m => (
                  <button key={m} onClick={() => setConfig(c => ({ ...c, model: m }))}
                    className={`btn btn-sm ${config.model === m ? 'btn-primary' : 'btn-secondary'}`}>{m}</button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="alert alert-info" style={{ marginTop: 16 }}>
          <strong>Security:</strong> API keys are stored in browser localStorage only and never sent to any server other than the respective AI provider's API.
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={handleSave} style={{ minWidth: 120 }}>
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Settings</>}
        </button>
        <button className="btn btn-secondary" onClick={handleTest} disabled={testing} style={{ minWidth: 130 }}>
          {testing ? <><div style={{ width: 14, height: 14, border: '2px solid var(--blue-400)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Testing...</> : <><Cpu size={15} /> Test Connection</>}
        </button>
        <button className="btn btn-ghost" onClick={() => setConfig({ ...AI_CONFIG })}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {testResult && (
        <div className={`alert alert-${testResult.success ? 'success' : 'danger'}`} style={{ marginTop: 12 }}>
          {testResult.success ? <CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} /> : <AlertTriangle size={14} style={{ display: 'inline', marginRight: 6 }} />}
          {testResult.message}
        </div>
      )}

      {/* System Info */}
      <div className="card" style={{ marginTop: 24 }}>
        <h4 style={{ marginBottom: 16 }}>System Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Platform Version', value: 'NEXUS IQ v1.0.0' },
            { label: 'Knowledge Base Documents', value: '1,247' },
            { label: 'Graph Nodes', value: '3,842' },
            { label: 'Graph Edges', value: '12,847' },
            { label: 'AI Engine', value: MODE_INFO[config.mode]?.label || config.mode },
            { label: 'Last Data Sync', value: 'Jul 20, 2024 09:30 AM' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div className="section-label" style={{ marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
