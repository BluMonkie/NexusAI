// ============================================================
// Knowledge Graph Data — 60+ nodes, 90+ edges
// Realistic refinery/petrochemical plant scenario
// ============================================================

export const GRAPH_NODES = [
  // ── Equipment ──────────────────────────────────────────────
  { id: 'P-101', type: 'equipment', label: 'Pump P-101', subtype: 'Centrifugal Pump', area: 'Tank Farm A', health: 78, tag: 'P-101' },
  { id: 'P-102', type: 'equipment', label: 'Pump P-102', subtype: 'Centrifugal Pump', area: 'Tank Farm A', health: 92, tag: 'P-102' },
  { id: 'P-104', type: 'equipment', label: 'Pump P-104', subtype: 'Reciprocating Pump', area: 'Process Unit 2', health: 54, tag: 'P-104' },
  { id: 'C-301', type: 'equipment', label: 'Compressor C-301', subtype: 'Centrifugal Compressor', area: 'Gas Plant', health: 38, tag: 'C-301' },
  { id: 'C-302', type: 'equipment', label: 'Compressor C-302', subtype: 'Reciprocating Compressor', area: 'Gas Plant', health: 85, tag: 'C-302' },
  { id: 'HE-201', type: 'equipment', label: 'Heat Exchanger HE-201', subtype: 'Shell & Tube', area: 'Process Unit 1', health: 91, tag: 'HE-201' },
  { id: 'HE-202', type: 'equipment', label: 'Heat Exchanger HE-202', subtype: 'Plate Type', area: 'Process Unit 1', health: 70, tag: 'HE-202' },
  { id: 'V-401', type: 'equipment', label: 'Vessel V-401', subtype: 'Pressure Vessel', area: 'Process Unit 2', health: 95, tag: 'V-401' },
  { id: 'V-402', type: 'equipment', label: 'Vessel V-402', subtype: 'Storage Tank', area: 'Tank Farm B', health: 88, tag: 'V-402' },
  { id: 'B-501', type: 'equipment', label: 'Boiler B-501', subtype: 'Fire Tube Boiler', area: 'Utility Area', health: 82, tag: 'B-501' },
  { id: 'T-601', type: 'equipment', label: 'Tank T-601', subtype: 'Floating Roof Tank', area: 'Tank Farm A', health: 97, tag: 'T-601' },
  { id: 'T-602', type: 'equipment', label: 'Tank T-602', subtype: 'Fixed Roof Tank', area: 'Tank Farm B', health: 73, tag: 'T-602' },
  { id: 'PL-001', type: 'equipment', label: 'Pipeline PL-001', subtype: 'Process Piping', area: 'Interconnect', health: 89, tag: 'PL-001' },
  { id: 'FCV-101', type: 'equipment', label: 'Control Valve FCV-101', subtype: 'Flow Control Valve', area: 'Process Unit 1', health: 76, tag: 'FCV-101' },
  { id: 'PSV-201', type: 'equipment', label: 'Safety Valve PSV-201', subtype: 'Pressure Safety Valve', area: 'Process Unit 2', health: 99, tag: 'PSV-201' },

  // ── Documents ──────────────────────────────────────────────
  { id: 'DOC-PID-001', type: 'document', label: 'P&ID Sheet 1A', subtype: 'P&ID', docId: 'ENG-PID-001', pages: 1 },
  { id: 'DOC-PID-002', type: 'document', label: 'P&ID Sheet 2B', subtype: 'P&ID', docId: 'ENG-PID-002', pages: 1 },
  { id: 'DOC-SOP-001', type: 'document', label: 'Hot Work SOP', subtype: 'SOP', docId: 'HSE-SOP-101', pages: 12 },
  { id: 'DOC-SOP-002', type: 'document', label: 'Pump Startup SOP', subtype: 'SOP', docId: 'OPS-SOP-204', pages: 8 },
  { id: 'DOC-SOP-003', type: 'document', label: 'Confined Space Entry', subtype: 'SOP', docId: 'HSE-SOP-105', pages: 15 },
  { id: 'DOC-WO-001', type: 'document', label: 'WO #10423 — P-101 Seal', subtype: 'Work Order', docId: 'WO-10423', pages: 3 },
  { id: 'DOC-WO-002', type: 'document', label: 'WO #10891 — C-301 Vibration', subtype: 'Work Order', docId: 'WO-10891', pages: 5 },
  { id: 'DOC-WO-003', type: 'document', label: 'WO #11204 — HE-201 Cleaning', subtype: 'Work Order', docId: 'WO-11204', pages: 4 },
  { id: 'DOC-INSP-001', type: 'document', label: 'C-301 Inspection Report', subtype: 'Inspection Report', docId: 'INSP-2024-089', pages: 22 },
  { id: 'DOC-INSP-002', type: 'document', label: 'V-401 API 510 Inspection', subtype: 'Inspection Report', docId: 'INSP-2024-101', pages: 18 },
  { id: 'DOC-OEM-001', type: 'document', label: 'C-301 OEM Manual', subtype: 'OEM Manual', docId: 'OEM-SOLAR-C301', pages: 342 },
  { id: 'DOC-OEM-002', type: 'document', label: 'P-101 OEM Manual', subtype: 'OEM Manual', docId: 'OEM-KSB-P101', pages: 188 },
  { id: 'DOC-REG-001', type: 'document', label: 'OISD-118 Standard', subtype: 'Regulation', docId: 'OISD-118-2019', pages: 78 },
  { id: 'DOC-REG-002', type: 'document', label: 'Factory Act Guidelines', subtype: 'Regulation', docId: 'FA-1948-GUIDE', pages: 156 },
  { id: 'DOC-MSDS-001', type: 'document', label: 'LPG Safety Data Sheet', subtype: 'MSDS', docId: 'MSDS-LPG-001', pages: 8 },

  // ── Personnel ──────────────────────────────────────────────
  { id: 'PER-001', type: 'person', label: 'Rajesh Kumar', role: 'Sr. Maintenance Engineer', dept: 'Mechanical', exp: '18 years' },
  { id: 'PER-002', type: 'person', label: 'Priya Sharma', role: 'Process Engineer', dept: 'Process', exp: '9 years' },
  { id: 'PER-003', type: 'person', label: 'Anil Verma', role: 'Inspection Lead', dept: 'Inspection', exp: '22 years' },
  { id: 'PER-004', type: 'person', label: 'Sonia Mehta', role: 'HSE Manager', dept: 'HSE', exp: '14 years' },
  { id: 'PER-005', type: 'person', label: 'Deepak Nair', role: 'Operations Supervisor', dept: 'Operations', exp: '11 years' },

  // ── Procedures ─────────────────────────────────────────────
  { id: 'PROC-001', type: 'procedure', label: 'Emergency Shutdown', subtype: 'ESD Procedure', revision: 'Rev 4' },
  { id: 'PROC-002', type: 'procedure', label: 'Compressor Overhaul', subtype: 'Maintenance Procedure', revision: 'Rev 7' },
  { id: 'PROC-003', type: 'procedure', label: 'Tank Gauging Protocol', subtype: 'Operating Procedure', revision: 'Rev 2' },
  { id: 'PROC-004', type: 'procedure', label: 'Pressure Test Procedure', subtype: 'Inspection Procedure', revision: 'Rev 5' },
  { id: 'PROC-005', type: 'procedure', label: 'PTW System Procedure', subtype: 'HSE Procedure', revision: 'Rev 8' },

  // ── Regulations ────────────────────────────────────────────
  { id: 'REG-001', type: 'regulation', label: 'OISD-118', subtype: 'Fire Safety', authority: 'OISD', status: 'Active' },
  { id: 'REG-002', type: 'regulation', label: 'PESO Rules 2004', subtype: 'Explosives Safety', authority: 'PESO', status: 'Active' },
  { id: 'REG-003', type: 'regulation', label: 'Factory Act 1948', subtype: 'Labor Safety', authority: 'State Labour Dept', status: 'Active' },
  { id: 'REG-004', type: 'regulation', label: 'CPCB Emission Norms', subtype: 'Environment', authority: 'CPCB', status: 'Active' },
  { id: 'REG-005', type: 'regulation', label: 'API 510 — Vessel', subtype: 'Inspection Standard', authority: 'API', status: 'Active' },
  { id: 'REG-006', type: 'regulation', label: 'API 670 — Machinery', subtype: 'Vibration Monitoring', authority: 'API', status: 'Active' },

  // ── Incidents ──────────────────────────────────────────────
  { id: 'INC-001', type: 'incident', label: 'Seal Failure INC-2023-041', subtype: 'Near Miss', severity: 'High' },
  { id: 'INC-002', type: 'incident', label: 'Vibration Trip INC-2024-008', subtype: 'Incident', severity: 'Medium' },
  { id: 'INC-003', type: 'incident', label: 'Overpressure INC-2022-089', subtype: 'Incident', severity: 'Critical' },
]

