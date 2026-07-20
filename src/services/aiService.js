// ============================================================
// AI Service Abstraction Layer
// Supports both simulated responses and live API (OpenAI / Gemini)
// Configure via Settings page or .env
// ============================================================

export const AI_CONFIG = {
  mode: 'simulated', // 'simulated' | 'openai' | 'gemini'
  openaiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: import.meta.env.VITE_AI_MODEL || 'gpt-4o',
}

// Override config at runtime (used by Settings page)
export function setAIConfig(updates) {
  Object.assign(AI_CONFIG, updates)
  try { localStorage.setItem('nexusiq_ai_config', JSON.stringify(AI_CONFIG)) } catch {}
}

// Load saved config on startup
try {
  const saved = localStorage.getItem('nexusiq_ai_config')
  if (saved) Object.assign(AI_CONFIG, JSON.parse(saved))
} catch {}

// ── Simulated RAG responses ──────────────────────────────────
import { COPILOT_RESPONSES } from '../data/copilotResponses'

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
      temperature: 0.3,
      max_tokens: 800,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error')
  return data.choices[0].message.content
}

// ── Gemini call ──────────────────────────────────────────────
async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AI_CONFIG.geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      }),
    }
  )
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || 'Gemini API error')
  return data.candidates[0].content.parts[0].text
}

// ── Main query function ──────────────────────────────────────
export async function queryAI(userMessage, conversationHistory = []) {
  const delay = ms => new Promise(r => setTimeout(r, ms))

  if (AI_CONFIG.mode === 'simulated') {
    // Simulate network latency
    await delay(1200 + Math.random() * 800)
    const resp = findSimulatedResponse(userMessage)
    return {
      answer: resp.answer,
      sources: resp.sources,
      confidence: resp.confidence,
      relatedQuestions: resp.relatedQuestions,
      entities: resp.entities || [],
    }
  }

  const systemPrompt = `You are NEXUS IQ, an AI assistant for industrial knowledge management at a large Indian refinery/petrochemical plant. 
You have access to engineering drawings, maintenance work orders, safety procedures, inspection reports, and regulatory documents.
Answer questions with technical precision. Cite document sources. Give confidence scores (0-100%) for your answers.
Format: Answer clearly, then list "Sources:" as bullet points with document names and confidence %.`

  try {
    let rawAnswer = ''

    if (AI_CONFIG.mode === 'openai') {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6),
        { role: 'user', content: userMessage },
      ]
      rawAnswer = await callOpenAI(messages)
    } else if (AI_CONFIG.mode === 'gemini') {
      const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}\nAssistant:`
      rawAnswer = await callGemini(fullPrompt)
    }

    return {
      answer: rawAnswer,
      sources: [{ doc: 'Live AI Response', confidence: 90, page: 'N/A' }],
      confidence: 90,
      relatedQuestions: [],
      entities: [],
    }
  } catch (err) {
    console.warn('AI API failed, falling back to simulation:', err.message)
    await delay(500)
    const resp = findSimulatedResponse(userMessage)
    return { ...resp, _fallback: true }
  }
}
