import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        error: 'Variables d\'environnement Supabase manquantes (URL ou SERVICE_ROLE_KEY)'
      }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Créer la table appointment_bookings
    const createAppointmentBookings = `
      CREATE TABLE IF NOT EXISTS appointment_bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date DATE NOT NULL,
          time TIME NOT NULL,
          client_name VARCHAR(255) NOT NULL,
          client_email VARCHAR(255) NOT NULL,
          client_phone VARCHAR(20),
          reason TEXT,
          message TEXT,
          consultation_type VARCHAR(20) DEFAULT 'cabinet' CHECK (consultation_type IN ('cabinet', 'visio')),
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
          stripe_session_id VARCHAR(255) UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Créer la table blocked_slots
    const createBlockedSlots = `
      CREATE TABLE IF NOT EXISTS blocked_slots (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date DATE NOT NULL,
          time TIME NOT NULL,
          reason VARCHAR(255) DEFAULT 'Indisponible',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(date, time)
      );
    `;

    // Créer les index
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_appointment_bookings_date_time ON appointment_bookings(date, time);
      CREATE INDEX IF NOT EXISTS idx_appointment_bookings_status ON appointment_bookings(status);
      CREATE INDEX IF NOT EXISTS idx_appointment_bookings_stripe ON appointment_bookings(stripe_session_id);
      CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_time ON blocked_slots(date, time);
    `;

    // Exécuter les requêtes
    const { error: error1 } = await supabase.rpc('exec_sql', { sql: createAppointmentBookings });
    const { error: error2 } = await supabase.rpc('exec_sql', { sql: createBlockedSlots });
    const { error: error3 } = await supabase.rpc('exec_sql', { sql: createIndexes });

    // Si les fonctions RPC ne marchent pas, essayons une approche différente
    if (error1 || error2 || error3) {
      // Test de connexion basique
      const { data, error } = await supabase
        .from('blocked_slots')
        .select('*')
        .limit(1);

      return NextResponse.json({
        message: 'Impossible d\'exécuter les scripts SQL via RPC',
        rpc_errors: { error1, error2, error3 },
        alternative_test: {
          table_accessible: !error,
          error: error?.message
        },
        manual_setup_required: true,
        sql_script: {
          appointment_bookings: createAppointmentBookings,
          blocked_slots: createBlockedSlots,
          indexes: createIndexes
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tables créées avec succès',
      tables_created: ['appointment_bookings', 'blocked_slots']
    });

  } catch (error) {
    console.error('Erreur initialisation DB:', error);
    return NextResponse.json({
      error: 'Erreur lors de l\'initialisation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}