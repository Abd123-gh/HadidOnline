const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'

type ApiEnvelope<T> = { success: boolean; data: T; message?: string; errors?: Record<string, string[]> }
type PagedResult<T> = { items: T[]; pageNumber: number; pageSize: number; totalCount: number; totalPages: number }

const endpointMap: Record<string, string> = {
  vehicles: 'fleet/vehicles',
  drivers: 'drivers',
  clients: 'customers',
  customers: 'customers',
  bookings: 'bookings',
  contracts: 'contracts',
  invoices: 'invoices',
  trips: 'trips',
  routes: 'routes',
  tour_packages: 'tour-packages',
  notifications: 'notifications',
}

const toCamel = (value: string) => value === 'client_id' ? 'customerId' : value.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
const toSnake = (value: string) => value === 'customerId' ? 'client_id' : value.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)

function keysToCamel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(keysToCamel)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [toCamel(k), keysToCamel(v)]))
  }
  return value
}

function keysToSnake(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(keysToSnake)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [toSnake(k), keysToSnake(v)]))
  }
  return value
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('hadid_access_token')
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (response.status === 204) return undefined as T
  const envelope = (await response.json()) as ApiEnvelope<T>
  if (!response.ok || envelope.success === false) throw new Error(envelope.message ?? 'API request failed')
  return envelope.data
}

