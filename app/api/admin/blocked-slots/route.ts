import { NextRequest, NextResponse } from 'next/server';
import { getBlockedSlots } from '@/lib/supabase';

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