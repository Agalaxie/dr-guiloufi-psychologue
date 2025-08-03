import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Récupérer les détails du RDV depuis la base de données
    const { data, error } = await supabase
      .from('appointment_bookings')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .single();

    if (error) {
      console.error('Erreur récupération détails RDV:', error);
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Formater les données pour le frontend
    const appointmentDetails = {
      date: data.date,
      time: data.time,
      consultation_type: data.consultation_type || 'cabinet',
      client_name: data.client_name,
      client_email: data.client_email,
      amount: 60 // Prix fixe pour l'instant
    };

    return NextResponse.json({
      success: true,
      appointment: appointmentDetails
    });

  } catch (error) {
    console.error('Erreur récupération détails:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des détails' },
      { status: 500 }
    );
  }
}