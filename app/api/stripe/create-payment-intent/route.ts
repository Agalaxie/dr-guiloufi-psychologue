import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { stripe, CONSULTATION_PRICES } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { appointmentId, consultationType } = await request.json()

    if (!appointmentId || !consultationType) {
      return NextResponse.json(
        { error: 'Données manquantes' }, 
        { status: 400 }
      )
    }

    // Vérifier que Supabase est configuré
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Base de données non configurée' }, 
        { status: 503 }
      )
    }

    // Vérifier que l'appointment existe et appartient à l'utilisateur
    const { data: appointment, error: appointmentError } = await supabaseAdmin
      .from('appointments')
      .select(`
        id, 
        patient_id, 
        type, 
        status,
        price,
        users!appointments_patient_id_fkey(email)
      `)
      .eq('id', appointmentId)
      .single()

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous introuvable' }, 
        { status: 404 }
      )
    }

    // Vérifier que l'appointment appartient à l'utilisateur connecté
    if ((appointment.users as any)?.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Accès non autorisé' }, 
        { status: 403 }
      )
    }

    // Vérifier que c'est une consultation en ligne
    if (appointment.type !== 'online') {
      return NextResponse.json(
        { error: 'Paiement uniquement requis pour les consultations en ligne' }, 
        { status: 400 }
      )
    }

    // Vérifier qu'il n'y a pas déjà un paiement
    if (appointment.status === 'confirmed') {
      return NextResponse.json(
        { error: 'Ce rendez-vous est déjà confirmé' }, 
        { status: 400 }
      )
    }

    const amount = Math.round(CONSULTATION_PRICES[consultationType as keyof typeof CONSULTATION_PRICES] * 100) // Convertir en centimes

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        appointmentId,
        patientEmail: session.user.email,
        consultationType,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Sauvegarder le payment intent ID dans l'appointment
    await supabaseAdmin
      .from('appointments')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)

    // Créer l'enregistrement de paiement
    await supabaseAdmin
      .from('payments')
      .insert([{
        appointment_id: appointmentId,
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount / 100, // Reconvertir en euros
        currency: 'EUR',
        status: 'pending',
        payment_method: 'card',
      }])

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })

  } catch (error) {
    console.error('Erreur création payment intent:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' }, 
      { status: 500 }
    )
  }
}