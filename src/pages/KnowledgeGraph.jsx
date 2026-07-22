import { useState, useEffect, useRef } from 'react'
import { apiFetch } from '../services/apiClient'
import { GRAPH_STATS } from '../data/knowledgeGraphData'
import { Search, Filter, X, Info, FileText, Cpu, User, FileStack, ShieldCheck, AlertTriangle, Share2, ZoomIn, ZoomOut, Plus } from 'lucide-react'
import * as d3 from 'd3'

const NODE_COLORS = {
  equipment: '#0ea5e9',
  document: '#10b981',
  person: '#8b5cf6',
  procedure: '#f97316',
  regulation: '#ef4444',
  incident: '#fbbf24',
  work_order: '#ec4899',
}

const NODE_ICONS = {
  equipment: '⚙️', document: '📄', person: '👤',
  procedure: '📋', regulation: '⚖️', incident: '🚨', work_order: '🔧',
}

const TYPE_LABELS = {
  equipment: 'Equipment', document: 'Document', person: 'Personnel',
  procedure: 'Procedure', regulation: 'Regulation', incident: 'Incident', work_order: 'Work Order',
}

export default function KnowledgeGraph() {
  const svgRef = useRef(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [stats, setStats] = useState({ totalNodes: 0, totalEdges: 0 })
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState(new Set(['equipment', 'document', 'person', 'procedure', 'regulation', 'incident', 'work_order']))
  const [graphReady, setGraphReady] = useState(false)
  const simulationRef = useRef(null)

  const fetchGraph = async () => {
    try {
      const res = await apiFetch('/graph')
      setNodes(res.nodes)
      setEdges(res.edges)
      setStats(res.stats)
    } catch (err) {
      console.warn('Failed to load graph:', err.message)
    }
  }

  useEffect(() => {
    fetchGraph()
  }, [])

  const filteredNodes = nodes.filter(n =>
    activeFilters.has(n.type) &&
    (searchQuery === '' || n.label.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  const filteredEdges = edges.filter(e => filteredNodeIds.has(e.source_id || e.source) && filteredNodeIds.has(e.target_id || e.target))

  useEffect(() => {
    if (!svgRef.current) return

    const container = svgRef.current.parentElement
    const W = container.clientWidth
    const H = container.clientHeight || 600

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', W)
      .attr('height', H)

    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => g.attr('transform', event.transform))

    svg.call(zoom)

    const g = svg.append('g')

    // Arrow markers
    svg.append('defs').selectAll('marker')
      .data(['arrow'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', 'rgba(14,165,233,0.4)')
      .attr('d', 'M0,-5L10,0L0,5')

    const nodes = filteredNodes.map(n => ({ ...n }))
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
    const links = filteredEdges
      .map(e => ({ ...e, source: nodeMap[e.source_id || e.source], target: nodeMap[e.target_id || e.target] }))
      .filter(e => e.source && e.target)

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(90).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide(30))

    simulationRef.current = simulation

    const link = g.append('g').selectAll('line')
      .data(links).join('line')
      .attr('stroke', 'rgba(14,165,233,0.2)')
      .attr('stroke-width', 1.2)
      .attr('marker-end', 'url(#arrow)')

    const linkLabel = g.append('g').selectAll('text')
      .data(links).join('text')
      .attr('fill', 'rgba(148,180,204,0.5)')
      .attr('font-size', '8px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('text-anchor', 'middle')
      .text(d => d.label)

    const node = g.append('g').selectAll('g')
      .data(nodes).join('g')
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
        .on('end', (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null })
      )
      .on('click', (event, d) => { event.stopPropagation(); setSelectedNode(d) })
      .style('cursor', 'pointer')

    node.append('circle')
      .attr('r', d => d.type === 'equipment' ? 16 : 13)
      .attr('fill', d => NODE_COLORS[d.type] + '22')
      .attr('stroke', d => NODE_COLORS[d.type])
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this)
          .attr('r', d.type === 'equipment' ? 20 : 16)
          .attr('filter', `drop-shadow(0 0 8px ${NODE_COLORS[d.type]})`)
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .attr('r', d.type === 'equipment' ? 16 : 13)
          .attr('filter', 'none')
      })

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('fill', d => NODE_COLORS[d.type])
      .attr('pointer-events', 'none')
      .text(d => NODE_ICONS[d.type])

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '26px')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', 'rgba(232,244,253,0.75)')
      .attr('pointer-events', 'none')
      .text(d => d.label.length > 16 ? d.label.slice(0, 14) + '…' : d.label)

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    simulation.on('end', () => setGraphReady(true))

    svg.on('click', () => setSelectedNode(null))

    return () => simulation.stop()
  }, [nodes, edges, activeFilters, searchQuery])

  const toggleFilter = (type) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(type)) { if (next.size > 1) next.delete(type) }
      else next.add(type)
      return next
    })
  }

  const [showAddModal, setShowAddModal] = useState(false)
  const [newEntity, setNewEntity] = useState({
    id: '', label: '', type: 'equipment', area: 'Area 200', criticality: 'medium', connectTo: '', relationship: 'FEEDS_INTO'
  })
  const [addError, setAddError] = useState(null)

  const handleAddEntity = async (e) => {
    e.preventDefault()
    setAddError(null)
    try {
      const nodeRes = await apiFetch('/graph/node', {
        method: 'POST',
        body: JSON.stringify({
          id: newEntity.id.trim(),
          label: newEntity.label.trim(),
          type: newEntity.type,
          area: newEntity.area,
          criticality: newEntity.criticality,
        }),
      })

      if (newEntity.connectTo) {
        await apiFetch('/graph/edge', {
          method: 'POST',
          body: JSON.stringify({
            source_id: newEntity.id.trim(),
            target_id: newEntity.connectTo,
            label: newEntity.relationship,
          }),
        })
      }

      setShowAddModal(false)
      setNewEntity({ id: '', label: '', type: 'equipment', area: 'Area 200', criticality: 'medium', connectTo: '', relationship: 'FEEDS_INTO' })
      fetchGraph()
    } catch (err) {
      setAddError(err.message)
    }
  }

  const connectedEdges = selectedNode
    ? edges.filter(e => (e.source_id || e.source) === selectedNode.id || (e.target_id || e.target) === selectedNode.id)
    : []

  return (
    <div style={{ height: 'calc(100vh - var(--topbar-height) - 48px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Knowledge Graph</h1>
          <p style={{ margin: 0, fontSize: '0.8rem' }}>
            {filteredNodes.length} nodes · {filteredEdges.length} edges · Click node for details
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Add Equipment / Entity
        </button>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" style={{ paddingLeft: 30, width: 220, height: 34, fontSize: '0.8125rem' }}
            placeholder="Search nodes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        {/* Stats */}
        {Object.entries(GRAPH_STATS.byType).map(([type, count]) => (
          <div key={type} style={{ fontSize: '0.7rem', color: NODE_COLORS[type], fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }} className="hide-mobile">
            {count} {TYPE_LABELS[type]}
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexShrink: 0, flexWrap: 'wrap' }}>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            style={{
              padding: '4px 12px', borderRadius: 'var(--radius-full)',
              border: `1px solid ${activeFilters.has(type) ? color : 'var(--border-subtle)'}`,
              background: activeFilters.has(type) ? `${color}18` : 'transparent',
              color: activeFilters.has(type) ? color : 'var(--text-muted)',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            <span>{NODE_ICONS[type]}</span>
            {TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Graph + Panel */}
      <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0 }}>
        {/* Graph Canvas */}
        <div style={{
          flex: 1, background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)', overflow: 'hidden', position: 'relative',
        }}>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
          {!graphReady && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, border: '3px solid var(--blue-500)', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Building knowledge graph...</span>
            </div>
          )}
          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px',
          }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Legend</div>
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{TYPE_LABELS[type]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        {selectedNode ? (
          <div style={{
            width: 300, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-default)', padding: 20, overflow: 'auto', flexShrink: 0,
            animation: 'slide-in-left 0.25s ease',
          }}>
            <div className="flex-between mb-md">
              <span className={`badge badge-${selectedNode.type === 'equipment' ? 'blue' : selectedNode.type === 'document' ? 'green' : selectedNode.type === 'person' ? 'purple' : selectedNode.type === 'procedure' ? 'orange' : selectedNode.type === 'regulation' ? 'red' : 'amber'}`}>
                {NODE_ICONS[selectedNode.type]} {TYPE_LABELS[selectedNode.type]}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedNode(null)}><X size={14} /></button>
            </div>

            <h3 style={{ marginBottom: 4 }}>{selectedNode.label}</h3>

            {selectedNode.id && <div className="highlight" style={{ marginBottom: 16, display: 'inline-block' }}>{selectedNode.id}</div>}

            {/* Type-specific attributes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {Object.entries({ ...(selectedNode.properties || {}), status: selectedNode.status, area: selectedNode.area, criticality: selectedNode.criticality })
                .filter(([k, v]) => v !== undefined && !['id', 'label', 'type', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'index', 'properties'].includes(k))
                .map(([k, v]) => {
                  const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v)
                  return (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
                      <span style={{
                        fontSize: '0.8rem', fontWeight: 600,
                        color: k === 'criticality' ? (v === 'critical' || v === 'high' ? 'var(--red-400)' : 'var(--green-400)') : 'var(--text-primary)',
                        fontFamily: typeof v === 'number' ? 'var(--font-mono)' : 'inherit',
                      }}>
                        {valStr}
                      </span>
                    </div>
                  )
                })
              }
            </div>

            {/* Connections */}
            <div className="section-label mb-sm">Connections ({connectedEdges.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {connectedEdges.slice(0, 8).map((e, i) => {
                const sourceId = typeof e.source === 'object' ? e.source.id : e.source
                const targetId = typeof e.target === 'object' ? e.target.id : e.target
                const isSource = sourceId === selectedNode.id
                const otherId = isSource ? targetId : sourceId
                const otherNode = nodes.find(n => n.id === otherId) || { id: otherId, label: otherId, type: 'equipment' }
                return (
                  <div key={i} onClick={() => setSelectedNode(otherNode)}
                    style={{
                      padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                      fontSize: '0.78rem', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={ev => ev.currentTarget.style.borderColor = 'var(--border-active)'}
                    onMouseLeave={ev => ev.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginBottom: 2 }}>
                      {isSource ? '→' : '←'} <span style={{ color: 'var(--blue-400)', fontFamily: 'var(--font-mono)' }}>{e.label}</span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {otherNode?.label || otherId}
                    </div>
                  </div>
                )
              })}
              {connectedEdges.length > 8 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  +{connectedEdges.length - 8} more connections
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            width: 280, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)', padding: 20, flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', textAlign: 'center', gap: 12,
          }}>
            <Share2 size={40} style={{ opacity: 0.3 }} />
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 6px' }}>Click any node</p>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>to explore entity details and relationships</p>
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, width: '100%' }}>
              <div className="section-label mb-sm">Graph Stats</div>
              {Object.entries(GRAPH_STATS.byType).map(([type, count]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ color: NODE_COLORS[type] }}>{NODE_ICONS[type]} {TYPE_LABELS[type]}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Entity Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()} style={{ padding: 28, maxWidth: 500 }}>
            <div className="flex-between mb-md">
              <h3 style={{ margin: 0 }}>Add Equipment / Knowledge Entity</h3>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            {addError && <div className="alert alert-danger mb-md">{addError}</div>}
            <form onSubmit={handleAddEntity} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="section-label mb-sm" style={{ display: 'block' }}>Tag / ID (Required)</label>
                <input
                  className="input" style={{ width: '100%' }}
                  placeholder="e.g. P-202B, V-305, T-101" required
                  value={newEntity.id} onChange={e => setNewEntity({ ...newEntity, id: e.target.value })}
                />
              </div>
              <div>
                <label className="section-label mb-sm" style={{ display: 'block' }}>Name / Description (Required)</label>
                <input
                  className="input" style={{ width: '100%' }}
                  placeholder="e.g. Heavy Gas Oil Charge Pump B" required
                  value={newEntity.label} onChange={e => setNewEntity({ ...newEntity, label: e.target.value })}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="section-label mb-sm" style={{ display: 'block' }}>Entity Type</label>
                  <select
                    className="input" style={{ width: '100%' }}
                    value={newEntity.type} onChange={e => setNewEntity({ ...newEntity, type: e.target.value })}
                  >
                    <option value="equipment">⚙️ Equipment</option>
                    <option value="document">📄 Document</option>
                    <option value="procedure">⚠️ Procedure</option>
                    <option value="work_order">🔧 Work Order</option>
                    <option value="incident">🚨 Incident</option>
                    <option value="regulation">⚖️ Regulation</option>
                  </select>
                </div>
                <div>
                  <label className="section-label mb-sm" style={{ display: 'block' }}>Plant Area</label>
                  <select
                    className="input" style={{ width: '100%' }}
                    value={newEntity.area} onChange={e => setNewEntity({ ...newEntity, area: e.target.value })}
                  >
                    <option value="Area 100">Area 100 - Crude Unit</option>
                    <option value="Area 200">Area 200 - Hydrocracker</option>
                    <option value="Area 300">Area 300 - FCC Unit</option>
                    <option value="Utilities">Utilities & Offsites</option>
                    <option value="Global">Global / Facility Wide</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="section-label mb-sm" style={{ display: 'block' }}>Connect To Existing Entity (Optional)</label>
                <select
                  className="input" style={{ width: '100%' }}
                  value={newEntity.connectTo} onChange={e => setNewEntity({ ...newEntity, connectTo: e.target.value })}
                >
                  <option value="">-- No Initial Connection --</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.id} — {n.label}</option>
                  ))}
                </select>
              </div>
              {newEntity.connectTo && (
                <div>
                  <label className="section-label mb-sm" style={{ display: 'block' }}>Relationship Type</label>
                  <select
                    className="input" style={{ width: '100%' }}
                    value={newEntity.relationship} onChange={e => setNewEntity({ ...newEntity, relationship: e.target.value })}
                  >
                    <option value="FEEDS_INTO">FEEDS_INTO</option>
                    <option value="MAINTAINED_BY">MAINTAINED_BY</option>
                    <option value="GOVERNED_BY">GOVERNED_BY</option>
                    <option value="OPERATED_BY">OPERATED_BY</option>
                    <option value="REPORTS">REPORTS</option>
                    <option value="REFERENCES">REFERENCES</option>
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Plus size={14} /> Add Entity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
