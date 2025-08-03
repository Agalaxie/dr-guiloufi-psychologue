import { NextRequest, NextResponse } from 'next/server';
import { unblockTimeSlot } from '@/lib/supabase';
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

    const { date, time } = await request.json();

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date et heure requises' },
        { status: 400 }
      );
    }

    const result = await unblockTimeSlot(date, time);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Créneau débloqué avec succès'
    });

  } catch (error) {
    console.error('Erreur déblocage créneau:', error);
    return NextResponse.json(
      { error: 'Erreur lors du déblocage du créneau' },
      { status: 500 }
    );
  }
}