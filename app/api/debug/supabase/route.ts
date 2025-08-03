import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const diagnostics: any = {
      env_variables: {
        supabase_url_set: !!supabaseUrl,
        supabase_anon_key_set: !!supabaseAnonKey,
        supabase_service_key_set: !!supabaseServiceKey,
        supabase_url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT_SET'
      }
    };

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        ...diagnostics,
        error: 'Variables d\'environnement Supabase manquantes'
      });
    }

    // Test avec anon key
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('blocked_slots')
      .select('count')
      .limit(1);

    diagnostics.anon_key_test = {
      success: !anonError,
      error: anonError?.message || null
    };

    // Test avec service role key si disponible
    if (supabaseServiceKey) {
      const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data: serviceData, error: serviceError } = await supabaseService
        .from('blocked_slots')
        .select('count')
        .limit(1);

      diagnostics.service_key_test = {
        success: !serviceError,
        error: serviceError?.message || null
      };

      // Test de création de table si service key fonctionne
      if (!serviceError) {
        const { error: createError } = await supabaseService.rpc('version');
        diagnostics.database_access = {
          can_execute_functions: !createError,
          version_check_error: createError?.message || null
        };
      }
    }

    return NextResponse.json(diagnostics);
  } catch (error) {
    console.error('Erreur diagnostic Supabase:', error);
    return NextResponse.json({
      error: 'Erreur de diagnostic Supabase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}