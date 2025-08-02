import { NextRequest, NextResponse } from 'next/server';
import { isTimeSlotAvailable, getBusySlots } from '@/lib/google-calendar';

export async function POST(request: NextRequest) {
  try {
    const { date, time } = await request.json();

    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date et heure requises' },
        { status: 400 }
      );
    }

    const available = await isTimeSlotAvailable(date, time);
    
    return NextResponse.json({ available });
  } catch (error) {
    console.error('Erreur vérification disponibilité:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date requise' },
        { status: 400 }
      );
    }

    const busySlots = await getBusySlots(date);
    
    return NextResponse.json({ busySlots });
  } catch (error) {
    console.error('Erreur récupération créneaux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}