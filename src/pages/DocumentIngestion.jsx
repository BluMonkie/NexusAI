import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, CheckCircle, Loader, Share2,
  Cpu, Layers, FileSearch, Tag, Calendar, User,
  FileStack, BarChart2, ChevronRight, X, Eye, Trash2
} from 'lucide-react'
import { apiFetch } from '../services/apiClient'
import {
  DOCUMENT_TYPES, INGESTION_STATS, ENTITY_TYPES
} from '../data/dashboardData'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const PIPELINE_STEPS = [
  { id: 'upload', label: 'Upload', icon: Upload, desc: 'File received' },
  { id: 'ocr', label: 'OCR / Parse', icon: FileSearch, desc: 'Text extraction' },
  { id: 'extract', label: 'Entity Extract', icon: Tag, desc: 'AI NLP pipeline' },
  { id: 'link', label: 'Graph Link', icon: Share2, desc: 'Knowledge mapping' },
  { id: 'index', label: 'Index', icon: Layers, desc: 'RAG embedding' },
]

const DOC_TYPE_ICONS = {
  'P&ID': '📐', 'Work Order': '🔧', 'Inspection Report': '🔍',
  'SOP': '⚠️', 'OEM Manual': '📖', 'Regulation': '⚖️',
  'Audit Report': '📋', 'RCA Report': '🩺', 'Internal Study': '📊',
}

