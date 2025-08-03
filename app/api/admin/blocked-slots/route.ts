import { NextRequest, NextResponse } from 'next/server';
import { getBlockedSlots } from '@/lib/supabase';
import { isValidToken } from '../../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date requise' },
        { status: 400 }
      );
    }

    const blockedSlots = await getBlockedSlots(date);
    
    return NextResponse.json({ 
      success: true,
      blockedSlots: blockedSlots 
    });
  } catch (error) {
    console.error('Erreur récupération créneaux bloqués:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des créneaux bloqués' },
      { status: 500 }
    );
  }
}