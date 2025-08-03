import { NextRequest, NextResponse } from 'next/server';
import { unblockTimeSlot } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
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