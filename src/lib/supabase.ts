import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Vehicle = {
  id: string
  name: string
  type: 'bus' | 'van' | 'minibus'
  plate_number: string
  capacity: number
  model?: string
  year?: number
  has_ac: boolean
  has_wifi: boolean
  has_luggage_space: boolean
  comfort_level: 'standard' | 'business' | 'vip'
  status: 'available' | 'busy' | 'maintenance' | 'out_of_service'
  image_url?: string
  notes?: string
  last_maintenance_date?: string
  next_maintenance_date?: string
  created_at: string
}

export type Driver = {
  id: string
  full_name: string
  phone: string
  email?: string
  license_number: string
  license_expiry: string
  status: 'available' | 'on_trip' | 'off_duty' | 'inactive'
  rating: number
  total_trips: number
  notes?: string
  created_at: string
}

export type Client = {
  id: string
  name: string
  type: 'individual' | 'corporate' | 'school'
  phone: string
  email?: string
  address?: string
  company_name?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

export type Booking = {
  id: string
  booking_number: string
  client_name: string
  client_phone: string
  client_email?: string
  trip_type: 'tourist' | 'corporate' | 'school' | 'private'
  contract_type: 'one_time' | 'monthly' | 'yearly' | 'recurring'
  status: 'new' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  pickup_location: string
  destination: string
  trip_date: string
  trip_time: string
  return_trip: boolean
  passengers: number
  vehicle_preference?: string
  price?: number
  notes?: string
  created_at: string
}

export type Contract = {
  id: string
  contract_number: string
  client_id?: string
  type: 'corporate' | 'school' | 'tourist'
  status: 'new' | 'negotiating' | 'active' | 'expired' | 'cancelled'
  start_date?: string
  end_date?: string
  monthly_amount?: number
  total_amount?: number
  billing_cycle: 'one_time' | 'monthly' | 'yearly'
  notes?: string
  created_at: string
}

export type TourPackage = {
  id: string
  name: string
  name_ar: string
  description?: string
  description_ar?: string
  destination: string
  duration_days: number
  price_per_person?: number
  min_passengers: number
  max_passengers: number
  is_active: boolean
  created_at: string
}

export type Invoice = {
  id: string
  invoice_number: string
  client_id?: string
  amount: number
  tax_amount: number
  total_amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date?: string
  paid_date?: string
  created_at: string
}
