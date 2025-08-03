import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { confirmAppointment } from '@/lib/supabase';
import { sendEmail } from '@/lib/email-config';
import { getClientConfirmationEmail, getDoctorNotificationEmail, AppointmentEmailData } from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Traiter l'événement de paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('🎉 Webhook reçu pour session:', session.id);

    try {
      // 1. Confirmer la réservation dans Supabase
      console.log('📝 Tentative de confirmation...');
      const confirmed = await confirmAppointment(session.id);
      
      if (!confirmed) {
        console.error('Erreur confirmation réservation dans Supabase');
        return NextResponse.json({ error: 'Erreur confirmation réservation' }, { status: 500 });
      }

      // 2. Récupérer les métadonnées de la réservation
      const metadata = session.metadata;
      if (!metadata) {
        console.log('Pas de métadonnées trouvées');
        return NextResponse.json({ received: true });
      }

      const appointmentData = {
        date: metadata.appointment_date,
        time: metadata.appointment_time,
        clientName: metadata.client_name,
        clientEmail: metadata.client_email,
        clientPhone: metadata.client_phone,
        reason: metadata.reason,
        message: metadata.message || '',
        consultationType: metadata.consultation_type || 'cabinet',
      };

      // 3. Préparer les données pour les templates d'email
      const emailData: AppointmentEmailData = {
        clientName: appointmentData.clientName,
        date: appointmentData.date,
        time: appointmentData.time,
        consultationType: appointmentData.consultationType as 'cabinet' | 'visio',
        reason: appointmentData.reason,
        message: appointmentData.message,
        clientEmail: appointmentData.clientEmail,
        clientPhone: appointmentData.clientPhone,
      };

      // 4. Envoyer l'email de confirmation au client
      const clientEmailResult = await sendEmail({
        to: appointmentData.clientEmail,
        subject: `✅ Rendez-vous confirmé - ${new Date(appointmentData.date).toLocaleDateString('fr-FR')} à ${appointmentData.time}`,
        html: getClientConfirmationEmail(emailData),
      });

      if (!clientEmailResult.success) {
        console.error('Erreur envoi email client:', clientEmailResult.error);
      }

      // 5. Envoyer l'email de notification au psychologue
      const doctorEmailResult = await sendEmail({
        to: process.env.PSYCHOLOGIST_EMAIL || 'stephdumaz@gmail.com',
        subject: `🆕 Nouveau RDV - ${appointmentData.clientName} le ${new Date(appointmentData.date).toLocaleDateString('fr-FR')}`,
        html: getDoctorNotificationEmail(emailData),
      });

      if (!doctorEmailResult.success) {
        console.error('Erreur envoi email docteur:', doctorEmailResult.error);
      }

      console.log('Réservation traitée avec succès:', {
        client: appointmentData.clientName,
        date: appointmentData.date,
        time: appointmentData.time,
        confirmed: true
      });

    } catch (error) {
      console.error('Erreur traitement réservation:', error);
      return NextResponse.json({ error: 'Erreur traitement réservation' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}