function PipelineVisualizer({ activeStep }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 0' }}>
      {PIPELINE_STEPS.map((step, i) => {
        const Icon = step.icon
        const state = activeStep >= 5 ? 'done' : i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending'
        return (
          <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
            {i < PIPELINE_STEPS.length - 1 && (
              <div style={{
                position: 'absolute', top: 20, left: '55%', right: '-45%', height: 2,
                background: (activeStep >= 5 || i < activeStep)
                  ? 'linear-gradient(90deg, var(--green-500), var(--green-400))'
                  : 'var(--border-subtle)',
                transition: 'background 0.5s ease',
                zIndex: 0,
              }} />
            )}
            <div className={`pipeline-icon ${state}`} style={{ zIndex: 1 }}>
              {state === 'done' ? <CheckCircle size={18} /> : state === 'active' ? <Loader size={18} className="animate-spin" /> : <Icon size={18} />}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: state === 'done' ? 'var(--green-400)' : state === 'active' ? 'var(--blue-400)' : 'var(--text-muted)' }}>{step.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{step.desc}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const SAMPLE_ENTITIES = [
  { text: 'C-301', type: 'Equipment Tag', color: 'blue' },
  { text: '41 μm pk-pk', type: 'Process Parameter', color: 'amber' },
  { text: 'Solar Turbines', type: 'OEM/Vendor', color: 'purple' },
  { text: 'Rajesh Kumar', type: 'Personnel', color: 'green' },
  { text: 'API 670', type: 'Regulation Ref', color: 'red' },
  { text: 'July 10, 2024', type: 'Date', color: 'orange' },
  { text: 'Gas Plant', type: 'Location', color: 'blue' },
  { text: 'WO-10891', type: 'Document Ref', color: 'green' },
  { text: '25 μm', type: 'Process Parameter', color: 'amber' },
  { text: 'Vibration Alert Level', type: 'Process Parameter', color: 'amber' },
  { text: 'INSP-2024-089', type: 'Document Ref', color: 'green' },
  { text: 'Rotor Fouling', type: 'Failure Mode', color: 'red' },
]

export default function DocumentIngestion() {
  const navigate = useNavigate()
  const [dragOver, setDragOver] = useState(false)
  const [pipelineStep, setPipelineStep] = useState(-1)
  const [processingDoc, setProcessingDoc] = useState(null)
  const [showEntities, setShowEntities] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [documents, setDocuments] = useState([])
  const [stats, setStats] = useState({ totalDocuments: 0, indexedChunks: 0, activeEntities: 0 })
  const [uploadError, setUploadError] = useState(null)
  const fileInputRef = useRef(null)

  const fetchDocuments = async () => {
    try {
      const res = await apiFetch('/documents')
      setDocuments(res.documents)
      setStats(res.stats)
    } catch (err) {
      console.warn('Failed to load documents:', err.message)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const [uploadedDoc, setUploadedDoc] = useState(null)

  const processUpload = async (file) => {
    setProcessingDoc(file.name)
    setPipelineStep(0)
    setShowEntities(false)
    setUploadError(null)

    let step = 0
    const interval = setInterval(() => {
      step++
      if (step <= 3) setPipelineStep(step)
    }, 600)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'Engineering Drawings')
      formData.append('area', 'Global')

      const res = await apiFetch('/documents/upload', {
        method: 'POST',
        body: formData,
      })
      if (res.document) setUploadedDoc(res.document)

      clearInterval(interval)
      setPipelineStep(4)
      setTimeout(() => setPipelineStep(5), 500)
      setShowEntities(true)
      fetchDocuments()
    } catch (err) {
      clearInterval(interval)
      setUploadError(err.message)
      setPipelineStep(-1)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processUpload(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) processUpload(file)
  }

  const handleDelete = async (docId) => {
    try {
      await apiFetch(`/documents/${docId}`, { method: 'DELETE' })
      fetchDocuments()
    } catch (err) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  const pieData = ENTITY_TYPES.map(e => ({ name: e.type, value: e.count, color: e.color }))

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h1>Document Ingestion Pipeline</h1>
          <p>AI-powered multi-format document processing — PDFs, P&IDs, scanned forms, spreadsheets</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/knowledge-graph')}>
            <Share2 size={14} /> View Graph
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-4 mb-lg">
        {[
          { label: 'Documents Indexed', value: INGESTION_STATS.totalDocuments.toLocaleString(), icon: FileText, color: 'blue', sub: `+${INGESTION_STATS.todayIngested} today` },
          { label: 'Entities Extracted', value: INGESTION_STATS.totalEntities.toLocaleString(), icon: Tag, color: 'green', sub: 'Across all docs' },
          { label: 'Graph Connections', value: INGESTION_STATS.totalConnections.toLocaleString(), icon: Share2, color: 'purple', sub: 'Entity relationships' },
          { label: 'Processing Rate', value: `${INGESTION_STATS.processingRate}%`, icon: Cpu, color: 'amber', sub: `Avg ${INGESTION_STATS.avgProcessingTime}/doc` },
        ].map(({ label, value, icon: Icon, color, sub }) => {
          const c = { blue: 'var(--blue-400)', green: 'var(--green-400)', purple: 'var(--purple-400)', amber: 'var(--amber-400)' }[color]
          return (
            <div key={label} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Icon size={18} color={c} />
                <span className="section-label" style={{ margin: 0 }}>{label}</span>
              </div>
              <div className="stat-number" style={{ color: c, fontSize: '1.75rem' }}>{value}</div>
              <div className="stat-label">{sub}</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-lg)' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Upload Zone */}
          <div className="card">
            <h4 style={{ marginBottom: 16 }}>Upload Documents</h4>
            <div
              className={`upload-zone${dragOver ? ' drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.csv,.docx,.msg" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(14,165,233,0.1)', border: '2px solid rgba(14,165,233,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Upload size={26} color="var(--blue-400)" />
                </div>
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    Drop files here or click to browse
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    PDF, P&ID, Scanned images, Excel, Word, Email (.msg)
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {['PDF', 'PNG/JPG', 'XLSX', 'DOCX', 'MSG', 'CSV'].map(fmt => (
                    <span key={fmt} className="tag">{fmt}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline */}
            {pipelineStep >= 0 && (
              <div style={{ marginTop: 20 }}>
                <div className="flex-between mb-md">
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Processing: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue-400)' }}>{processingDoc}</span>
                  </div>
                  {pipelineStep === 5 && <span className="badge badge-green"><CheckCircle size={10} /> Complete</span>}
                </div>
                <PipelineVisualizer activeStep={pipelineStep} />

                {/* Entities */}
                {showEntities && (
                  <div style={{ marginTop: 16, animation: 'fade-in 0.5s ease' }}>
                    <div className="section-label mb-sm">Extracted Entities (12 of 84)</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {SAMPLE_ENTITIES.map((e, i) => (
                        <div key={i} className={`badge badge-${e.color}`} style={{ cursor: 'pointer' }} title={e.type}>
                          {e.text}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => navigate('/knowledge-graph')}>
                        <Share2 size={13} /> View in Knowledge Graph
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedDoc(uploadedDoc || documents[0])}>
                        <Eye size={13} /> View Full Document
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="card">
            <div className="flex-between mb-md">
              <h4 style={{ margin: 0 }}>Indexed Knowledge Base Documents</h4>
              <span className="badge badge-green">{documents.length} live docs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {documents.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No uploaded documents yet. Drag & drop a file above to index it into RAG!
                </div>
              ) : (
                documents.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', transition: 'background var(--transition-fast)',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{DOC_TYPE_ICONS[doc.category] || '📄'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {doc.type} · {doc.category || 'General'} · Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-green"><CheckCircle size={9} /> Indexed</span>
                      <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id) }} title="Delete Document">
                        <Trash2 size={13} color="var(--red-400)" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* Document Type Breakdown */}
          <div className="card">
            <h4 style={{ marginBottom: 16 }}>Document Corpus Breakdown</h4>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {ENTITY_TYPES.map(e => (
                <div key={e.type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{e.type}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{e.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doc Type List */}
          <div className="card">
            <h4 style={{ marginBottom: 14 }}>By Document Type</h4>
            {DOCUMENT_TYPES.map(d => (
              <div key={d.type} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: '1.1rem' }}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{d.type}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{d.count}</span>
                  </div>
                  <div className="progress-bar" style={{ height: 4 }}>
                    <div className="progress-fill blue" style={{ width: `${(d.count / 312) * 100}%`, background: d.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <div className="flex-between mb-lg">
              <div>
                <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{DOC_TYPE_ICONS[selectedDoc.type] || '📄'}</div>
                <h3 style={{ margin: 0 }}>{selectedDoc.name}</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setSelectedDoc(null)}><X size={18} /></button>
            </div>
            <div className="grid grid-2 mb-lg" style={{ gap: 12 }}>
              {[
                { label: 'Type', value: selectedDoc.type || 'DOCUMENT' },
                { label: 'Category', value: selectedDoc.category || 'General' },
                { label: 'Uploaded', value: new Date(selectedDoc.uploaded_at || Date.now()).toLocaleDateString() },
                { label: 'Status', value: selectedDoc.status || 'indexed' },
              ].map(({ label, value }) => (
                <div key={label} className="card" style={{ padding: 12 }}>
                  <div className="section-label mb-sm">{label}</div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{value}</div>
                </div>
              ))}
            </div>
            <div className="section-label mb-sm">Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {(selectedDoc.tags || [selectedDoc.category || 'Engineering', selectedDoc.type || 'Doc', 'RAG Indexed']).map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-sm" onClick={() => { setSelectedDoc(null); navigate('/knowledge-graph') }}>
                <Share2 size={13} /> View in Knowledge Graph
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedDoc(null); navigate('/copilot') }}>
                <Cpu size={13} /> Ask About This Doc
              </button>
              {selectedDoc.file_path && (
                <button className="btn btn-secondary btn-sm" onClick={() => {
                  const filename = selectedDoc.file_path.split(/[/\\]/).pop()
                  window.open(`http://localhost:3001/uploads/${filename}`, '_blank')
                }}>
                  <Eye size={13} /> Open File
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
