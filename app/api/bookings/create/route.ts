import { NextRequest, NextResponse } from 'next/server';
import { createPendingAppointment } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const {
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      reason,
      message,
      consultationType
    } = await request.json();

    // Validation
    if (!date || !time || !firstName || !lastName || !email || !phone || !reason) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // 1. Créer session Stripe AVANT la réservation
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Consultation psychologique',
              description: `Rendez-vous le ${date} à ${time} - ${consultationType === 'cabinet' ? 'Au cabinet' : 'En visioconférence'}`,
            },
            unit_amount: 6000, // 60€ en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/booking?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/booking`,
      customer_email: email,
      metadata: {
        appointment_date: date,
        appointment_time: time,
        client_name: `${firstName} ${lastName}`,
        client_email: email,
        client_phone: phone,
        reason: reason,
        message: message || '',
        consultation_type: consultationType || 'cabinet',
      },
    });

    // 2. Créer réservation pending avec session ID
    const appointmentResult = await createPendingAppointment({
      date,
      time,
      client_name: `${firstName} ${lastName}`,
      client_email: email,
      client_phone: phone,
      reason,
      message,
      consultation_type: consultationType || 'cabinet',
      stripe_session_id: stripeSession.id,
    });

    if (!appointmentResult.success) {
      // Si la réservation échoue, on retourne l'erreur
      return NextResponse.json(
        { error: appointmentResult.error },
        { status: 400 }
      );
    }

    // 3. Retourner l'URL de paiement Stripe
    return NextResponse.json({
      success: true,
      checkout_url: stripeSession.url,
      appointment_id: appointmentResult.id,
    });

  } catch (error) {
    console.error('Erreur création réservation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    );
  }
}