export const apiClient = {
  getPaged: async <T>(resource: string, params = '') => request<PagedResult<T>>(`${endpointMap[resource] ?? resource}${params}`),
  create: async <T>(resource: string, data: unknown) => keysToSnake(await request<T>(endpointMap[resource] ?? resource, { method: 'POST', body: JSON.stringify(keysToCamel(data)) })) as T,
  update: async <T>(resource: string, id: string, data: unknown) => keysToSnake(await request<T>(`${endpointMap[resource] ?? resource}/${id}`, { method: 'PUT', body: JSON.stringify(keysToCamel(data)) })) as T,
  updateStatus: async <T>(resource: string, id: string, status: string) => keysToSnake(await request<T>(`${endpointMap[resource] ?? resource}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })) as T,
  delete: async (resource: string, id: string) => request<void>(`${endpointMap[resource] ?? resource}/${id}`, { method: 'DELETE' }),
  dashboardStats: () => request<{ bookings: number; contracts: number; vehicles: number; customers: number; availableVehicles: number; busyVehicles: number; revenue: number }>('dashboard/stats'),
  reportSummary: () => request<{ bookings: number; vehicles: number; customers: number; contracts: number; revenue: number }>('reports/summary'),
  login: async (email: string, password: string) => {
    const auth = await request<{ accessToken: string; refreshToken: string; email: string; fullName: string; role: string; permissions: string[] }>('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    localStorage.setItem('hadid_access_token', auth.accessToken)
    localStorage.setItem('hadid_refresh_token', auth.refreshToken)
    return auth
  },
}

type QueryResult<T> = { data: T[] | null; error: Error | null; count?: number | null }

class QueryBuilder<T = any> implements PromiseLike<QueryResult<T>> {
  private orderField?: string
  private ascending = true
  private filters: Record<string, unknown> = {}
  private resource: string
  private countOnly: boolean
  constructor(resource: string, countOnly = false) { this.resource = resource; this.countOnly = countOnly }
  select(_columns = '*', options?: { count?: 'exact'; head?: boolean }) { return new QueryBuilder<T>(this.resource, options?.head === true) }
  order(field: string, options?: { ascending?: boolean }) { this.orderField = field; this.ascending = options?.ascending ?? true; return this }
  eq(field: string, value: unknown) { this.filters[field] = value; return this }
  async insert(payload: unknown) { try { const data = await apiClient.create<T>(this.resource, payload); return { data: [data], error: null } } catch (error) { return { data: null, error: error as Error } } }
  update(payload: Record<string, unknown>) { return new MutationBuilder<T>(this.resource, payload) }
  delete() { return new DeleteBuilder(this.resource) }
  async then<TResult1 = QueryResult<T>, TResult2 = never>(onfulfilled?: ((value: QueryResult<T>) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null) {
    try {
      const qs = this.resource === 'tour_packages' ? '?activeOnly=true&pageSize=100' : '?pageSize=100'
      const page = await apiClient.getPaged<T>(this.resource, qs)
      let items = (keysToSnake(page.items) as T[])
      for (const [field, value] of Object.entries(this.filters)) items = items.filter(item => (item as Record<string, unknown>)[field] === value)
      if (this.orderField) items = [...items].sort((a, b) => String((a as Record<string, unknown>)[this.orderField!] ?? '').localeCompare(String((b as Record<string, unknown>)[this.orderField!] ?? '')) * (this.ascending ? 1 : -1))
      const result = this.countOnly ? { data: null, error: null, count: page.totalCount } : { data: items, error: null, count: page.totalCount }
      return onfulfilled ? onfulfilled(result) : result as TResult1
    } catch (error) { return onrejected ? onrejected(error) : { data: null, error: error as Error } as TResult1 }
  }
}

class MutationBuilder<T> implements PromiseLike<{ data: T | null; error: Error | null }> {
  private resource: string
  private payload: Record<string, unknown>
  constructor(resource: string, payload: Record<string, unknown>) { this.resource = resource; this.payload = payload }
  async eq(_field: string, id: string) { try { const data = 'status' in this.payload && Object.keys(this.payload).length <= 3 ? await apiClient.updateStatus<T>(this.resource, id, String(this.payload.status)) : await apiClient.update<T>(this.resource, id, this.payload); return { data, error: null } } catch (error) { return { data: null, error: error as Error } } }
  then<TResult1 = { data: T | null; error: Error | null }, TResult2 = never>(onfulfilled?: ((value: { data: T | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null) { return Promise.resolve({ data: null, error: new Error('Missing eq(id) for update') }).then(onfulfilled, onrejected) }
}

class DeleteBuilder implements PromiseLike<{ error: Error | null }> {
  private resource: string
  constructor(resource: string) { this.resource = resource }
  async eq(_field: string, id: string) { try { await apiClient.delete(this.resource, id); return { error: null } } catch (error) { return { error: error as Error } } }
  then<TResult1 = { error: Error | null }, TResult2 = never>(onfulfilled?: ((value: { error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null) { return Promise.resolve({ error: new Error('Missing eq(id) for delete') }).then(onfulfilled, onrejected) }
}

export const hadidApi = {
  from: <T = any>(resource: string) => new QueryBuilder<T>(resource),
}

export const apiDb = hadidApi

export type Vehicle = {
  id: string; name: string; type: 'bus' | 'van' | 'minibus'; plate_number: string; capacity: number; model?: string; year?: number; has_ac: boolean; has_wifi: boolean; has_luggage_space: boolean; comfort_level: 'standard' | 'business' | 'vip'; status: 'available' | 'busy' | 'maintenance' | 'out_of_service'; image_url?: string; notes?: string; last_maintenance_date?: string; next_maintenance_date?: string; created_at: string
}
export type Driver = { id: string; full_name: string; phone: string; email?: string; license_number: string; license_expiry: string; status: 'available' | 'on_trip' | 'off_duty' | 'inactive'; rating: number; total_trips: number; notes?: string; created_at: string }
export type Client = { id: string; name: string; type: 'individual' | 'corporate' | 'school'; phone: string; email?: string; address?: string; company_name?: string; status: 'active' | 'inactive' | 'suspended'; created_at: string }
export type Booking = { id: string; booking_number: string; client_name: string; client_phone: string; client_email?: string; trip_type: 'tourist' | 'corporate' | 'school' | 'private'; contract_type: 'one_time' | 'monthly' | 'yearly' | 'recurring'; status: 'new' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'; pickup_location: string; destination: string; trip_date: string; trip_time: string; return_trip: boolean; passengers: number; vehicle_preference?: string; price?: number; notes?: string; created_at: string }
export type Contract = { id: string; contract_number: string; client_id?: string; type: 'corporate' | 'school' | 'tourist'; status: 'new' | 'negotiating' | 'active' | 'expired' | 'cancelled'; start_date?: string; end_date?: string; monthly_amount?: number; total_amount?: number; billing_cycle: 'one_time' | 'monthly' | 'yearly'; notes?: string; created_at: string }
export type TourPackage = { id: string; name: string; name_ar: string; description?: string; description_ar?: string; destination: string; duration_days: number; price_per_person?: number; min_passengers: number; max_passengers: number; is_active: boolean; created_at: string }
export type Invoice = { id: string; invoice_number: string; client_id?: string; amount: number; tax_amount: number; total_amount: number; status: 'pending' | 'paid' | 'overdue' | 'cancelled'; due_date?: string; paid_date?: string; created_at: string }
