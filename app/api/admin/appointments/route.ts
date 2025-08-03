import { NextRequest, NextResponse } from 'next/server';
import { getAllAppointments } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const appointments = await getAllAppointments();
    
    return NextResponse.json({ 
      success: true,
      appointments: appointments 
    });
  } catch (error) {
    console.error('Erreur récupération rendez-vous admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}