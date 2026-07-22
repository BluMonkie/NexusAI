const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('nexusiq_token')

  const headers = {
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    if (response.status === 401 || (data.error && (data.error.includes('Access denied') || data.error.includes('token')))) {
      window.dispatchEvent(new CustomEvent('nexusiq_unauthorized'))
    }
    throw new Error(data.error || `API request failed with status ${response.status}`)
  }

  return data
}
