import { getToken } from './auth'

const API_BASE = 'http://localhost:8000/api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: number
  name: string
  color: string
}

export interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  organizer: string
  banner: string | null
  banner_url: string | null
  category: number | null
  category_detail: Category | null
  status: 'upcoming' | 'ongoing' | 'done'
  is_featured: boolean
  max_participants: number | null
  created_at: string
}

export interface Stats {
  total: number
  upcoming: number
  ongoing: number
  done: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  const token = getToken()
  return token ? { Authorization: `Token ${token}` } : {}
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      msg = body?.error || body?.detail || JSON.stringify(body)
    } catch {}
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json()
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handleResponse<{ token: string; user: { id: number; email: string; username: string } }>(res)
}

export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  return handleResponse<void>(res)
}

// ─── Public ───────────────────────────────────────────────────────────────────

export async function getEvents(params?: {
  category?: string | number
  status?: string
  search?: string
}): Promise<Event[]> {
  const q = new URLSearchParams()
  if (params?.category) q.append('category', String(params.category))
  if (params?.status) q.append('status', params.status)
  if (params?.search) q.append('search', params.search)
  const res = await fetch(`${API_BASE}/events/?${q}`)
  return handleResponse<Event[]>(res)
}

export async function getEvent(id: number): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/${id}/`)
  return handleResponse<Event>(res)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/events/featured/`)
  return handleResponse<Event[]>(res)
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories/`)
  return handleResponse<Category[]>(res)
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function adminGetStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/admin/stats/`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Stats>(res)
}

export async function adminGetEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE}/admin/events/`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Event[]>(res)
}

export async function adminGetEvent(id: number): Promise<Event> {
  const res = await fetch(`${API_BASE}/admin/events/${id}/`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Event>(res)
}

export async function adminCreateEvent(data: FormData): Promise<Event> {
  const res = await fetch(`${API_BASE}/admin/events/`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: data,
  })
  return handleResponse<Event>(res)
}

export async function adminUpdateEvent(id: number, data: FormData): Promise<Event> {
  const res = await fetch(`${API_BASE}/admin/events/${id}/`, {
    method: 'PUT',
    headers: { ...authHeaders() },
    body: data,
  })
  return handleResponse<Event>(res)
}

export async function adminDeleteEvent(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/events/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse<void>(res)
}

export async function adminGetCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/admin/categories/`, {
    headers: { ...authHeaders() },
  })
  return handleResponse<Category[]>(res)
}

export async function adminCreateCategory(data: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE}/admin/categories/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Category>(res)
}

export async function adminUpdateCategory(id: number, data: Partial<Category>): Promise<Category> {
  const res = await fetch(`${API_BASE}/admin/categories/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  return handleResponse<Category>(res)
}

export async function adminDeleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/categories/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  return handleResponse<void>(res)
}
