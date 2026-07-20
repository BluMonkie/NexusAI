// ============================================================
// Dashboard & Document Ingestion Data
// ============================================================

export const DASHBOARD_KPIs = [
  { id: 'total-assets', label: 'Critical Assets Monitored', value: 47, unit: '', trend: '+3', trendDir: 'up', icon: 'Cpu', color: 'blue' },
  { id: 'total-docs', label: 'Documents Indexed', value: 1247, unit: '', trend: '+14 today', trendDir: 'up', icon: 'FileText', color: 'green' },
  { id: 'active-alerts', label: 'Active Alerts', value: 6, unit: '', trend: '2 critical', trendDir: 'down', icon: 'AlertTriangle', color: 'amber' },
  { id: 'compliance-score', label: 'Compliance Score', value: 78, unit: '%', trend: '-2% this month', trendDir: 'down', icon: 'ShieldCheck', color: 'purple' },
  { id: 'graph-nodes', label: 'Knowledge Graph Nodes', value: 3842, unit: '', trend: '+127 this week', trendDir: 'up', icon: 'Share2', color: 'blue' },
  { id: 'queries-today', label: 'Copilot Queries Today', value: 38, unit: '', trend: '↑ 12% vs yesterday', trendDir: 'up', icon: 'MessageSquareText', color: 'green' },
]

export const ACTIVITY_FEED = [
  { id: 1, type: 'ingestion', icon: 'FileStack', color: 'green', text: '14 documents ingested from Plant Data System', sub: 'P&IDs, Work Orders, Inspection Reports', time: '3 min ago' },
  { id: 2, type: 'alert', icon: 'AlertTriangle', color: 'red', text: 'CRITICAL: C-301 vibration at 82% of trip level', sub: 'Predictive model: 87% failure probability in 14 days', time: '8 min ago' },
  { id: 3, type: 'query', icon: 'MessageSquareText', color: 'blue', text: 'AI Copilot answered: "Vibration limits for C-301?"', sub: 'Confidence: 95% | Sources: 4 documents', time: '22 min ago' },
  { id: 4, type: 'compliance', icon: 'ShieldCheck', color: 'amber', text: 'Compliance gap flagged: OISD-118 firewater test overdue', sub: 'Gap open for 5 months — remediation required', time: '45 min ago' },
  { id: 5, type: 'rca', icon: 'Wrench', color: 'purple', text: 'RCA completed: P-104 seal failure root cause identified', sub: '5 corrective actions assigned', time: '2h ago' },
  { id: 6, type: 'warning', icon: 'BookOpen', color: 'orange', text: 'Proactive warning issued: Monsoon pump seal risk', sub: 'Based on 4 historical incident pattern match', time: '3h ago' },
  { id: 7, type: 'ingestion', icon: 'FileStack', color: 'green', text: 'OEM manual digitized: Solar Turbines C-301 (342 pages)', sub: 'OCR complete — 1,247 entities extracted', time: '5h ago' },
  { id: 8, type: 'query', icon: 'MessageSquareText', color: 'blue', text: 'AI Copilot answered: "OISD-118 compliance gaps?"', sub: 'Confidence: 95% | 4 gaps identified', time: '6h ago' },
]

export const COVERAGE_DATA = [
  { area: 'Gas Plant', coverage: 91, assets: 8, docs: 234 },
  { area: 'Process Unit 1', coverage: 85, assets: 12, docs: 312 },
  { area: 'Process Unit 2', coverage: 88, assets: 10, docs: 289 },
  { area: 'Tank Farm A', coverage: 76, assets: 9, docs: 198 },
  { area: 'Tank Farm B', coverage: 62, assets: 7, docs: 143 },
  { area: 'Utility Area', coverage: 79, assets: 6, docs: 167 },
  { area: 'Interconnect / Piping', coverage: 54, assets: 5, docs: 89 },
]

export const TREND_DATA = {
  uptime: [
    { month: 'Feb', value: 94.2 }, { month: 'Mar', value: 95.8 }, { month: 'Apr', value: 97.1 },
    { month: 'May', value: 98.2 }, { month: 'Jun', value: 94.6 }, { month: 'Jul', value: 96.4 },
  ],
  compliance: [
    { month: 'Feb', value: 72 }, { month: 'Mar', value: 74 }, { month: 'Apr', value: 76 },
    { month: 'May', value: 80 }, { month: 'Jun', value: 80 }, { month: 'Jul', value: 78 },
  ],
  queryVolume: [
    { month: 'Feb', value: 124 }, { month: 'Mar', value: 189 }, { month: 'Apr', value: 245 },
    { month: 'May', value: 312 }, { month: 'Jun', value: 398 }, { month: 'Jul', value: 487 },
  ],
}

