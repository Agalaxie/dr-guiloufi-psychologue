import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSuccess(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailure(paymentIntent)
        break
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentCanceled(paymentIntent)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const appointmentId = paymentIntent.metadata.appointmentId

  if (!appointmentId) {
    console.error('No appointmentId in payment intent metadata')
    return
  }

  try {
    // Mettre à jour le statut du paiement
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    // Confirmer le rendez-vous
    await supabaseAdmin
      .from('appointments')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)

    // TODO: Envoyer email de confirmation
    // TODO: Générer lien de vidéoconférence pour consultation en ligne

    console.log(`Paiement confirmé pour appointment ${appointmentId}`)

  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement:', error)
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const appointmentId = paymentIntent.metadata.appointmentId

  if (!appointmentId) {
    console.error('No appointmentId in payment intent metadata')
    return
  }

  try {
    // Mettre à jour le statut du paiement
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'failed',
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    // Marquer le rendez-vous comme échoué
    await supabaseAdmin
      .from('appointments')
      .update({
        status: 'cancelled',
        notes: 'Paiement échoué',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)

    console.log(`Paiement échoué pour appointment ${appointmentId}`)

  } catch (error) {
    console.error('Erreur lors de la gestion de l\'échec de paiement:', error)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const appointmentId = paymentIntent.metadata.appointmentId

  if (!appointmentId) {
    console.error('No appointmentId in payment intent metadata')
    return
  }

  try {
    // Mettre à jour le statut du paiement
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'refunded',
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    // Annuler le rendez-vous
    await supabaseAdmin
      .from('appointments')
      .update({
        status: 'cancelled',
        notes: 'Paiement annulé',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)

    console.log(`Paiement annulé pour appointment ${appointmentId}`)

  } catch (error) {
    console.error('Erreur lors de la gestion de l\'annulation de paiement:', error)
  }
}