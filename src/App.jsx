import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Layout/Sidebar'
import TopBar from './components/Layout/TopBar'
import Dashboard from './pages/Dashboard'
import DocumentIngestion from './pages/DocumentIngestion'
import KnowledgeGraph from './pages/KnowledgeGraph'
import Copilot from './pages/Copilot'
import MaintenanceRCA from './pages/MaintenanceRCA'
import ComplianceIntelligence from './pages/ComplianceIntelligence'
import LessonsLearned from './pages/LessonsLearned'
import { AuthProvider } from './context/AuthContext'
import { useState } from 'react'
import './index.css'

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <AuthProvider>
      <BrowserRouter>
      <div className="app-layout">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
        <div className={`main-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
          <TopBar sidebarCollapsed={sidebarCollapsed} />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ingestion" element={<DocumentIngestion />} />
              <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/maintenance" element={<MaintenanceRCA />} />
              <Route path="/compliance" element={<ComplianceIntelligence />} />
              <Route path="/lessons" element={<LessonsLearned />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  </AuthProvider>
  )
}
