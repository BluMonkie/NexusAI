// ============================================================
// Maintenance & RCA Data
// Equipment health, work orders, RCA cases, predictive alerts
// ============================================================

export const EQUIPMENT_HEALTH = [
  { id: 'C-301', name: 'Compressor C-301', area: 'Gas Plant', type: 'Centrifugal Compressor', health: 38, vibration: 41, temp: 74, pressure: 32.1, trend: 'down', lastPM: '2023-11-12', nextPM: '2024-08-01', criticalFlag: true },
  { id: 'P-104', name: 'Pump P-104', area: 'Process Unit 2', type: 'Reciprocating Pump', health: 54, vibration: 6.1, temp: 89, pressure: 18.4, trend: 'down', lastPM: '2024-06-15', nextPM: '2024-09-01', criticalFlag: true },
  { id: 'HE-202', name: 'Heat Exchanger HE-202', area: 'Process Unit 1', type: 'Plate HE', health: 65, vibration: null, temp: 112, pressure: 8.2, trend: 'down', lastPM: '2023-02-20', nextPM: '2024-08-15', criticalFlag: false },
  { id: 'FCV-101', name: 'Control Valve FCV-101', area: 'Process Unit 1', type: 'Flow Control Valve', health: 70, vibration: null, temp: null, pressure: 14.2, trend: 'stable', lastPM: '2024-01-10', nextPM: '2024-10-10', criticalFlag: false },
  { id: 'P-101', name: 'Pump P-101', area: 'Tank Farm A', type: 'Centrifugal Pump', health: 78, vibration: 5.2, temp: 68, pressure: 12.6, trend: 'stable', lastPM: '2024-03-01', nextPM: '2024-08-01', criticalFlag: false },
  { id: 'T-602', name: 'Tank T-602', area: 'Tank Farm B', type: 'Fixed Roof Tank', health: 80, vibration: null, temp: 42, pressure: 0.3, trend: 'stable', lastPM: '2023-09-01', nextPM: '2025-09-01', criticalFlag: false },
  { id: 'B-501', name: 'Boiler B-501', area: 'Utility Area', type: 'Fire Tube Boiler', health: 82, vibration: null, temp: 185, pressure: 13.8, trend: 'stable', lastPM: '2024-04-15', nextPM: '2024-10-15', criticalFlag: false },
  { id: 'C-302', name: 'Compressor C-302', area: 'Gas Plant', type: 'Reciprocating Compressor', health: 85, vibration: 18, temp: 71, pressure: 30.8, trend: 'up', lastPM: '2024-02-28', nextPM: '2024-11-01', criticalFlag: false },
  { id: 'P-102', name: 'Pump P-102', area: 'Tank Farm A', type: 'Centrifugal Pump', health: 92, vibration: 3.8, temp: 65, pressure: 13.1, trend: 'up', lastPM: '2024-05-10', nextPM: '2024-11-10', criticalFlag: false },
  { id: 'HE-201', name: 'Heat Exchanger HE-201', area: 'Process Unit 1', type: 'Shell & Tube', health: 91, vibration: null, temp: 124, pressure: 9.1, trend: 'stable', lastPM: '2024-01-20', nextPM: '2025-01-20', criticalFlag: false },
  { id: 'V-401', name: 'Vessel V-401', area: 'Process Unit 2', type: 'Pressure Vessel', health: 95, vibration: null, temp: 88, pressure: 31.2, trend: 'stable', lastPM: '2024-03-15', nextPM: '2027-03-15', criticalFlag: false },
  { id: 'T-601', name: 'Tank T-601', area: 'Tank Farm A', type: 'Floating Roof Tank', health: 97, vibration: null, temp: 38, pressure: 0.1, trend: 'stable', lastPM: '2024-06-01', nextPM: '2026-06-01', criticalFlag: false },
]