// ── Document Ingestion Data ──────────────────────────────────

export const DOCUMENT_TYPES = [
  { type: 'P&ID / Engineering Drawing', count: 147, icon: '📐', color: '#0ea5e9' },
  { type: 'Maintenance Work Order', count: 312, icon: '🔧', color: '#10b981' },
  { type: 'Inspection Report', count: 156, icon: '🔍', color: '#8b5cf6' },
  { type: 'Safety Procedure / SOP', count: 89, icon: '⚠️', color: '#f59e0b' },
  { type: 'OEM Manual', count: 43, icon: '📖', color: '#f97316' },
  { type: 'Regulatory Document', count: 78, icon: '⚖️', color: '#ef4444' },
  { type: 'Incident / Near Miss Report', count: 156, icon: '🚨', color: '#fbbf24' },
  { type: 'Email Archive', count: 266, icon: '📧', color: '#94a3b8' },
]

export const RECENT_DOCUMENTS = [
  { id: 'DOC-001', name: 'C-301 OEM Manual — Solar Turbines', type: 'OEM Manual', pages: 342, size: '28.4 MB', ingested: '2024-07-20T04:30:00', entities: 1247, status: 'complete', tags: ['C-301', 'compressor', 'Solar Turbines', 'Gas Plant'] },
  { id: 'DOC-002', name: 'WO #10891 — C-301 Vibration Investigation', type: 'Work Order', pages: 5, size: '1.2 MB', ingested: '2024-07-20T03:12:00', entities: 84, status: 'complete', tags: ['C-301', 'vibration', 'WO-10891'] },
  { id: 'DOC-003', name: 'P&ID Sheet 2B Rev 8 — Process Unit 2', type: 'P&ID', pages: 1, size: '8.9 MB', ingested: '2024-07-19T22:45:00', entities: 312, status: 'complete', tags: ['PID', 'Process Unit 2', 'C-301', 'V-401'] },
  { id: 'DOC-004', name: 'OISD-118 Standard (2019 Edition)', type: 'Regulation', pages: 78, size: '4.1 MB', ingested: '2024-07-19T18:20:00', entities: 589, status: 'complete', tags: ['OISD-118', 'fire safety', 'compliance'] },
  { id: 'DOC-005', name: 'Inspection Report INSP-2024-089', type: 'Inspection Report', pages: 22, size: '6.3 MB', ingested: '2024-07-19T15:05:00', entities: 234, status: 'complete', tags: ['C-301', 'inspection', 'vibration', 'rotor'] },
  { id: 'DOC-006', name: 'Plant Safety Audit Q2-2024', type: 'Audit Report', pages: 48, size: '11.2 MB', ingested: '2024-07-18T11:30:00', entities: 445, status: 'complete', tags: ['audit', 'safety', 'OISD-118', 'compliance'] },
  { id: 'DOC-007', name: 'RCA Report P-104 Seal Failure', type: 'RCA Report', pages: 15, size: '3.8 MB', ingested: '2024-07-18T09:00:00', entities: 198, status: 'complete', tags: ['P-104', 'seal failure', 'RCA', 'thermal'] },
  { id: 'DOC-008', name: 'Monsoon Season Impact Analysis 2022', type: 'Internal Study', pages: 34, size: '5.6 MB', ingested: '2024-07-17T16:45:00', entities: 287, status: 'complete', tags: ['monsoon', 'compressor', 'pump', 'seasonal'] },
]

export const INGESTION_STATS = {
  totalDocuments: 1247,
  totalEntities: 38420,
  totalConnections: 12847,
  processingRate: 94,
  avgProcessingTime: '2.3 min',
  todayIngested: 14,
}

export const ENTITY_TYPES = [
  { type: 'Equipment Tags', count: 8420, color: '#0ea5e9' },
  { type: 'Process Parameters', count: 6230, color: '#10b981' },
  { type: 'Personnel Names', count: 1840, color: '#8b5cf6' },
  { type: 'Dates & Timelines', count: 9120, color: '#f59e0b' },
  { type: 'Regulatory References', count: 4230, color: '#ef4444' },
  { type: 'Document References', count: 6780, color: '#f97316' },
  { type: 'Locations / Areas', count: 1800, color: '#fbbf24' },
]
