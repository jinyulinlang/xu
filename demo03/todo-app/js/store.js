const STORAGE_KEY = 'TODO_APP_v1'

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.warn('Failed to load TODOs from storage', e)
    return []
  }
}

export function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch (e) {
    console.warn('Failed to save TODOs to storage', e)
    return false
  }
}

export function clear() {
  try { localStorage.removeItem(STORAGE_KEY) } catch (e) { }
}