export const WORK_ORDERS = [
  { id: 'WO-10891', equipment: 'C-301', title: 'High Vibration Investigation', status: 'open', priority: 'critical', assigned: 'Rajesh Kumar', created: '2024-07-10', due: '2024-07-24', type: 'Corrective', description: 'Radial vibration at 41 μm — at 82% of trip level. Investigate rotor fouling.' },
  { id: 'WO-11204', equipment: 'HE-201', title: 'Offline Cleaning & Tube Inspection', status: 'in-progress', priority: 'high', assigned: 'Maintenance Team B', created: '2024-07-05', due: '2024-07-28', type: 'Corrective', description: 'U-value dropped to 291 W/m²K from design 380. Offline cleaning required.' },
  { id: 'WO-11301', equipment: 'FCV-101', title: 'Packing Replacement & Positioner Calibration', status: 'open', priority: 'medium', assigned: 'Instrument Team', created: '2024-07-12', due: '2024-07-31', type: 'Corrective', description: 'Packing leak detected at stem. Positioner drift ±3% observed.' },
  { id: 'WO-11189', equipment: 'P-101', title: 'Scheduled PM — Bearing Lube & Alignment', status: 'planned', priority: 'low', assigned: 'Rajesh Kumar', created: '2024-06-28', due: '2024-08-01', type: 'Preventive', description: 'Scheduled 6-monthly preventive maintenance.' },
  { id: 'WO-10423', equipment: 'P-101', title: 'Mechanical Seal Replacement', status: 'closed', priority: 'high', assigned: 'Rajesh Kumar', created: '2024-03-01', due: '2024-03-05', type: 'Corrective', description: 'Seal failure during tank switchover. Flowserve dual cartridge seal installed.' },
  { id: 'WO-10234', equipment: 'B-501', title: 'Boiler Annual Safety Inspection', status: 'closed', priority: 'medium', assigned: 'Anil Verma', created: '2024-04-10', due: '2024-04-20', type: 'Inspection', description: 'Annual IBR safety inspection. All findings cleared.' },
  { id: 'WO-11402', equipment: 'T-602', title: 'Roof Seal Inspection', status: 'planned', priority: 'low', assigned: 'Inspection Team', created: '2024-07-15', due: '2024-08-20', type: 'Inspection', description: 'Minor product seepage noted at roof seal. Detailed inspection required.' },
]

export const RCA_CASES = [
  {
    id: 'RCA-2024-067',
    title: 'P-104 Mechanical Seal Failure',
    equipment: 'P-104',
    date: '2024-06-14',
    severity: 'High',
    downtime: '18 hours',
    cost: '₹12.4 Lakhs',
    status: 'Action Ongoing',
    summary: 'Mechanical seal failed due to thermal shock from process fluid temperature excursion (142°C vs. rated 120°C max)',
    causes: {
      machine: ['Seal specification API Plan 11 — inadequate for temperature excursions >130°C', 'No temperature alarm on pump suction'],
      method: ['Startup SOP missing pre-warming step for high-temperature service', 'No procedural check for fluid temperature before pump start'],
      man: ['2 of 4 operators not trained on high-temp startup nuances', 'Operator assumed standard startup was adequate'],
      material: ['Process fluid naphtha concentration 34% above normal — higher thermal load'],
      measurement: ['Suction temperature not monitored in DCS — no early warning'],
      environment: ['High ambient temperature (44°C) reduced cooling effectiveness'],
    },
    actions: [
      { action: 'Emergency seal replacement', status: 'done', owner: 'Rajesh Kumar', due: '2024-06-15' },
      { action: 'Revise SOP OPS-SOP-204 with pre-warming step', status: 'in-progress', owner: 'Priya Sharma', due: '2024-07-31' },
      { action: 'Install suction temperature indicator in DCS', status: 'planned', owner: 'Instrument Team', due: '2024-08-31' },
      { action: 'Operator training refresh — high temp startup', status: 'planned', owner: 'Training Dept', due: '2024-08-15' },
      { action: 'Approve seal upgrade to API Plan 53B in 2025 TA plan', status: 'done', owner: 'Maintenance Manager', due: '2024-06-30' },
    ],
  },
  {
    id: 'RCA-2024-012',
    title: 'C-301 Vibration Trip — Rotor Fouling',
    equipment: 'C-301',
    date: '2024-01-22',
    severity: 'Medium',
    downtime: '6 hours',
    cost: '₹8.1 Lakhs',
    status: 'Closed',
    summary: 'Compressor C-301 tripped on high-high vibration (52 μm) due to rotor fouling from condensate carry-over',
    causes: {
      machine: ['Inlet separator SC-301 demister pad efficiency degraded — 40% lower performance'],
      method: ['Online wash procedure not performed for 8 months — overdue'],
      man: ['Vibration trend not reviewed in last monthly meeting'],
      material: ['Process gas moisture content elevated due to upstream upsets'],
      measurement: ['Vibration trend clearly showing increase for 3 weeks before trip'],
      environment: ['Post-monsoon humidity elevation'],
    },
    actions: [
      { action: 'Online rotor wash — approved solvent', status: 'done', owner: 'Operations', due: '2024-01-23' },
      { action: 'Replace SC-301 demister pad', status: 'done', owner: 'Maintenance', due: '2024-02-15' },
      { action: 'Monthly vibration review checklist added to ops meetings', status: 'done', owner: 'Deepak Nair', due: '2024-02-01' },
      { action: 'Pre-monsoon online wash schedule — add to annual plan', status: 'done', owner: 'Planning', due: '2024-03-01' },
    ],
  },
  {
    id: 'RCA-2023-041',
    title: 'P-101 Seal Failure During Tank Switchover',
    equipment: 'P-101',
    date: '2023-09-04',
    severity: 'High',
    downtime: '12 hours',
    cost: '₹9.2 Lakhs',
    status: 'Closed',
    summary: 'Mechanical seal failure caused by dry-run condition during Tank T-601 to T-602 switchover operation',
    causes: {
      machine: ['Single mechanical seal — no backup'],
      method: ['Switchover SOP did not include pre-prime verification before switching suction valves'],
      man: ['Operator performed switchover without verifying pump remained primed'],
      material: ['N/A'],
      measurement: ['No flow indication alarm configured for zero-flow condition'],
      environment: ['N/A'],
    },
    actions: [
      { action: 'Emergency seal replacement', status: 'done', owner: 'Rajesh Kumar', due: '2023-09-05' },
      { action: 'Revise switchover SOP — add pre-prime check', status: 'done', owner: 'Priya Sharma', due: '2023-10-01' },
      { action: 'Install zero-flow alarm on P-101 discharge', status: 'done', owner: 'Instrument Team', due: '2023-11-15' },
    ],
  },
]

