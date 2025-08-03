import { NextRequest, NextResponse } from 'next/server';

// Importer la fonction de vérification des tokens
// (En production, utilisez une base de données ou Redis)
let validTokens = new Set<string>();

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
    
    // En production, vérifiez contre votre base de données
    // Pour la démo, on accepte tous les tokens non vides
    if (!token) {
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