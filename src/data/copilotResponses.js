// ============================================================
// AI Copilot Pre-computed Responses — RAG Simulation
// 15 domain-expert Q&A pairs with source citations
// ============================================================

export const COPILOT_RESPONSES = [
  {
    id: 'q-001',
    triggers: ['p-101', 'pump p-101', 'pump 101', 'maintenance history'],
    question: 'What is the maintenance history of Pump P-101?',
    answer: `**Pump P-101** (Centrifugal Pump, Tank Farm A) has the following maintenance history:

**Recent Work Orders:**
- **WO #10423** (Mar 2024): Mechanical seal replacement — mechanical seal failed after 18 months of service. Root cause identified as dry-run operation during Tank T-601 switchover. New Flowserve dual cartridge seal installed.
- **WO #9871** (Aug 2023): Bearing replacement — high vibration (8.4 mm/s) exceeding API 610 limits of 7.1 mm/s. SKF 6312-Z bearings replaced.
- **WO #9244** (Jan 2023): Impeller wear inspection — 12% diameter reduction detected. Pump trimmed to 95% of original diameter.

**Current Status:**
- Health Index: 78% ⚠️
- Last vibration reading: 5.2 mm/s (within limits)
- Operating temperature: 68°C (nominal)
- Next scheduled PM: August 2024 (Bearing lube + alignment check)

**Pattern Alert:** 🔴 P-101 has experienced seal failures twice in 24 months — both during tank switchover operations. Recommend procedural review of switchover sequence to prevent dry-run conditions.`,
    sources: [
      { doc: 'WO #10423 — P-101 Mechanical Seal Replacement', docId: 'WO-10423', page: 2, confidence: 97 },
      { doc: 'WO #9871 — P-101 Bearing Replacement Report', docId: 'WO-9871', page: 1, confidence: 95 },
      { doc: 'OEM Manual — KSB Pump P-101', docId: 'OEM-KSB-P101', page: 48, confidence: 88 },
      { doc: 'Incident Report INC-2023-041', docId: 'INC-2023-041', page: 3, confidence: 82 },
    ],
    confidence: 96,
    entities: ['P-101', 'WO-10423', 'Tank T-601', 'API 610'],
    relatedQuestions: [
      'What are the vibration limits for centrifugal pumps?',
      'What caused the seal failure in P-101?',
      'Show me the pump startup SOP for P-101',
    ],
  },
  {
    id: 'q-002',
    triggers: ['hot work', 'tank farm', 'safety procedure', 'welding', 'flame'],
    question: 'What are the safety procedures for hot work in Tank Farm A?',
    answer: `**Hot Work Safety Procedures — Tank Farm A** (HSE-SOP-101, Rev 6)

**Mandatory Pre-conditions:**
1. ✅ Permit to Work (PTW) system clearance — minimum Level 3 PTW required
2. ✅ Gas test by certified Gas Tester: LEL < 10% within 10m radius
3. ✅ Fire watch assigned (minimum 1 per hot work activity)
4. ✅ Nearest fire extinguisher within 5m (minimum 9 kg DCP)
5. ✅ Hydrocarbon isolation confirmed — all drains plugged, flanges blinded

**Tank Farm A Specific Requirements:**
- **T-601 / T-602 vicinity (within 30m):** No hot work permitted unless tanks are fully degassed and gas certificate issued by Inspector
- **Floating Roof Tanks:** Mandatory 15m hot work exclusion zone when product level >1m
- OISD-118 Section 7.4 compliance mandatory — simultaneous operations log required

**During Hot Work:**
- Continuous gas monitoring every 30 minutes
- Immediate suspension if LEL exceeds 5%
- Wind direction check every 2 hours — hot work must be upwind of hydrocarbon sources

**Emergency Response:**
- Emergency stop signal: 3 short blasts on siren
- Assembly point: Gate 3 muster area
- Fire brigade contact: Ext. 1100 / 9876543210`,
    sources: [
      { doc: 'Hot Work Safety SOP — HSE-SOP-101', docId: 'HSE-SOP-101', page: 4, confidence: 98 },
      { doc: 'OISD-118 — Section 7: Hot Work', docId: 'OISD-118-2019', page: 34, confidence: 94 },
      { doc: 'PTW System Procedure — HSE-SOP-PROC-005', docId: 'PTW-005', page: 8, confidence: 91 },
      { doc: 'Tank Farm A Layout Drawing — DWG-TFA-001', docId: 'DWG-TFA-001', page: 1, confidence: 87 },
    ],
    confidence: 97,
    entities: ['Tank Farm A', 'T-601', 'T-602', 'OISD-118', 'PTW'],
    relatedQuestions: [
      'What is the PTW process for confined space entry?',
      'What are the gas testing requirements for Tank Farm B?',
      'Who are the authorized hot work supervisors?',
    ],
  },
  {
    id: 'q-003',
    triggers: ['c-301', 'compressor', 'vibration', 'limit', 'alarm'],
    question: 'What are the vibration limits for Compressor C-301?',
    answer: `**Compressor C-301 — Vibration Limits & Current Status**

Per **API 670 (5th Edition)** and OEM Manual (Solar Turbines, Doc OEM-SOLAR-C301):

| Parameter | Alert Level | Trip Level | Current Reading |
|---|---|---|---|
| Radial Vibration (DE) | 25 μm pk-pk | 50 μm pk-pk | **41 μm** ⚠️ |
| Radial Vibration (NDE) | 25 μm pk-pk | 50 μm pk-pk | **38 μm** ⚠️ |
| Axial Displacement | 0.3 mm | 0.6 mm | 0.18 mm ✅ |
| Bearing Temperature | 80°C | 95°C | 74°C ✅ |
| Process Gas Temp (Discharge) | 145°C | 165°C | 138°C ✅ |

⚠️ **ALERT:** Radial vibration at DE bearing is at **82% of trip level** — currently in alert zone. Inspection WO #10891 is open.

**RCA Findings (Inspection Report INSP-2024-089):**
- Primary cause: Rotor unbalance due to fouling of impeller stage 2
- Contributing factor: Operation at off-design point (62% load) for extended period
- Recommended action: Online wash with approved solvent, schedule offline balance correction within 45 days

**AI Prediction:** 🔴 Based on vibration trend, **87% probability of high-vibration trip within 14 days** if no corrective action taken.`,
    sources: [
      { doc: 'API 670 — Machinery Protection Systems', docId: 'API-670-5E', page: 28, confidence: 99 },
      { doc: 'C-301 OEM Manual — Solar Turbines', docId: 'OEM-SOLAR-C301', page: 156, confidence: 97 },
      { doc: 'Inspection Report INSP-2024-089', docId: 'INSP-2024-089', page: 11, confidence: 94 },
      { doc: 'WO #10891 — C-301 Vibration Investigation', docId: 'WO-10891', page: 3, confidence: 92 },
    ],
    confidence: 95,
    entities: ['C-301', 'API 670', 'INSP-2024-089', 'WO-10891'],
    relatedQuestions: [
      'What is the maintenance procedure for C-301 overhaul?',
      'What is the root cause analysis for C-301 vibration?',
      'Are there any similar compressor failures in our history?',
    ],
  },
  {
    id: 'q-004',
    triggers: ['boiler', 'b-501', 'regulation', 'compliance', 'oisd', 'peso'],
    question: 'Which regulations apply to our boiler operations?',
    answer: `**Regulatory Framework — Boiler B-501 (Utility Area)**

**Applicable Regulations:**

**1. Indian Boilers Act, 1923 & IBR Rules**
- Statutory inspection by Boiler Inspector every 12 months
- Certificate of Competency for Boiler Operators (mandatory)
- Max Allowable Working Pressure (MAWP): 14.5 kg/cm² — must not exceed
- Last IBR inspection: November 2023 ✅ (Next due: November 2024)

**2. OISD-118 (Oilfield/Refinery Fire Safety)**
- 30m exclusion zone from hydrocarbon areas maintained ✅
- Automatic fuel cutoff on flame failure — functional test monthly
- Stack emission monitoring: quarterly compliance with CPCB norms

**3. Factory Act 1948 — Section 31 (Boiler Safety)**
- Competent person certification for pressure parts inspection
- Register of Examinations to be maintained on-site

**4. CPCB Emission Norms (Thermal Power Plants)**
- NOx: < 300 mg/Nm³ (current: 218 mg/Nm³ ✅)
- SO₂: < 600 mg/Nm³ (current: 341 mg/Nm³ ✅)
- Particulate Matter: < 50 mg/Nm³ (current: 31 mg/Nm³ ✅)

**⚠️ Gap Identified:** Boiler operator competency certificate for Day Shift Operator (Ramesh G.) expired May 2024. Renewal required within 30 days.`,
    sources: [
      { doc: 'Indian Boilers Act 1923 — Consolidated', docId: 'IBA-1923', page: 18, confidence: 98 },
      { doc: 'OISD-118 — Section 12: Boiler Safety', docId: 'OISD-118-2019', page: 58, confidence: 95 },
      { doc: 'Factory Act Guidelines — Pressure Vessels', docId: 'FA-1948-GUIDE', page: 72, confidence: 93 },
      { doc: 'CPCB Emission Monitoring Report Q1-2024', docId: 'CPCB-MON-Q1-2024', page: 4, confidence: 91 },
    ],
    confidence: 94,
    entities: ['B-501', 'OISD-118', 'Factory Act', 'CPCB', 'IBR'],
    relatedQuestions: [
      'When is the next scheduled boiler inspection?',
      'What is the procedure for boiler startup?',
      'Show compliance gaps for the utility area',
    ],
  },
  {
    id: 'q-005',
    triggers: ['rca', 'root cause', 'seal failure', 'p-104', 'failure analysis'],
    question: 'What is the root cause analysis for P-104 seal failure?',
    answer: `**Root Cause Analysis — Pump P-104 Seal Failure (INC-2024-067)**

**Failure Event:** Mechanical seal failure on P-104 (Reciprocating Pump, Process Unit 2) on 14-June-2024, resulting in product leak and emergency shutdown.

**Immediate Cause:**
- Seal face separation due to thermal shock from process fluid temperature excursion (142°C vs. rated 120°C max)

**Root Causes (Fishbone Analysis):**

**Machine (Equipment):**
- Seal specification: API Plan 11 — single seal. Inadequate for temperature excursions >130°C
- Recommended upgrade: API Plan 53B (pressurized dual seal) — budgeted for next turnaround

**Method (Process):**
- Start-up procedure did not include pre-warming of pump casing before feed introduction
- SOP OPS-SOP-204 missing thermal conditioning step for high-temperature service

**Man (Human Factors):**
- Operator training on high-temp startup not completed for 2 of 4 operators (Operator training gap — noted in HR system)

**Material:**
- Process fluid composition deviation: naphtha concentration 34% above normal — increases thermal load

**Corrective Actions:**
1. ✅ Emergency seal replacement (completed 15-June-2024)
2. 🔄 SOP revision to include thermal conditioning step (in progress — target 31-July-2024)
3. ⬜ Operator training refresh scheduled for August 2024
4. ⬜ Seal upgrade in 2025 Turnaround plan (approved)`,
    sources: [
      { doc: 'RCA Report — P-104 Seal Failure INC-2024-067', docId: 'RCA-2024-067', page: 6, confidence: 98 },
      { doc: 'Pump Startup SOP — OPS-SOP-204', docId: 'OPS-SOP-204', page: 5, confidence: 92 },
      { doc: 'Process Deviation Report — June 2024', docId: 'PDR-JUN-2024', page: 2, confidence: 88 },
      { doc: 'P-104 OEM Seal Specification Sheet', docId: 'OEM-P104-SEAL', page: 1, confidence: 85 },
    ],
    confidence: 97,
    entities: ['P-104', 'INC-2024-067', 'OPS-SOP-204', 'API Plan 11', 'API Plan 53B'],
    relatedQuestions: [
      'What similar seal failures have occurred in the last 3 years?',
      'What is the budget for the 2025 turnaround?',
      'Show me the revised startup SOP for P-104',
    ],
  },
  {
    id: 'q-006',
    triggers: ['compliance', 'gap', 'audit', 'regulatory', 'oisd-118'],
    question: 'What are the current compliance gaps for OISD-118?',
    answer: `**OISD-118 Compliance Gap Analysis — Current Status**

AI has identified **4 compliance gaps** against OISD-118 (Latest revision: 2019):

| # | Section | Requirement | Gap | Severity | Due Date |
|---|---|---|---|---|---|
| 1 | 7.2.3 | Firewater system pressure test (semi-annual) | Last test: 11 months ago | 🔴 High | Overdue |
| 2 | 4.1.8 | Fixed gas detectors calibration (quarterly) | 3 of 18 detectors uncalibrated | 🟡 Medium | 15-Aug-2024 |
| 3 | 9.3.1 | Emergency shutdown valve (ESDV) stroke test | ESDV-T601-01 stroke test pending | 🟡 Medium | 30-Aug-2024 |
| 4 | 5.2.2 | Foam system discharge test (annual) | Annual test not completed this year | 🟡 Medium | 31-Oct-2024 |

**Overall OISD-118 Compliance Score: 78%** ⚠️

**Recommended Immediate Actions:**
1. Schedule firewater system pressure test this week — overdue and highest risk
2. Arrange gas detector calibration for detectors: GD-012, GD-015, GD-018
3. Raise work order for ESDV-T601-01 stroke test before August 15

**Auto-generated Evidence Package:** Available for download — covers 47 compliant items with supporting documentation from inspection records and test certificates.`,
    sources: [
      { doc: 'OISD-118 Standard (2019 Edition)', docId: 'OISD-118-2019', page: 23, confidence: 99 },
      { doc: 'Plant Safety Audit Report — Q2 2024', docId: 'AUDIT-Q2-2024', page: 14, confidence: 94 },
      { doc: 'Gas Detector Calibration Register', docId: 'CAL-REG-2024', page: 3, confidence: 97 },
      { doc: 'ESDV Test Certificate Archive', docId: 'ESDV-CERT-2023', page: 1, confidence: 90 },
    ],
    confidence: 95,
    entities: ['OISD-118', 'Tank Farm B', 'ESDV-T601-01', 'GD-012', 'GD-015'],
    relatedQuestions: [
      'When is the next safety audit scheduled?',
      'Generate a compliance evidence package for OISD-118',
      'What is our compliance status for PESO regulations?',
    ],
  },
  {
    id: 'q-007',
    triggers: ['predictive', 'predict', 'failure', 'next 30', 'risk', 'upcoming'],
    question: 'Which equipment is at highest risk of failure in the next 30 days?',
    answer: `**AI Predictive Risk Assessment — Next 30 Days**

Based on vibration trends, maintenance history, operating conditions, and failure pattern database:

| Rank | Equipment | Failure Probability | Primary Risk Factor | Action |
|---|---|---|---|---|
| 🔴 1 | **C-301** | **87%** | High vibration (82% of trip level), rotor fouling | Immediate: Online wash, plan offline balance |
| 🔴 2 | **P-104** | **71%** | Recent seal failure, SOP not yet revised, high-temp service | Monitor; expedite SOP update |
| 🟡 3 | **HE-202** | **58%** | Fouling indicator rising, last cleaned 14 months ago | Schedule cleaning in next 2 weeks |
| 🟡 4 | **FCV-101** | **44%** | Packing leak reported, positioner drift observed | Raise PM work order |
| 🟢 5 | **T-602** | **23%** | Roof seal showing wear, minor product seepage | Plan inspection next month |

**Contributing Patterns Identified:**
- Monsoon season historically increases pump seal failures by 34% at this plant (based on 8 years of data)
- Post-maintenance induced failures spike in weeks 1-2 after major work — P-104 currently in this window

**AI Confidence:** 84% (based on 127 historical failure events from plant records)

> 📄 Full predictive maintenance report available — covers next 90 days across all 47 critical assets.`,
    sources: [
      { doc: 'Predictive Model — Plant Asset Failure Database', docId: 'PM-DB-2024', page: 1, confidence: 84 },
      { doc: 'Vibration Monitoring Trend Report — July 2024', docId: 'VIB-TREND-JUL24', page: 8, confidence: 92 },
      { doc: 'Maintenance History Database — 2016-2024', docId: 'MH-DB-FULL', page: 1, confidence: 88 },
      { doc: 'Monsoon Season Impact Analysis — Internal Study 2022', docId: 'MONSOON-STUDY-2022', page: 4, confidence: 79 },
    ],
    confidence: 84,
    entities: ['C-301', 'P-104', 'HE-202', 'FCV-101', 'T-602'],
    relatedQuestions: [
      'What is the detailed RCA for C-301 vibration?',
      'Show me the maintenance schedule for the next 2 weeks',
      'How many unplanned shutdowns occurred last year?',
    ],
  },
  {
    id: 'q-008',
    triggers: ['v-401', 'vessel', 'pressure vessel', 'inspection', 'api 510'],
    question: 'When is V-401 next due for inspection and what were past findings?',
    answer: `**Pressure Vessel V-401 — Inspection History & Schedule**

**Vessel Details:** V-401, Separator Vessel, Process Unit 2 | MAWP: 35 kg/cm² | Year of manufacture: 2009

**Inspection Schedule (per API 510):**
- External Inspection: Every 5 years | Last: March 2022 | **Next due: March 2027**
- Internal Inspection: Every 10 years | Last: March 2017 | **Next due: March 2027** (during shutdown)
- Risk-Based Inspection (RBI) Assessment: Completed 2023

**Past Inspection Findings (INSP-2024-101):**
- 2024: Minor corrosion at bottom head (0.8mm wall loss vs 2mm corrosion allowance) — **acceptable, monitor**
- 2022: Nozzle N4 gasket replaced (flange leak repaired) — closed
- 2019: Weld seam inspection — 3 small indications <3mm detected, within ASME acceptance criteria — closed
- 2017: Internal coating: epoxy lining in good condition, minor holidays repaired

**Current Status:**
- Corrosion Rate: 0.12 mm/year (below design rate of 0.3 mm/year) ✅
- Next RBI Review: Scheduled Q3-2024
- Remaining Life: Estimated 18+ years at current corrosion rate

**⚠️ Note:** Process fluid change proposed in Q4-2024 (higher H₂S concentration). RBI reassessment mandatory before implementing.`,
    sources: [
      { doc: 'API 510 — Pressure Vessel Inspection Code', docId: 'API-510-12E', page: 42, confidence: 99 },
      { doc: 'V-401 API 510 Inspection Report 2024', docId: 'INSP-2024-101', page: 6, confidence: 98 },
      { doc: 'RBI Assessment — V-401 (2023)', docId: 'RBI-V401-2023', page: 12, confidence: 94 },
      { doc: 'Process Unit 2 P&ID — Sheet 2B', docId: 'ENG-PID-002', page: 1, confidence: 86 },
    ],
    confidence: 96,
    entities: ['V-401', 'API 510', 'INSP-2024-101', 'ASME'],
    relatedQuestions: [
      'What is the remaining life of all pressure vessels?',
      'Show me the P&ID for Process Unit 2',
      'What materials are stored in V-401?',
    ],
  },
  {
    id: 'q-009',
    triggers: ['lesson', 'incident', 'pattern', 'recurring', 'near miss', 'history'],
    question: 'Are there any recurring failure patterns we should know about?',
    answer: `**AI Failure Pattern Intelligence — Key Recurring Patterns**

Analysis of **347 incident/near-miss records (2016-2024)** has identified the following systemic patterns:

**🔴 Pattern 1: Pump Seal Failures During Switchover Operations**
- Frequency: 8 incidents in 6 years (P-101 ×2, P-103 ×3, P-107 ×3)
- Common factor: Dry-run condition during tank switchover — SOP does not mandate pre-prime check
- Estimated cost: ₹48 lakhs in repairs + 340 hours downtime
- **Recommendation:** Add mandatory pre-prime verification step to all pump switchover SOPs

**🟡 Pattern 2: Compressor Vibration Trips — Post-Monsoon**
- Frequency: 5 incidents in 4 years (Jul-Sep window)
- Common factor: Fouling from condensate carry-over in humid conditions + inlet separator inefficiency
- **Recommendation:** Pre-monsoon inlet separator inspection + online wash schedule

**🟡 Pattern 3: Heat Exchanger Fouling — Accelerated in Q1 (Jan-Mar)**
- Frequency: 9 maintenance events
- Common factor: Crude slate change in Q4 increases asphaltene content → accelerated fouling
- **Recommendation:** Reduce cleaning interval from 18 to 12 months for Q1 processing units

**🟢 Pattern 4: Control Valve Packing Leaks — Aging Fleet**
- 23 valves >15 years old — packing leak rate 4× higher than newer valves
- **Recommendation:** Prioritize 8 critical valves for replacement in 2025 budget

**External Benchmarks:** Similar patterns reported in OISD incident database for refineries of similar capacity.`,
    sources: [
      { doc: 'Plant Incident Database 2016-2024', docId: 'INCIDENT-DB', page: 1, confidence: 91 },
      { doc: 'OISD Incident Analysis Report 2023', docId: 'OISD-INC-2023', page: 22, confidence: 83 },
      { doc: 'Monsoon Season Impact Analysis 2022', docId: 'MONSOON-STUDY-2022', page: 6, confidence: 79 },
      { doc: 'RCA Report Collection 2020-2024', docId: 'RCA-COLLECTION', page: 1, confidence: 88 },
    ],
    confidence: 88,
    entities: ['P-101', 'P-103', 'P-107', 'C-301', 'OISD'],
    relatedQuestions: [
      'What is the total cost of unplanned downtime last year?',
      'Show me all seal failure incidents in the last 5 years',
      'What pump switchover SOP changes are recommended?',
    ],
  },
  {
    id: 'q-010',
    triggers: ['confined space', 'entry', 'ptw', 'permit', 'atmosphere test'],
    question: 'What is the confined space entry procedure?',
    answer: `**Confined Space Entry Procedure — HSE-SOP-105 (Rev 3)**

**Definition:** Any enclosed space with limited means of entry/exit — vessels, tanks, columns, pits, sewers.

**Mandatory Pre-Entry Requirements:**
1. **PTW Level 4** (Confined Space) — signed by Area Engineer + HSE Representative
2. **Atmospheric Testing** by certified Gas Tester:
   - O₂: 19.5% - 23.5% (current reading required)
   - LEL: <10%
   - H₂S: <5 ppm
   - CO: <20 ppm
3. **Isolation Certificate** — all energy sources isolated (LOTO applied)
4. **Rescue Plan** in place — rescue team briefed and equipped
5. **Entrants:** Maximum 2 persons inside at any time

**During Entry:**
- Continuous atmospheric monitoring (4-gas monitor worn by entrant)
- Standby attendant outside at all times — no exceptions
- Communication check every 15 minutes
- Entry log maintained at entry point

**Emergency Egress:**
- Lifeline attached to entrant when visibility <1m
- Tripod + winch available for rescue
- Emergency signal: 2 tugs on lifeline = exit immediately

**Recent Near-Miss (INC-2023-087):** Entrant in Tank T-602 experienced H₂S spike to 8 ppm — exceeded safe limit. Entry suspended. Root cause: inadequate purging of residual product.`,
    sources: [
      { doc: 'Confined Space Entry SOP — HSE-SOP-105', docId: 'HSE-SOP-105', page: 3, confidence: 99 },
      { doc: 'OISD-GDN-192 Confined Space Safety', docId: 'OISD-GDN-192', page: 11, confidence: 95 },
      { doc: 'PTW System Procedure — PROC-005', docId: 'PTW-005', page: 12, confidence: 92 },
      { doc: 'Near-Miss Report INC-2023-087', docId: 'INC-2023-087', page: 2, confidence: 88 },
    ],
    confidence: 98,
    entities: ['HSE-SOP-105', 'PTW', 'T-602', 'INC-2023-087', 'LOTO'],
    relatedQuestions: [
      'What are the gas testing requirements for Tank Farm B?',
      'Who can authorize a confined space entry permit?',
      'What rescue equipment is required for confined space entry?',
    ],
  },
  {
    id: 'q-011',
    triggers: ['he-201', 'heat exchanger', 'fouling', 'cleaning', 'thermal'],
    question: 'What is the cleaning schedule and fouling history for HE-201?',
    answer: `**Heat Exchanger HE-201 — Fouling & Cleaning History**

**Equipment:** HE-201, Shell & Tube Heat Exchanger, Process Unit 1
- Service: Crude oil preheat (Shell side: crude, Tube side: process water)
- Design U-value: 380 W/m²K | Current U-value: 291 W/m²K | Fouling factor: 23.4%

**Cleaning History:**
| Date | Type | Finding | Duration |
|---|---|---|---|
| Jan 2024 | Online chemical cleaning | 8% improvement in U-value | 4 hours |
| Aug 2022 | Offline hydrojetting | Heavy asphaltene deposits, tubes 30% blocked | 3 days |
| Feb 2021 | Offline hydrojetting | Moderate fouling, all tubes cleared | 2 days |
| Jun 2019 | Offline chemical + mechanical | Heavy fouling, 4 tubes plugged | 4 days |

**Current Status (WO #11204 — In Progress):**
- Fouling rate has increased 35% vs. previous period
- Crude slate change in Q4-2023 (higher asphaltene content) — likely cause
- U-value dropping 12 W/m²K per month — offline cleaning recommended within 4 weeks

**AI Recommendation:**
Reduce cleaning interval from 18 to 12 months for HE-201 given current crude quality. Estimated energy saving from maintaining target U-value: **₹18 lakhs/year.**`,
    sources: [
      { doc: 'WO #11204 — HE-201 Fouling Investigation', docId: 'WO-11204', page: 2, confidence: 96 },
      { doc: 'Heat Exchanger Monitoring Report — June 2024', docId: 'HE-MON-JUN24', page: 5, confidence: 93 },
      { doc: 'Crude Oil Assay Report Q4-2023', docId: 'CRUDE-ASSAY-Q4-23', page: 3, confidence: 87 },
    ],
    confidence: 94,
    entities: ['HE-201', 'WO-11204', 'Process Unit 1'],
    relatedQuestions: [
      'What is the fouling history for HE-202?',
      'How much energy is lost due to heat exchanger fouling?',
      'What cleaning chemicals are approved for HE-201?',
    ],
  },
  {
    id: 'q-012',
    triggers: ['document', 'pid', 'drawing', 'p&id', 'engineering drawing', 'find'],
    question: 'Where can I find the P&ID for Process Unit 2?',
    answer: `**P&ID — Process Unit 2 Documents**

Found **3 relevant engineering drawings** in the document repository:

| Document | Revision | Last Updated | Coverage |
|---|---|---|---|
| **P&ID Sheet 2B** (ENG-PID-002) | Rev 8 | March 2024 | Main process flow — V-401, C-301, C-302 |
| **P&ID Sheet 2C** (ENG-PID-002C) | Rev 5 | January 2023 | Utility connections, instrument loops |
| **P&ID Sheet 2D** (ENG-PID-002D) | Rev 3 | August 2022 | Safety systems, ESDV locations |

**Key Equipment on P&ID Sheet 2B:**
- Compressors: C-301, C-302 (parallel configuration)
- Separator Vessel: V-401
- Suction scrubber: SC-301
- Control Valves: FCV-301, PCV-302, TCV-303
- Safety Valves: PSV-301A/B (dual PSVs on V-401)

**⚠️ Note:** P&ID Sheet 2B (Rev 8) was updated in March 2024 to reflect ESDV addition on C-301 discharge. If you are using an older revision, please update.

**Access:** Documents are available in the Engineering Document Management System (EDMS). Direct link: EDMS/Process-Unit-2/P&ID`,
    sources: [
      { doc: 'P&ID Sheet 2B — Process Unit 2 (Rev 8)', docId: 'ENG-PID-002', page: 1, confidence: 99 },
      { doc: 'EDMS Document Register — Engineering Drawings', docId: 'EDMS-REG-2024', page: 44, confidence: 96 },
    ],
    confidence: 99,
    entities: ['V-401', 'C-301', 'C-302', 'ENG-PID-002'],
    relatedQuestions: [
      'Show me the instrument list for Process Unit 2',
      'What changes were made in P&ID Rev 8?',
      'Find all P&IDs for the Gas Plant area',
    ],
  },
  {
    id: 'q-013',
    triggers: ['emergency shutdown', 'esd', 'shutdown procedure', 'emergency', 'esd procedure'],
    question: 'What is the emergency shutdown procedure for the plant?',
    answer: `**Emergency Shutdown Procedure — ESD-PROC-001 (Rev 4)**

**Trigger Conditions (Automatic ESD — Level 3):**
- Process gas leak detected (LEL >25%) at any gas detector
- Fire/heat detector activation in process area
- High-high pressure on V-401 (>42 kg/cm²)
- C-301 or C-302 high-high vibration trip
- Loss of instrument air pressure (<3.5 bar)

**ESD Sequence (Automatic — within 8 seconds):**
1. All process feed control valves → CLOSE
2. All ESDVs → CLOSE (ESDV-T601-01, ESDV-T602-01, ESDV-PU2-01)
3. Pumps P-101, P-102, P-104 → TRIP
4. Compressors C-301, C-302 → TRIP (controlled coast-down)
5. Firewater system → AUTO-START
6. PA announcement activated: "Plant Emergency — All non-essential personnel evacuate"

**Manual ESD (Level 1 / Level 2):**
- Level 1 (Area): Emergency stop pushbuttons at each unit — stops only that unit
- Level 2 (Plant-wide): Red ESD button in Main Control Room — full plant shutdown

**Post-ESD Actions:**
1. Notify Plant Manager and Safety Officer immediately
2. Account for all personnel — use roll call at assembly points
3. No re-entry without clearance from HSE Officer
4. Incident reporting within 1 hour per OISD-GDN-105

**Last ESD Drill:** April 2024 — Duration 4m 32s ✅ (target: <6 minutes)`,
    sources: [
      { doc: 'Emergency Shutdown Procedure — ESD-PROC-001', docId: 'ESD-PROC-001', page: 2, confidence: 99 },
      { doc: 'OISD-GDN-105 — Emergency Management', docId: 'OISD-GDN-105', page: 14, confidence: 94 },
      { doc: 'ESD System Functional Description', docId: 'ESD-SYS-FD-001', page: 8, confidence: 97 },
    ],
    confidence: 99,
    entities: ['ESD-PROC-001', 'V-401', 'C-301', 'C-302', 'OISD-GDN-105'],
    relatedQuestions: [
      'When was the last ESD system test?',
      'What is the procedure for plant re-start after emergency shutdown?',
      'Who is the designated ESD coordinator?',
    ],
  },
  {
    id: 'q-014',
    triggers: ['knowledge', 'expert', 'retire', 'experienced', 'knowledge transfer'],
    question: 'What institutional knowledge has been captured for retiring engineers?',
    answer: `**Knowledge Preservation Status — Retiring Expert Staff**

NEXUS IQ has identified **3 subject matter experts** approaching retirement within 2 years:

**1. Anil Verma (Inspection Lead — 22 years)**
- Expertise: API 510/570/571 inspection, RBI methodology, plant corrosion map
- Knowledge captured: 68% ✅ (Inspection procedures, corrosion database, 14 inspection guides)
- Knowledge gaps: Undocumented tribal knowledge on Tank Farm B soil conditions, FCCU corrosion quirks
- **Action:** 4 knowledge capture sessions scheduled — Q3/Q4 2024

**2. Mohan Pillai (Senior Process Operator — 27 years)**  
- Expertise: Startup/shutdown of Process Unit 1, abnormal situation management
- Knowledge captured: 41% ⚠️ (Only written SOPs — no video walkthroughs)
- Knowledge gaps: Startup nuances for HE-201 during winter, unofficial P-101 pre-warm trick
- **Action:** Video capture of 6 key procedures planned — urgent

**3. Krishnaswamy Rao (Utilities Chief — 31 years)**
- Expertise: Boiler operations, steam system optimization, water treatment chemistry  
- Knowledge captured: 23% 🔴 — CRITICAL GAP
- No retirement plan initiated
- **Action:** Immediate knowledge capture program required — contact HR

**AI Insight:** Based on similar plant case studies, undocumented knowledge from these 3 individuals represents an estimated **2,400 hours of operational expertise** that cannot be recovered once lost.`,
    sources: [
      { doc: 'HR Workforce Planning Report 2024', docId: 'HR-WFP-2024', page: 7, confidence: 88 },
      { doc: 'Knowledge Capture Program Status — Q2 2024', docId: 'KM-STATUS-Q2-24', page: 3, confidence: 92 },
      { doc: 'NASSCOM-EY Industrial Knowledge Study 2023', docId: 'NASSCOM-EY-2023', page: 18, confidence: 76 },
    ],
    confidence: 89,
    entities: ['Anil Verma', 'Mohan Pillai', 'Krishnaswamy Rao', 'Process Unit 1', 'Tank Farm B'],
    relatedQuestions: [
      'What procedures has Anil Verma authored?',
      'Show me the knowledge capture schedule for Q3 2024',
      'What are the most critical undocumented procedures?',
    ],
  },
  // Default fallback response
  {
    id: 'q-default',
    triggers: [],
    question: 'General query',
    answer: `I've searched the **NEXUS IQ knowledge base** across 1,247 documents including P&IDs, work orders, inspection reports, SOPs, and regulatory documents.

I found **several potentially relevant documents**, but could not identify a precise match for your query. Here's what I recommend:

**Related Resources Found:**
- Engineering drawings and P&IDs (47 documents)
- Maintenance work order history (312 records)
- Safety procedures and SOPs (89 documents)
- Inspection reports 2019-2024 (156 records)

**To get a more precise answer, try:**
- Including equipment tag numbers (e.g., "P-101", "C-301", "V-401")
- Specifying the document type ("SOP", "inspection report", "work order")
- Mentioning the regulatory standard ("OISD-118", "API 510", "Factory Act")

**Example queries I can answer with high confidence:**
- "What is the vibration limit for C-301?"
- "Show me the hot work SOP for Tank Farm A"
- "What are the compliance gaps for OISD-118?"`,
    sources: [
      { doc: 'NEXUS IQ Document Repository Index', docId: 'REPO-INDEX-2024', page: 1, confidence: 60 },
    ],
    confidence: 55,
    entities: [],
    relatedQuestions: [
      'What is the maintenance history of Pump P-101?',
      'What are the vibration limits for Compressor C-301?',
      'What compliance gaps exist for OISD-118?',
    ],
  },
]

export const STARTER_QUESTIONS = [
  'What is the maintenance history of Pump P-101?',
  'What are the vibration limits for Compressor C-301?',
  'What safety procedures apply to hot work in Tank Farm A?',
  'Which equipment is at highest risk of failure in the next 30 days?',
  'What are our current OISD-118 compliance gaps?',
  'What is the root cause analysis for P-104 seal failure?',
  'Are there any recurring failure patterns in pump operations?',
  'What institutional knowledge is at risk with retiring engineers?',
]
