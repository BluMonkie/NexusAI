# NEXUS IQ — AI Industrial Knowledge Intelligence Platform

<div align="center">
  <img src="public/favicon.svg" width="80" alt="NEXUS IQ Logo" />
  <h3>Unified Asset & Operations Brain</h3>
  <p>AI-powered platform that transforms fragmented industrial documents into queryable, actionable knowledge</p>
  
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
  ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
  ![D3.js](https://img.shields.io/badge/D3.js-7-F9A03C?logo=d3.js)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## 🏭 Problem Statement

Industrial enterprises lose **35% of work hours** searching for information across 7–12 disconnected document systems. This fragmentation causes:
- **18–22%** of unplanned downtime events
- Safety and quality risks from incomplete equipment history
- A looming knowledge cliff as 25% of experienced engineers retire this decade

## 💡 Solution

NEXUS IQ is a **5-module AI-powered Industrial Knowledge Intelligence platform**:

| Module | What it does |
|---|---|
| 🗂️ **Universal Document Ingestion** | Processes PDFs, P&IDs, scanned forms, emails — extracts entities and builds knowledge graph |
| 🤖 **Expert Knowledge Copilot** | RAG-powered conversational AI with source citations and confidence scores |
| 🔧 **Maintenance Intelligence & RCA** | Predictive alerts, Fishbone root cause analysis, equipment health monitoring |
| ⚖️ **Compliance Intelligence** | Maps regulations (OISD, PESO, Factory Act) to gaps, generates audit packages |
| 📚 **Lessons Learned Engine** | Pattern recognition across incident history, proactive failure warnings |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173)

## 🔧 AI Engine Configuration

NEXUS IQ supports three modes, configurable from the **Settings** page:

| Mode | Description | Setup |
|---|---|---|
| **Simulated** (default) | Pre-computed realistic responses — perfect for demos | No config needed |
| **OpenAI** | Live responses via GPT-4o | Add `VITE_OPENAI_API_KEY` to `.env` |
| **Gemini** | Live responses via Google Gemini | Add `VITE_GEMINI_API_KEY` to `.env` |

Create a `.env` file in the root:
```env
VITE_OPENAI_API_KEY=sk-proj-...
VITE_GEMINI_API_KEY=AIza...
VITE_AI_MODEL=gpt-4o
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXUS IQ — Frontend (Vite + React)          │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Dashboard │  │ Document │  │Knowledge │  │   AI     │       │
│  │& KPIs    │  │Ingestion │  │  Graph   │  │ Copilot  │       │
│  └──────────┘  └──────────┘  │ (D3.js)  │  │ (RAG)    │       │
│                               └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │Maint.RCA │  │Compliance│  │ Lessons  │                      │
│  │& Fishbone│  │& Audits  │  │ Learned  │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
├─────────────────────────────────────────────────────────────────┤
│              AI Service Layer (src/services/aiService.js)        │
│   Simulated RAG ──┬── OpenAI GPT-4o ──┬── Google Gemini        │
│                   └───── Fallback ─────┘                        │
├─────────────────────────────────────────────────────────────────┤
│                    Knowledge Data Layer                          │
│  55 Graph Nodes · 75+ Edges · 15 Q&A pairs · 347 Incidents     │
│  Equipment ↔ Documents ↔ Procedures ↔ Regulations               │
│  Personnel ↔ Work Orders ↔ Incidents ↔ Inspections              │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── Sidebar.jsx       # Collapsible navigation
│       └── TopBar.jsx        # Search, notifications, AI status
├── data/
│   ├── knowledgeGraphData.js  # 55 nodes, 75+ relationship edges
│   ├── copilotResponses.js    # 15 expert Q&A pairs with citations
│   ├── maintenanceData.js     # Equipment health, WOs, RCA cases
│   ├── complianceData.js      # Regulations, gaps, audit calendar
│   ├── lessonsLearnedData.js  # Incidents, patterns, warnings
│   └── dashboardData.js       # KPIs, activity feed, trends
├── pages/
│   ├── Dashboard.jsx          # KPI cards, trend charts, activity
│   ├── DocumentIngestion.jsx  # Upload pipeline, entity extraction
│   ├── KnowledgeGraph.jsx     # D3.js force-directed graph
│   ├── Copilot.jsx            # RAG chat with source citations
│   ├── MaintenanceRCA.jsx     # Predictive alerts, fishbone RCA
│   ├── ComplianceIntelligence.jsx # Regulatory gap analysis
│   ├── LessonsLearned.jsx     # Pattern intelligence, warnings
│   └── Settings.jsx           # AI engine & API configuration
├── services/
│   └── aiService.js           # Simulated / OpenAI / Gemini abstraction
├── App.jsx                    # Router setup
├── main.jsx                   # React entry point
└── index.css                  # Design system & global styles
```

## 🎯 Judging Criteria Coverage

| Criteria | Weight | Our Approach |
|---|---|---|
| **Innovation** | 25% | Unified knowledge graph + multi-modal AI copilot + proactive failure intelligence |
| **Business Impact** | 25% | Directly addresses 35% time waste, 18–22% downtime, knowledge cliff |
| **Technical Excellence** | 20% | RAG pipeline, entity extraction, graph-based linking, D3 visualization |
| **Scalability** | 15% | Modular architecture, streaming ingestion design, federated graph model |
| **User Experience** | 15% | Premium dark theme, mobile-ready copilot, micro-animations, field-ready |

## 🌐 Tech Stack

- **Frontend**: React 19, Vite 6, React Router 7
- **Visualization**: D3.js v7 (Knowledge Graph), Recharts (dashboards)
- **UI**: Vanilla CSS design system, Lucide React icons, Framer Motion
- **AI**: Configurable — Simulated / OpenAI GPT-4o / Google Gemini
- **Fonts**: Inter (UI) + JetBrains Mono (data/code)

## 📊 Demo Data

The platform ships with realistic demo data from a simulated Indian refinery:
- **47 critical assets** monitored across 7 plant areas
- **1,247 documents** indexed (P&IDs, work orders, SOPs, inspection reports)
- **347 historical incidents** with pattern analysis
- **8 regulatory standards** mapped (OISD-118, PESO, Factory Act, API 510/670, etc.)
- **6 compliance gaps** identified with remediation guidance

---

*Built for the AI for Industrial Knowledge Intelligence Hackathon — 2024*
