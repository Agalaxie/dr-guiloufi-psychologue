import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client avec clé service pour les opérations administratives
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Types TypeScript pour nos tables
export interface User {
  id: string
  email: string
  name?: string
  role: 'patient' | 'admin'
  avatar_url?: string
  phone?: string
  date_of_birth?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  type: 'physical' | 'online'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  reason?: string
  notes?: string
  price: number
  stripe_payment_intent_id?: string
  meeting_link?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  appointment_id: string
  stripe_payment_intent_id?: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string
  paid_at?: string
  created_at: string
}

export interface AvailableSlot {
  id: string
  date: string
  time: string
  is_available: boolean
  created_at: string
}