export const PREDICTIVE_ALERTS = [
  { id: 'PA-001', equipment: 'C-301', type: 'Vibration', severity: 'critical', probability: 87, daysToFailure: 14, message: '87% probability of high-vibration trip within 14 days. Rotor fouling accelerating.', action: 'Online wash + plan offline balance correction', trend: [28,31,33,35,37,39,41] },
  { id: 'PA-002', equipment: 'P-104', type: 'Seal', severity: 'critical', probability: 71, daysToFailure: 21, message: 'Post-repair seal in high-risk window. Process temperature excursions ongoing.', action: 'Monitor temperature continuously. Expedite SOP revision.', trend: [45,48,52,57,61,65,70] },
  { id: 'PA-003', equipment: 'HE-202', type: 'Fouling', severity: 'high', probability: 58, daysToFailure: 35, message: 'Thermal efficiency at 71% — approaching minimum acceptable. Fouling rate elevated.', action: 'Schedule offline cleaning within 2 weeks', trend: [80,78,76,74,72,70,65] },
  { id: 'PA-004', equipment: 'FCV-101', type: 'Packing Leak', severity: 'medium', probability: 44, daysToFailure: 45, message: 'Packing leak and positioner drift — functional failure risk increasing', action: 'Raise corrective WO for packing replacement', trend: [20,24,28,31,35,39,44] },
  { id: 'PA-005', equipment: 'T-602', type: 'Roof Seal', severity: 'low', probability: 23, daysToFailure: 60, message: 'Minor roof seal wear. Seepage rate: 0.2 L/day. Monitor trend.', action: 'Plan detailed inspection in next maintenance window', trend: [10,12,14,16,18,21,23] },
]

export const MAINTENANCE_KPIs = {
  mtbf: { value: 847, unit: 'hours', trend: '+12%', label: 'Mean Time Between Failures' },
  mttr: { value: 6.2, unit: 'hours', trend: '-8%', label: 'Mean Time To Repair' },
  availability: { value: 96.4, unit: '%', trend: '+0.8%', label: 'Equipment Availability' },
  plannedRatio: { value: 68, unit: '%', trend: '+5%', label: 'Planned vs Reactive Ratio' },
  openWOs: { value: 14, unit: 'WOs', trend: null, label: 'Open Work Orders' },
  overdueWOs: { value: 3, unit: 'WOs', trend: null, label: 'Overdue Work Orders' },
}

export const FAILURE_TIMELINE = [
  { date: '2024-06-14', equipment: 'P-104', type: 'Seal Failure', severity: 'High', downtime: 18, rcaId: 'RCA-2024-067' },
  { date: '2024-04-02', equipment: 'B-501', type: 'Burner Ignition Failure', severity: 'Low', downtime: 2, rcaId: null },
  { date: '2024-03-01', equipment: 'P-101', type: 'Seal Replacement (PM triggered)', severity: 'Medium', downtime: 8, rcaId: 'RCA-2023-041' },
  { date: '2024-01-22', equipment: 'C-301', type: 'Vibration Trip', severity: 'Medium', downtime: 6, rcaId: 'RCA-2024-012' },
  { date: '2023-11-08', equipment: 'FCV-101', type: 'Control Valve Hunting', severity: 'Low', downtime: 3, rcaId: null },
  { date: '2023-09-04', equipment: 'P-101', type: 'Seal Failure', severity: 'High', downtime: 12, rcaId: 'RCA-2023-041' },
  { date: '2023-07-19', equipment: 'C-301', type: 'Vibration Alert (near miss)', severity: 'Medium', downtime: 0, rcaId: null },
  { date: '2023-05-12', equipment: 'HE-201', type: 'Fouling — Unplanned Cleaning', severity: 'Low', downtime: 16, rcaId: null },
]
