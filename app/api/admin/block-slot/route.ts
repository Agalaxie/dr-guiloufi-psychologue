import { NextRequest, NextResponse } from 'next/server';
import { blockTimeSlot } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
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