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
Answer questions with technical precision based ONLY on the provided context.
If the answer is not in the context, say "I don't have enough information to answer this based on the current plant data."
Give confidence scores (0-100%) for your answers based on the specificity of the match.
Format: Answer clearly, then list "Sources:" as bullet points with document names or data sections.

${getPlantContext()}`

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
      rawAnswer = await callGemini(systemPrompt, conversationHistory.slice(-6), userMessage)
    }

    return {
      answer: rawAnswer,
      sources: [{ doc: 'Live AI RAG Pipeline', confidence: 95, page: 'Context Injection' }],
      confidence: 95,
      relatedQuestions: [],
      entities: [],
    }
  } catch (err) {
    console.error('AI API Error:', err)
    return {
      answer: `API Connection Error: ${err.message}\n\nPlease check that your VITE_GEMINI_API_KEY in the .env file is correct. It should be an AI Studio key starting with "AIza".`,
      sources: [],
      confidence: 0,
      relatedQuestions: [],
      entities: [],
    }
  }
}

