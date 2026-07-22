import dotenv from 'dotenv'
dotenv.config()

const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY || ''

export async function generateEmbedding(text) {
  if (!GEMINI_KEY) return null

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          model: 'models/gemini-embedding-001',
          content: { parts: [{ text: text.slice(0, 2000) }] },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      console.warn('Embedding API call failed, falling back to TF-IDF:', data.error?.message)
      return null
    }

    return data.embedding.values
  } catch (err) {
    console.warn('Embedding network error:', err.message)
    return null
  }
}

export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

const STOPWORDS = new Set(['what','is','the','tell','me','about','how','do','does','did','a','an','for','of','in','on','at','to','from','by','with','and','or','but','not','can','this','that','these','those','which','where','when','who','why','are','was','were','has','have','had','be','been','being','get','got','all','any','some','more','also','just','very','its','it','they','them','their','we','you','your','my','he','she','his','her','give','please','show','find','explain','describe','list'])

export function keywordScore(text, query) {
  if (!text || !query) return 0
  const cleanQuery = query.replace(/[^\w\s-]/g, ' ').toLowerCase()
  const queryWords = cleanQuery.split(/\s+/).filter(w => w.length >= 2 && !STOPWORDS.has(w))
  if (queryWords.length === 0) return 0

  const textLower = text.toLowerCase()
  const textNormalized = textLower.replace(/[-_\s]/g, '')

  let score = 0
  for (const word of queryWords) {
    const wordNoHyphen = word.replace(/[-_\s]/g, '')
    const isTag = /\d/.test(wordNoHyphen)

    if (textLower.includes(word) || (wordNoHyphen.length >= 3 && textNormalized.includes(wordNoHyphen))) {
      // Very high tag boost for equipment/incident IDs (contain digits: H215, H-215, P215A, TRN-2025-062)
      if (isTag) {
        score += 10
      } else {
        score += 1
      }
    }
  }
  return score
}
