const BASE_URL = 'https://you-dont-know.onrender.com'

export async function getMatches() {
  try {
    const res = await fetch(`${BASE_URL}/matches`)
    if (!res.ok) throw new Error('Failed to fetch matches')
    return await res.json()
  } catch (error) {
    console.error('Error fetching matches:', error)
    return []
  }
}

export async function getPredictions() {
  try {
    const res = await fetch(`${BASE_URL}/predictions`)
    if (!res.ok) throw new Error('Failed to fetch predictions')
    return await res.json()
  } catch (error) {
    console.error('Error fetching predictions:', error)
    return { daily: [], weekly: [] }
  }
}

export async function getDashboard() {
  try {
    const res = await fetch(`${BASE_URL}/dashboard`)
    if (!res.ok) throw new Error('Failed to fetch dashboard')
    return await res.json()
  } catch (error) {
    console.error('Error fetching dashboard:', error)
    return null
  }
}

export async function getStatus() {
  try {
    const res = await fetch(`${BASE_URL}/status`)
    if (!res.ok) throw new Error('Failed to fetch status')
    return await res.json()
  } catch (error) {
    console.error('Error fetching status:', error)
    return null
  }
}
