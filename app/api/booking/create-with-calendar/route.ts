import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { isTimeSlotAvailable } from '@/lib/google-calendar';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentData } = body;

    if (!appointmentData) {
      return NextResponse.json(
        { error: 'Données de rendez-vous manquantes' },
        { status: 400 }
      );
    }

    const { date, time, clientInfo } = appointmentData;
    
    // Vérifier la disponibilité en temps réel avant de créer le paiement
    const available = await isTimeSlotAvailable(date, time);
    
    if (!available) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est plus disponible. Veuillez choisir un autre horaire.' },
        { status: 409 } // Conflict
      );
    }

    const { firstName, lastName, email, phone, reason, message } = clientInfo;

    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Consultation Psychologique',
              description: `Rendez-vous du ${new Date(date).toLocaleDateString('fr-FR')} à ${time}`,
              images: ['https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400'],
            },
            unit_amount: 6000, // 60€ en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
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
        type: 'appointment_booking'
      },
    });

    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Erreur création checkout:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}