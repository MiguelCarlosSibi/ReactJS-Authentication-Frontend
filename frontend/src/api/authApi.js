// Base URL of the Spring Boot backend (Activity01Application, running on port 8080).
// Adjust this if your backend runs on a different host/port.
const BASE_URL = 'http://localhost:8080/api'

/**
 * Shared request helper. Throws an Error with a readable message when the
 * backend responds with a non-2xx status, so callers can catch() a single
 * error type and show it to the user.
 */
async function request(path, options) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (networkError) {
    throw new Error(
      'Could not reach the server. Confirm the Spring Boot app is running on http://localhost:8080.',
    )
  }

  // The backend replies with JSON on success, and either JSON or a plain
  // string on error, so we read as text first and try to parse it.
  const raw = await response.text()
  let data = null
  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = raw
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

/**
 * POST /api/register
 * body: { username, email, password }
 */
export function registerUser({ username, email, password }) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

/**
 * POST /api/login
 * body: { username, password }
 */
export function loginUser({ username, password }) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

/**
 * GET /api/user/{id}
 */
export function getUserById(id) {
  return request(`/user/${id}`, { method: 'GET' })
}