export const GRAPH_EDGES = [
  // Equipment → Documents
  { source: 'P-101', target: 'DOC-PID-001', label: 'shown_in' },
  { source: 'P-101', target: 'DOC-WO-001', label: 'has_work_order' },
  { source: 'P-101', target: 'DOC-OEM-002', label: 'has_manual' },
  { source: 'P-101', target: 'DOC-SOP-002', label: 'governed_by' },
  { source: 'P-104', target: 'DOC-WO-001', label: 'has_work_order' },
  { source: 'C-301', target: 'DOC-PID-002', label: 'shown_in' },
  { source: 'C-301', target: 'DOC-WO-002', label: 'has_work_order' },
  { source: 'C-301', target: 'DOC-OEM-001', label: 'has_manual' },
  { source: 'C-301', target: 'DOC-INSP-001', label: 'has_inspection' },
  { source: 'HE-201', target: 'DOC-WO-003', label: 'has_work_order' },
  { source: 'HE-201', target: 'DOC-PID-001', label: 'shown_in' },
  { source: 'V-401', target: 'DOC-INSP-002', label: 'has_inspection' },
  { source: 'V-401', target: 'DOC-PID-002', label: 'shown_in' },
  { source: 'B-501', target: 'DOC-SOP-001', label: 'governed_by' },
  { source: 'T-601', target: 'DOC-MSDS-001', label: 'stores_material' },
  { source: 'T-602', target: 'DOC-MSDS-001', label: 'stores_material' },
  { source: 'FCV-101', target: 'DOC-PID-001', label: 'shown_in' },
  { source: 'PSV-201', target: 'DOC-PID-002', label: 'shown_in' },

  // Equipment → Equipment
  { source: 'P-101', target: 'HE-201', label: 'feeds_into' },
  { source: 'P-102', target: 'HE-201', label: 'feeds_into' },
  { source: 'HE-201', target: 'V-401', label: 'feeds_into' },
  { source: 'C-301', target: 'C-302', label: 'parallel_with' },
  { source: 'V-401', target: 'P-104', label: 'feeds_into' },
  { source: 'B-501', target: 'HE-202', label: 'supplies_steam' },
  { source: 'PL-001', target: 'T-601', label: 'connects_to' },
  { source: 'PL-001', target: 'T-602', label: 'connects_to' },

  // Equipment → Regulations
  { source: 'C-301', target: 'REG-006', label: 'governed_by' },
  { source: 'C-302', target: 'REG-006', label: 'governed_by' },
  { source: 'V-401', target: 'REG-005', label: 'governed_by' },
  { source: 'B-501', target: 'REG-001', label: 'governed_by' },
  { source: 'T-601', target: 'REG-001', label: 'governed_by' },
  { source: 'T-602', target: 'REG-001', label: 'governed_by' },
  { source: 'T-601', target: 'REG-002', label: 'governed_by' },

  // Equipment → Procedures
  { source: 'C-301', target: 'PROC-002', label: 'maintained_by' },
  { source: 'V-401', target: 'PROC-004', label: 'inspected_via' },
  { source: 'T-601', target: 'PROC-003', label: 'operated_via' },
  { source: 'PSV-201', target: 'PROC-001', label: 'activates' },
  { source: 'P-101', target: 'PROC-005', label: 'requires_ptw' },

  // Equipment → Incidents
  { source: 'P-101', target: 'INC-001', label: 'involved_in' },
  { source: 'C-301', target: 'INC-002', label: 'involved_in' },
  { source: 'V-401', target: 'INC-003', label: 'involved_in' },
  { source: 'PSV-201', target: 'INC-003', label: 'actuated_during' },

  // Personnel → Equipment
  { source: 'PER-001', target: 'P-101', label: 'maintains' },
  { source: 'PER-001', target: 'C-301', label: 'maintains' },
  { source: 'PER-002', target: 'HE-201', label: 'operates' },
  { source: 'PER-003', target: 'V-401', label: 'inspects' },
  { source: 'PER-003', target: 'C-301', label: 'inspects' },
  { source: 'PER-004', target: 'DOC-SOP-001', label: 'authored' },
  { source: 'PER-005', target: 'P-104', label: 'supervises' },

  // Personnel → Documents
  { source: 'PER-001', target: 'DOC-WO-001', label: 'assigned_to' },
  { source: 'PER-001', target: 'DOC-WO-002', label: 'assigned_to' },
  { source: 'PER-003', target: 'DOC-INSP-001', label: 'authored' },
  { source: 'PER-003', target: 'DOC-INSP-002', label: 'authored' },

  // Regulations → Documents
  { source: 'REG-001', target: 'DOC-REG-001', label: 'documented_in' },
  { source: 'REG-003', target: 'DOC-REG-002', label: 'documented_in' },

  // Incidents → Documents
  { source: 'INC-001', target: 'DOC-WO-001', label: 'triggered' },
  { source: 'INC-002', target: 'DOC-WO-002', label: 'triggered' },
  { source: 'INC-002', target: 'DOC-INSP-001', label: 'led_to' },

  // Procedures → Regulations
  { source: 'PROC-001', target: 'REG-001', label: 'complies_with' },
  { source: 'PROC-002', target: 'REG-006', label: 'complies_with' },
  { source: 'PROC-004', target: 'REG-005', label: 'complies_with' },
]

export const GRAPH_STATS = {
  totalNodes: GRAPH_NODES.length,
  totalEdges: GRAPH_EDGES.length,
  byType: {
    equipment: GRAPH_NODES.filter(n => n.type === 'equipment').length,
    document: GRAPH_NODES.filter(n => n.type === 'document').length,
    person: GRAPH_NODES.filter(n => n.type === 'person').length,
    procedure: GRAPH_NODES.filter(n => n.type === 'procedure').length,
    regulation: GRAPH_NODES.filter(n => n.type === 'regulation').length,
    incident: GRAPH_NODES.filter(n => n.type === 'incident').length,
  }
}
