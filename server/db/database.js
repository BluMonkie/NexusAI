import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import bcrypt from 'bcryptjs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.join(__dirname, '../../nexus_iq_db.json')

const defaultData = {
  users: [],
  documents: [],
  document_chunks: [],
  graph_nodes: [],
  graph_edges: [],
  work_orders: [],
  incidents: [],
  compliance_rules: [],
}

export let db = null

export async function initDatabase() {
  console.log('Initializing LowDB Database...')
  db = await JSONFilePreset(dbPath, defaultData)

  // Seed default data if empty
  await seedInitialData()
}

async function seedInitialData() {
  // Seed Users
  if (db.data.users.length === 0) {
    console.log('Seeding initial users...')
    const salt = bcrypt.genSaltSync(10)
    const passHash = bcrypt.hashSync('password', salt)

    db.data.users.push(
      { id: 'u1', email: 'engineer@nexusiq.io', password: passHash, name: 'Rajesh Kumar', role: 'Plant Engineer' },
      { id: 'u2', email: 'technician@nexusiq.io', password: passHash, name: 'Vikram Singh', role: 'Maintenance Technician' },
      { id: 'u3', email: 'ehs@nexusiq.io', password: passHash, name: 'Ananya Sharma', role: 'EHS Specialist' },
      { id: 'u4', email: 'admin@nexusiq.io', password: passHash, name: 'Admin User', role: 'Plant Administrator' }
    )
  }

  // Seed Knowledge Graph Nodes & Edges
  if (db.data.graph_nodes.length === 0) {
    console.log('Seeding initial Knowledge Graph...')
    db.data.graph_nodes.push(
      { id: 'P-101A', label: 'Crude Charge Pump A', type: 'equipment', area: 'Area 100', status: 'healthy', criticality: 'critical', properties: { flow: '450 m3/h', pressure: '18.2 bar' } },
      { id: 'C-301', label: 'Fluid Catalytic Cracker', type: 'equipment', area: 'Area 300', status: 'warning', criticality: 'critical', properties: { temp: '520 C', vibration: '7.8 mm/s' } },
      { id: 'V-204', label: 'High-Pressure Separator', type: 'equipment', area: 'Area 200', status: 'healthy', criticality: 'high', properties: { pressure: '45 bar' } },
      { id: 'DOC-882', label: 'SOP-CL-301: FCC Startup Procedure', type: 'document', area: 'Area 300', status: 'active', criticality: 'high', properties: { version: 'v3.2', author: 'EHS' } },
      { id: 'SOP-EHS-04', label: 'Lockout / Tagout Safety Protocol', type: 'procedure', area: 'Global', status: 'active', criticality: 'critical', properties: { standard: 'OSHA 1910.147' } },
      { id: 'WO-4401', label: 'Replace Mechanical Seal P-101A', type: 'work_order', area: 'Area 100', status: 'completed', criticality: 'medium', properties: { date: '2024-06-12' } }
    )

    db.data.graph_edges.push(
      { id: 'e1', source_id: 'P-101A', target_id: 'WO-4401', label: 'MAINTAINED_BY', strength: 1.0 },
      { id: 'e2', source_id: 'C-301', target_id: 'DOC-882', label: 'OPERATED_BY', strength: 0.9 },
      { id: 'e3', source_id: 'DOC-882', target_id: 'SOP-EHS-04', label: 'GOVERNS', strength: 0.8 },
      { id: 'e4', source_id: 'P-101A', target_id: 'V-204', label: 'FEEDS_INTO', strength: 0.7 }
    )
  }

  // Seed Work Orders
  if (db.data.work_orders.length === 0) {
    console.log('Seeding initial Work Orders...')
    db.data.work_orders.push(
      { id: 'WO-9012', title: 'Vibration Analysis & Bearing Regreasing', equipment: 'C-301 FCC Reactor', priority: 'High', status: 'In Progress', assigned_to: 'Vikram Singh', desc: 'Elevated drive-end bearing vibration (7.8 mm/s). Requires diagnostic check.', created_at: new Date().toISOString() },
      { id: 'WO-9013', title: 'Replace Mechanical Seal Impeller A', equipment: 'P-101A Charge Pump', priority: 'Medium', status: 'Pending Approval', assigned_to: 'Unassigned', desc: 'Preventative maintenance window following 4,000 runtime hours.', created_at: new Date().toISOString() },
      { id: 'WO-9014', title: 'Pressure Relief Valve Calibration', equipment: 'V-204 H2 Separator', priority: 'Critical', status: 'Open', assigned_to: 'Rajesh Kumar', desc: 'Annual statutory compliance check required before Q3 audit.', created_at: new Date().toISOString() }
    )
  }

  // Seed Incidents
  if (db.data.incidents.length === 0) {
    console.log('Seeding initial Incidents...')
    db.data.incidents.push(
      { id: 'INC-2024-04', title: 'FCC Regenerator Catalyst Carryover', equipment: 'C-301', severity: 'High', date: '2024-05-14', root_cause: 'Cyclone dipleg pluggage due to thermal shock.', mitigation: 'Installed continuous acoustic DP sensor monitoring on diplegs.' },
      { id: 'INC-2023-11', title: 'Boiler Feed Pump Mechanical Failure', equipment: 'P-101A', severity: 'Critical', date: '2023-11-20', root_cause: 'Lube oil contamination with cooling water.', mitigation: 'Upgraded lip seals to magnetic face bearing isolators.' }
    )
  }

  // Seed Compliance Rules
  if (db.data.compliance_rules.length === 0) {
    console.log('Seeding initial Compliance Rules...')
    db.data.compliance_rules.push(
      { id: 'CR-101', standard: 'OISD-STD-117', title: 'Fire Protection Systems for Refineries', desc: 'Mandatory 100% deluge coverage on hydrocarbon charge pumps.', status: 'compliant', severity: 'Low' },
      { id: 'CR-102', standard: 'PESO Static Pressure Regulations', title: 'Pressure Vessel Recertification', desc: 'V-204 hydro-test due within 60 days.', status: 'non-compliant', severity: 'High' },
      { id: 'CR-103', standard: 'ISO 45001:2018', title: 'Management of Change (MOC) Audit', desc: 'MOC #402 missing final risk assessment signoff.', status: 'warning', severity: 'Medium' }
    )
  }

  // Always ensure SOP documents are in DB (runs on every startup to survive Render restarts)
  await seedSopDocuments()

  await db.write()
}

