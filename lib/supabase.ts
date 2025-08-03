import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  patient_id: string
  type: string
  status: string
  reason: string
  notes?: string
}

// Vérifier si un créneau est disponible
export async function isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('appointment_bookings')
    .select('id')
    .eq('date', date)
    .eq('time', time)
    .eq('status', 'confirmed')

  if (error) {
    console.error('Erreur vérification disponibilité:', error)
    return false // En cas d'erreur, considérer comme non disponible
  }

  return data.length === 0
}

// Créer une réservation pending
export async function createPendingAppointment(appointmentData: {
  date: string
  time: string
  client_name: string
  client_email: string
  client_phone: string
  reason: string
  message?: string
  consultation_type?: string
  stripe_session_id: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  // Vérifier encore une fois la disponibilité
  const available = await isTimeSlotAvailable(appointmentData.date, appointmentData.time)
  if (!available) {
    return {
      success: false,
      error: 'Ce créneau vient d\'être réservé par quelqu\'un d\'autre'
    }
  }

  const { data, error } = await supabase
    .from('appointment_bookings')
    .insert([{
      ...appointmentData,
      consultation_type: appointmentData.consultation_type || 'cabinet',
      status: 'pending'
    }])
    .select('id')
    .single()

  if (error) {
    console.error('Erreur création réservation:', error)
    return {
      success: false,
      error: 'Erreur lors de la création de la réservation'
    }
  }

  return {
    success: true,
    id: data.id
  }
}

// Confirmer une réservation après paiement
export async function confirmAppointment(stripeSessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('appointment_bookings')
    .update({ 
      status: 'confirmed',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_session_id', stripeSessionId)

  if (error) {
    console.error('Erreur confirmation réservation:', error)
    return false
  }

  return true
}

// Récupérer les créneaux occupés pour une date
export async function getBusySlots(date: string): Promise<string[]> {
  // 1. Récupérer les créneaux avec réservations confirmées
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointment_bookings')
    .select('time')
    .eq('date', date)
    .eq('status', 'confirmed')

  if (appointmentsError) {
    console.error('Erreur récupération créneaux occupés:', appointmentsError)
  }

  // 2. Récupérer les créneaux bloqués par l'admin
  const { data: blockedSlots, error: blockedError } = await supabase
    .from('blocked_slots')
    .select('time')
    .eq('date', date)

  if (blockedError) {
    console.error('Erreur récupération créneaux bloqués:', blockedError)
  }

  // 3. Combiner les deux types de créneaux occupés
  const busyTimes: string[] = []
  
  if (appointments) {
    busyTimes.push(...appointments.map(appointment => {
      const time = appointment.time;
      return time.includes(':') ? time.substring(0, 5) : time;
    }))
  }

  if (blockedSlots) {
    busyTimes.push(...blockedSlots.map(slot => {
      const time = slot.time;
      return time.includes(':') ? time.substring(0, 5) : time;
    }))
  }

  // Supprimer les doublons
  return Array.from(new Set(busyTimes))
}

// Récupérer toutes les réservations (pour le dashboard admin)
export async function getAllAppointments(): Promise<any[]> {
  const { data, error } = await supabase
    .from('appointment_bookings')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Erreur récupération réservations:', error)
    return []
  }

  return data
}

// Fonctions pour gérer les créneaux bloqués
export async function blockTimeSlot(date: string, time: string, reason?: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('blocked_slots')
    .insert([{
      date,
      time,
      reason: reason || 'Indisponible'
    }])

  if (error) {
    console.error('Erreur blocage créneau:', error)
    return { success: false, error: 'Erreur lors du blocage du créneau' }
  }

  return { success: true }
}

export async function unblockTimeSlot(date: string, time: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('blocked_slots')
    .delete()
    .eq('date', date)
    .eq('time', time)

  if (error) {
    console.error('Erreur déblocage créneau:', error)
    return { success: false, error: 'Erreur lors du déblocage du créneau' }
  }

  return { success: true }
}

export async function getBlockedSlots(date: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('blocked_slots')
    .select('*')
    .eq('date', date)

  if (error) {
    console.error('Erreur récupération créneaux bloqués:', error)
    return []
  }

  return data || []
}