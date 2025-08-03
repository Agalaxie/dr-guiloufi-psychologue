import { NextRequest, NextResponse } from 'next/server';
import { blockTimeSlot } from '@/lib/supabase';
import { isValidToken } from '../../../../lib/admin-auth';

export async function POST(request: NextRequest) {
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

    const { date, time, reason } = await request.json();

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date et heure requises' },
        { status: 400 }
      );
    }

    const result = await blockTimeSlot(date, time, reason);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Créneau bloqué avec succès'
    });

  } catch (error) {
    console.error('Erreur blocage créneau:', error);
    return NextResponse.json(
      { error: 'Erreur lors du blocage du créneau' },
      { status: 500 }
    );
  }
}