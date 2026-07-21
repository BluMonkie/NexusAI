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

  await db.write()
}
