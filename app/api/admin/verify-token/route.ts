import { NextRequest, NextResponse } from 'next/server';
import { isValidToken } from '../../../../lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Vérifier le token avec notre système d'authentification
    if (!isValidToken(token)) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true
    });

  } catch (error) {
    console.error('Erreur vérification token:', error);
    return NextResponse.json(
      { error: 'Erreur de vérification' },
      { status: 500 }
    );
  }
}