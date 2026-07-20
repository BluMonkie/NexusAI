// ============================================================
// Compliance Intelligence Data
// Indian regulatory framework, gap analysis, audit calendar
// ============================================================

export const REGULATIONS = [
  { id: 'OISD-118', name: 'OISD Standard 118', authority: 'OISD', domain: 'Fire & Safety', applicability: 'Petroleum installations', lastRevision: '2019', color: '#ef4444' },
  { id: 'PESO-2016', name: 'PESO Static & Mobile Vessels Rules', authority: 'PESO', domain: 'Pressure Equipment', applicability: 'Storage & transport', lastRevision: '2016', color: '#f97316' },
  { id: 'FA-1948', name: 'Factories Act 1948', authority: 'State Labour Dept', domain: 'Worker Safety', applicability: 'All factories', lastRevision: '2014 Amendment', color: '#8b5cf6' },
  { id: 'IBR-1950', name: 'Indian Boilers Regulation 1950', authority: 'IBR', domain: 'Boiler Safety', applicability: 'Steam boilers', lastRevision: '2015', color: '#0ea5e9' },
  { id: 'CPCB-ENV', name: 'CPCB Emission Standards', authority: 'CPCB', domain: 'Environment', applicability: 'Emission sources', lastRevision: '2022', color: '#10b981' },
  { id: 'API-510', name: 'API 510 — Vessel Inspection', authority: 'API', domain: 'Inspection', applicability: 'Pressure vessels', lastRevision: '2022 (12E)', color: '#fbbf24' },
  { id: 'API-670', name: 'API 670 — Machinery Protection', authority: 'API', domain: 'Machinery Monitoring', applicability: 'Rotating equipment', lastRevision: '2014 (5E)', color: '#38bdf8' },
  { id: 'OISD-GDN-192', name: 'OISD-GDN-192 Confined Space', authority: 'OISD', domain: 'Safe Work Practice', applicability: 'Confined space entry', lastRevision: '2018', color: '#a78bfa' },
]

