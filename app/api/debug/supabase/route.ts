import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Test de connexion basique à Supabase
    const { data, error } = await supabase
      .from('blocked_slots')
      .select('*')
      .limit(1);

    const diagnostics = {
      supabase_connection: !error,
      blocked_slots_table_exists: !error,
      error_message: error?.message || null,
      test_query_result: data || null
    };

    if (error) {
      console.error('Erreur Supabase:', error);
    }

    return NextResponse.json(diagnostics);
  } catch (error) {
    console.error('Erreur diagnostic Supabase:', error);
    return NextResponse.json({
      supabase_connection: false,
      error: 'Erreur de connexion Supabase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}