// SOP document seed data — guaranteed to exist on every server start
async function seedSopDocuments() {
  const sopSeedData = [
    {
      docId: 'DOC_Fictional_Training_SOP_PS618_pdf',
      name: 'Fictional_Training_SOP_PS618.pdf',
      filePath: 'uploads/Fictional_Training_SOP_PS618.pdf',
      text: `FICTIONAL PETROCHEM TRAINING PLANT Training Example – SOP & RCA Document ID SOP-PS-618-REV3 (Training Example) Title Emergency Isolation Procedure for T-412 Distillation Overhead Accumulator Facility Utilities & Distillation Training Unit Effective Date October 10, 2024 Purpose This fictional document is provided only for engineering training and formatting practice. It does not describe a real facility or operational procedure. Equipment Data Parameter Value Primary Asset T-412 Distillation Overhead Accumulator Associated Pump P-412C Reflux Pump Normal Pressure 18.5 bar MAWP 25.0 bar Operating Temperature 165 C High Pressure Alarm 22.8 bar PSV PSV-412A (23.8 bar) Emergency Isolation Valve EIV-412 Operating Procedure Verify permit and instrumentation. Purge with nitrogen. Start auxiliary systems. Start reflux pump gradually. Monitor pressure, temperature and level. Reduce feed and isolate on high-pressure alarm. LOTO Stop pump. Isolate power. Close inlet and outlet valves. Apply locks/tags. Drain and vent before maintenance. Illustrative RCA Incident ID: TRN-2024-017 Scenario: Simulated pressure increase after temporary reflux pump trip. Illustrative Root Cause: Reduced condenser performance due to exchanger fouling. Illustrative CAPA: Clean exchanger, improve predictive monitoring, shorten inspection intervals, and retrain operators. Notice This document is fictional and intended solely for training.`,
      entities: [
        { id: 'T-412', label: 'T-412 Distillation Overhead Accumulator', type: 'equipment', criticality: 'high' },
        { id: 'P-412C', label: 'P-412C Reflux Pump', type: 'equipment', criticality: 'medium' },
        { id: 'PSV-412A', label: 'PSV-412A Relief Valve 23.8 bar', type: 'equipment', criticality: 'critical' },
        { id: 'EIV-412', label: 'EIV-412 Emergency Isolation Valve', type: 'equipment', criticality: 'critical' },
        { id: 'TRN-2024-017', label: 'Incident TRN-2024-017 Reflux Pump Trip', type: 'incident', criticality: 'high' },
        { id: 'SOP-PS-618-REV3', label: 'SOP-PS-618-REV3 Emergency Isolation Procedure', type: 'procedure', criticality: 'high' },
      ]
    },
    {
      docId: 'DOC_Fictional_Training_SOP_SRU801_pdf',
      name: 'Fictional_Training_SOP_SRU801.pdf',
      filePath: 'uploads/Fictional_Training_SOP_SRU801.pdf',
      text: `FICTIONAL INDUSTRIAL TRAINING COMPLEX Training Example – Standard Operating Procedure & Incident Review Document ID SOP-SRU-801-REV0 (Training Example) Title Emergency Isolation Procedure for Sulfur Recovery Knockout Drum (KD-801) Facility Sulfur Recovery Training Unit Effective Date January 15, 2025 Reference Standards API 521, ISO 45001:2018 (Illustrative Only) Purpose This is a fictional engineering training document. Equipment Information Parameter Value Primary Asset KD-801 Sulfur Recovery Knockout Drum Associated Blower B-801A Process Gas Blower Normal Pressure 9.8 bar MAWP 15.0 bar Operating Temperature 210 C High Pressure Alarm 13.5 bar Relief Valve PSV-801A (14.2 bar) Emergency Isolation Valve EIV-801 Illustrative Operating Procedure Verify work authorization, instrument readiness, and communications. Purge vessel with inert nitrogen before introducing process gas. Start auxiliary systems and bring blower B-801A online gradually. Maintain drum level within operating band and observe pressure trend. If pressure approaches alarm level, reduce upstream flow and prepare isolation. Record all operating parameters in the shift log. Illustrative Lockout / Tagout Stop blower B-801A and isolate electrical supply. Close inlet and outlet isolation valves. Apply locks, tags, and verify zero energy. Drain and vent equipment before maintenance. Illustrative Incident Review Incident ID: TRN-2025-031 Scenario: Simulated increase in knockout drum pressure during a training exercise following reduced downstream gas flow. Illustrative Root Cause: Partial fouling of the downstream gas filter increased flow resistance, resulting in elevated vessel pressure. Illustrative Corrective Actions: Replace filter element, review differential-pressure trends, improve inspection frequency, and conduct refresher operator training. Document Notice This document is entirely fictional and is intended solely for educational, formatting, and training purposes.`,
      entities: [
        { id: 'KD-801', label: 'KD-801 Sulfur Recovery Knockout Drum', type: 'equipment', criticality: 'high' },
        { id: 'B-801A', label: 'B-801A Process Gas Blower', type: 'equipment', criticality: 'high' },
        { id: 'PSV-801A', label: 'PSV-801A Relief Valve 14.2 bar', type: 'equipment', criticality: 'critical' },
        { id: 'EIV-801', label: 'EIV-801 Emergency Isolation Valve', type: 'equipment', criticality: 'critical' },
        { id: 'TRN-2025-031', label: 'Incident TRN-2025-031 Knockout Drum Pressure', type: 'incident', criticality: 'high' },
        { id: 'SOP-SRU-801-REV0', label: 'SOP-SRU-801-REV0 Emergency Isolation Procedure', type: 'procedure', criticality: 'high' },
        { id: 'API-521', label: 'API 521 Pressure Relieving Systems', type: 'regulation', criticality: 'critical' },
        { id: 'ISO-45001', label: 'ISO 45001:2018 Occupational Safety Management', type: 'regulation', criticality: 'high' },
      ]
    },
    {
      docId: 'DOC_Fictional_Training_SOP_CDU215_pdf',
      name: 'Fictional_Training_SOP_CDU215.pdf',
      filePath: 'uploads/Fictional_Training_SOP_CDU215.pdf',
      text: `FICTIONAL PROCESS ENGINEERING TRAINING CENTER Illustrative SOP & Incident Review Document ID SOP-CDU-215-REV2 (Training Example) Title Controlled Startup Procedure for Crude Unit Feed Heater (H-215) Facility Crude Distillation Training Unit Effective Date March 5, 2025 Purpose Fictional document for engineering training and formatting practice only. Parameter Value Equipment H-215 Crude Feed Heater Pump P-215A Feed Transfer Pump Outlet Temperature 295 C Fuel Gas Pressure 5.4 bar High Temp Alarm 310 C Emergency Shutoff ESDV-215 Illustrative Procedure Verify permits and instrumentation. Complete burner purge. Establish circulation. Ignite burners sequentially. Increase firing gradually. Record operating data. Illustrative LOTO Stop pump. Isolate power. Close fuel gas valves. Verify zero energy. Illustrative Incident Incident ID: TRN-2025-062 Scenario: Simulated high outlet temperature following reduced combustion airflow. Illustrative Root Cause: Fouled combustion air filters reduced airflow. Illustrative CAPA: Replace filters, inspect instrumentation, shorten inspection intervals, update training. Notice Entirely fictional. For educational use only.`,
      entities: [
        { id: 'H-215', label: 'H-215 Crude Feed Heater', type: 'equipment', criticality: 'high' },
        { id: 'P-215A', label: 'P-215A Feed Transfer Pump', type: 'equipment', criticality: 'medium' },
        { id: 'ESDV-215', label: 'ESDV-215 Emergency Shutoff Valve', type: 'equipment', criticality: 'critical' },
        { id: 'TRN-2025-062', label: 'Incident TRN-2025-062 High Outlet Temperature', type: 'incident', criticality: 'high' },
        { id: 'SOP-CDU-215-REV2', label: 'SOP-CDU-215-REV2 Controlled Startup Procedure', type: 'procedure', criticality: 'high' },
      ]
    }
  ]

  for (const sop of sopSeedData) {
    // Ensure document record exists
    if (!db.data.documents.some(d => d.id === sop.docId)) {
      db.data.documents.push({
        id: sop.docId,
        name: sop.name,
        type: 'PDF',
        category: 'Engineering SOP',
        status: 'indexed',
        file_path: sop.filePath,
        uploaded_at: new Date().toISOString(),
      })
    }

    // Ensure document graph node exists
    if (!db.data.graph_nodes.some(n => n.id === sop.docId)) {
      db.data.graph_nodes.push({
        id: sop.docId,
        label: sop.name,
        type: 'document',
        area: 'Global',
        status: 'active',
        criticality: 'medium',
        properties: { category: 'Engineering SOP' },
      })
    }

    // Ensure document chunks exist (plain text, no embedding — embedding generated on upload)
    const chunkId = `${sop.docId}_chunk_0`
    if (!db.data.document_chunks.some(c => c.id === chunkId)) {
      db.data.document_chunks.push({
        id: chunkId,
        document_id: sop.docId,
        chunk_index: 0,
        content: sop.text,
        embedding: null,
      })
    }

    // Ensure entity nodes exist
    for (const entity of sop.entities) {
      if (!db.data.graph_nodes.some(n => n.id === entity.id)) {
        db.data.graph_nodes.push({
          id: entity.id,
          label: entity.label,
          type: entity.type,
          area: 'Area 300',
          status: entity.type === 'incident' ? 'investigated' : 'active',
          criticality: entity.criticality,
          properties: { tag: entity.id, source_doc: sop.name },
        })
      }

      // Ensure connecting edge exists
      const edgeId = `edge_${sop.docId}_${entity.id}`
      if (!db.data.graph_edges.some(e => e.id === edgeId)) {
        db.data.graph_edges.push({
          id: edgeId,
          source_id: sop.docId,
          target_id: entity.id,
          source: sop.docId,
          target: entity.id,
          label: entity.type === 'regulation' ? 'GOVERNED_BY' : entity.type === 'incident' ? 'REPORTS' : 'REFERENCES',
          type: 'references',
        })
      }
    }
  }
}