export const COMPLIANCE_REQUIREMENTS = [
  // OISD-118
  { id: 'REQ-001', regId: 'OISD-118', section: '7.2.3', title: 'Firewater System Pressure Test', frequency: 'Semi-annual', equipment: ['Tank Farm A', 'Tank Farm B', 'Process Unit 1', 'Process Unit 2'], status: 'non-compliant', severity: 'High', lastDate: '2023-08-15', nextDue: '2024-02-15', finding: 'Overdue by 5 months', remediation: 'Schedule pressure test immediately' },
  { id: 'REQ-002', regId: 'OISD-118', section: '4.1.8', title: 'Gas Detector Calibration', frequency: 'Quarterly', equipment: ['Gas Plant', 'Process Unit 2', 'Tank Farm A'], status: 'partial', severity: 'Medium', lastDate: '2024-04-01', nextDue: '2024-08-15', finding: '3 of 18 detectors (GD-012, GD-015, GD-018) uncalibrated', remediation: 'Calibrate 3 detectors by Aug 15' },
  { id: 'REQ-003', regId: 'OISD-118', section: '9.3.1', title: 'ESDV Stroke Test', frequency: 'Semi-annual', equipment: ['Tank Farm A', 'Process Unit 2'], status: 'partial', severity: 'Medium', lastDate: '2024-01-15', nextDue: '2024-08-30', finding: 'ESDV-T601-01 stroke test pending', remediation: 'Complete stroke test by Aug 30' },
  { id: 'REQ-004', regId: 'OISD-118', section: '5.2.2', title: 'Foam System Discharge Test', frequency: 'Annual', equipment: ['Tank Farm A', 'Tank Farm B'], status: 'non-compliant', severity: 'Medium', lastDate: '2023-10-20', nextDue: '2024-10-31', finding: '2024 annual test not yet scheduled', remediation: 'Schedule foam system test for Q4 2024' },
  { id: 'REQ-005', regId: 'OISD-118', section: '12.4', title: 'Emergency Response Drill', frequency: 'Bi-annual', equipment: ['Plant-wide'], status: 'compliant', severity: 'High', lastDate: '2024-04-15', nextDue: '2024-10-15', finding: null, remediation: null },
  { id: 'REQ-006', regId: 'OISD-118', section: '3.2.1', title: 'Hazard Identification (HAZOP)', frequency: '5-yearly', equipment: ['Process Unit 1', 'Process Unit 2', 'Gas Plant'], status: 'compliant', severity: 'High', lastDate: '2022-06-01', nextDue: '2027-06-01', finding: null, remediation: null },

  // IBR-1950
  { id: 'REQ-007', regId: 'IBR-1950', section: 'S.8', title: 'Boiler Annual Statutory Inspection', frequency: 'Annual', equipment: ['B-501'], status: 'compliant', severity: 'High', lastDate: '2023-11-20', nextDue: '2024-11-20', finding: null, remediation: null },
  { id: 'REQ-008', regId: 'IBR-1950', section: 'S.12', title: 'Boiler Operator Competency Certificate', frequency: 'Periodic (renewal)', equipment: ['B-501'], status: 'partial', severity: 'Medium', lastDate: null, nextDue: '2024-08-01', finding: 'Operator Ramesh G. certificate expired May 2024', remediation: 'Renew certificate within 30 days' },

  // CPCB-ENV
  { id: 'REQ-009', regId: 'CPCB-ENV', section: 'Rule 18', title: 'Stack Emission Monitoring', frequency: 'Quarterly', equipment: ['B-501', 'Gas Plant'], status: 'compliant', severity: 'High', lastDate: '2024-06-30', nextDue: '2024-09-30', finding: null, remediation: null },
  { id: 'REQ-010', regId: 'CPCB-ENV', section: 'Rule 22', title: 'Effluent Treatment Plant Compliance', frequency: 'Monthly', equipment: ['ETP'], status: 'compliant', severity: 'High', lastDate: '2024-07-01', nextDue: '2024-08-01', finding: null, remediation: null },

  // API-510
  { id: 'REQ-011', regId: 'API-510', section: '6.4', title: 'Pressure Vessel External Inspection', frequency: '5-yearly', equipment: ['V-401', 'V-402'], status: 'compliant', severity: 'High', lastDate: '2022-03-15', nextDue: '2027-03-15', finding: null, remediation: null },
  { id: 'REQ-012', regId: 'API-510', section: '6.5', title: 'Pressure Vessel Internal Inspection', frequency: '10-yearly', equipment: ['V-401', 'V-402'], status: 'compliant', severity: 'High', lastDate: '2017-03-15', nextDue: '2027-03-15', finding: null, remediation: null },

  // API-670
  { id: 'REQ-013', regId: 'API-670', section: '4.3', title: 'Vibration Monitoring System Calibration', frequency: 'Annual', equipment: ['C-301', 'C-302'], status: 'compliant', severity: 'Medium', lastDate: '2024-01-10', nextDue: '2025-01-10', finding: null, remediation: null },

  // FA-1948
  { id: 'REQ-014', regId: 'FA-1948', section: '41B', title: 'Safety Officer Appointment & Records', frequency: 'Continuous', equipment: ['Plant-wide'], status: 'compliant', severity: 'High', lastDate: '2024-01-01', nextDue: null, finding: null, remediation: null },
  { id: 'REQ-015', regId: 'FA-1948', section: '31', title: 'Pressure Plant Examination', frequency: 'Annual', equipment: ['V-401', 'V-402', 'B-501'], status: 'compliant', severity: 'High', lastDate: '2024-02-20', nextDue: '2025-02-20', finding: null, remediation: null },

  // PESO
  { id: 'REQ-016', regId: 'PESO-2016', section: 'Rule 45', title: 'LPG Storage Safety Certificate', frequency: '2-yearly', equipment: ['T-601', 'T-602'], status: 'compliant', severity: 'High', lastDate: '2023-06-01', nextDue: '2025-06-01', finding: null, remediation: null },
]

