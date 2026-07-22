// ============================================================
// AI Service Abstraction Layer
// Supports both simulated responses and live API (OpenAI / Gemini)
// Configure via Settings page or .env
// ============================================================

export const AI_CONFIG = {
  mode: import.meta.env.VITE_AI_MODE || 'simulated',
  openaiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4o',
}

// ── Data for RAG Context ─────────────────────────────────────
import { COPILOT_RESPONSES } from '../data/copilotResponses'
import { GRAPH_NODES } from '../data/knowledgeGraphData'
import { WORK_ORDERS, EQUIPMENT_HEALTH } from '../data/maintenanceData'
import { INCIDENTS } from '../data/lessonsLearnedData'
import { COMPLIANCE_GAPS } from '../data/complianceData'

function getPlantContext() {
  const eq = EQUIPMENT_HEALTH.map(e => `- [${e.tag}] ${e.name} (Health: ${e.health}%, Status: ${e.status})`).join('\n')
  const wos = WORK_ORDERS.map(w => `- WO #${w.id} on ${w.equipment}: ${w.title} (${w.status}) - ${w.desc}`).join('\n')
  const inc = INCIDENTS.map(i => `- [${i.date}] on ${i.equipment}: ${i.title} (Severity: ${i.severity})`).join('\n')
  const gaps = COMPLIANCE_GAPS.map(g => `- [${g.standard}] ${g.title}: ${g.desc} (Severity: ${g.severity})`).join('\n')
  
  return `
PLANT CONTEXT DATABASE:

1. EQUIPMENT STATUS:
${eq}

2. RECENT WORK ORDERS:
${wos}

3. INCIDENTS & FAILURES:
${inc}

4. COMPLIANCE GAPS:
${gaps}
`.trim()
}

function findSimulatedResponse(query) {
  const q = query.toLowerCase()
  for (const resp of COPILOT_RESPONSES) {
    if (resp.triggers.some(t => q.includes(t.toLowerCase()))) return resp
  }
  return COPILOT_RESPONSES[COPILOT_RESPONSES.length - 1] // default
}

// ── OpenAI call ──────────────────────────────────────────────
async function callOpenAI(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.openaiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages,
      temperature: 0.2,
      max_tokens: 1024,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error')
  return data.choices[0].message.content
}

// ── Gemini call ──────────────────────────────────────────────
async function callGemini(systemPrompt, conversationHistory, userMessage) {
  const contents = conversationHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }))
  
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  })

  // Determine which model string to use for Gemini based on AI_CONFIG.model. 
  // If the user selected something else, fallback to a valid gemini model.
  const geminiModel = AI_CONFIG.model.includes('gemini') ? AI_CONFIG.model : 'gemini-2.0-flash'

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${AI_CONFIG.geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    }
  )
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Gemini API error')
  return data.candidates[0].content.parts[0].text
}

import { apiFetch } from './apiClient'

// ── Main query function ──────────────────────────────────────
export async function queryAI(userMessage, conversationHistory = []) {
  try {
    const response = await apiFetch('/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory.slice(-6),
      }),
    })

    return {
      answer: response.answer,
      sources: response.sources || [{ doc: 'Live RAG Backend', confidence: 95 }],
      confidence: response.confidence || 95,
      relatedQuestions: [],
      entities: [],
    }
  } catch (err) {
    console.error('Backend RAG API Error:', err)
    const isAuthError = err.message.includes('token') || err.message.includes('Access denied') || err.message.includes('401')
    return {
      answer: isAuthError
        ? 'Authentication Required: Access denied. No valid authentication token provided. Please sign in to query AI Copilot.'
        : `Backend RAG API Error: ${err.message}. Please check server connection.`,
      sources: [],
      confidence: 0,
      relatedQuestions: [],
      entities: [],
      requiresAuth: isAuthError,
    }
  }
}

