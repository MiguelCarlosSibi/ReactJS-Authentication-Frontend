const SESSION_KEY = 'activity01_session_user'

/**
 * Strips the password field before persisting anything about the user, and
 * uses sessionStorage (cleared when the tab closes) rather than a durable
 * store, so no credential material sticks around.
 */
export function saveSession(user) {
  const { password, ...safeUser } = user || {}
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser))
}

export function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}