export const COMPLIANCE_GAPS = COMPLIANCE_REQUIREMENTS.filter(r => r.status !== 'compliant')

export const AUDIT_CALENDAR = [
  { id: 'AUD-001', title: 'OISD-118 Internal Safety Audit', type: 'Internal', date: '2024-09-15', status: 'upcoming', lead: 'Sonia Mehta', scope: 'Tank Farm A, B + Process Units', priority: 'high' },
  { id: 'AUD-002', title: 'CPCB Environmental Compliance Check', type: 'External', date: '2024-09-30', status: 'upcoming', lead: 'External Auditor', scope: 'Stack emissions, ETP discharge', priority: 'high' },
  { id: 'AUD-003', title: 'IBR Boiler Statutory Inspection', type: 'Statutory', date: '2024-11-20', status: 'upcoming', lead: 'IBR Inspector', scope: 'B-501 only', priority: 'critical' },
  { id: 'AUD-004', title: 'Factory Act Inspection — State Labour Dept', type: 'Statutory', date: '2024-12-01', status: 'upcoming', lead: 'Labour Dept Inspector', scope: 'Entire plant', priority: 'high' },
  { id: 'AUD-005', title: 'API 510 Pressure Vessel Survey', type: 'Internal', date: '2025-03-15', status: 'planned', lead: 'Anil Verma', scope: 'V-401, V-402', priority: 'medium' },
  { id: 'AUD-006', title: 'OISD-118 External Safety Audit', type: 'External', date: '2025-06-01', status: 'planned', lead: 'OISD Approved Auditor', scope: 'Full plant', priority: 'critical' },
  { id: 'AUD-007', title: 'Q2-2024 Safety Audit', type: 'Internal', date: '2024-06-15', status: 'completed', lead: 'Sonia Mehta', scope: 'Full plant', priority: 'medium' },
]

export const COMPLIANCE_SCORE = {
  overall: 78,
  byRegulation: [
    { reg: 'OISD-118', score: 68, total: 6, compliant: 3, partial: 2, nonCompliant: 1 },
    { reg: 'IBR-1950', score: 80, total: 2, compliant: 1, partial: 1, nonCompliant: 0 },
    { reg: 'CPCB', score: 100, total: 2, compliant: 2, partial: 0, nonCompliant: 0 },
    { reg: 'API-510', score: 100, total: 2, compliant: 2, partial: 0, nonCompliant: 0 },
    { reg: 'API-670', score: 100, total: 1, compliant: 1, partial: 0, nonCompliant: 0 },
    { reg: 'FA-1948', score: 100, total: 2, compliant: 2, partial: 0, nonCompliant: 0 },
    { reg: 'PESO', score: 100, total: 1, compliant: 1, partial: 0, nonCompliant: 0 },
  ]
}

export const QUALITY_DEVIATIONS = [
  { id: 'QD-001', area: 'Process Unit 2', parameter: 'Naphtha concentration', expected: '18-22%', actual: '29.8%', deviation: '+34%', severity: 'high', date: '2024-07-12', status: 'open', impact: 'Increased thermal load on P-104 seals' },
  { id: 'QD-002', area: 'Utility Area', parameter: 'Boiler water hardness', expected: '<50 ppm', actual: '78 ppm', deviation: '+56%', severity: 'medium', date: '2024-07-15', status: 'open', impact: 'Risk of scale formation in boiler tubes' },
  { id: 'QD-003', area: 'Process Unit 1', parameter: 'HE-201 outlet temperature', expected: '135±5°C', actual: '118°C', deviation: '-11%', severity: 'medium', date: '2024-07-14', status: 'monitoring', impact: 'Downstream process efficiency reduced' },
  { id: 'QD-004', area: 'Gas Plant', parameter: 'Compressor discharge pressure', expected: '31-33 kg/cm²', actual: '29.2 kg/cm²', deviation: '-5%', severity: 'low', date: '2024-07-16', status: 'resolved', impact: 'Minor — within acceptable operating range after review' },
]
