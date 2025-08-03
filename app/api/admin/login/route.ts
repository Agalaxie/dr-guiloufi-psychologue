import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Mot de passe admin (à changer !)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Générer un token simple
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Stocker les tokens valides (en production, utiliser Redis ou base de données)
const validTokens = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier le mot de passe
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }

    // Générer un token
    const token = generateToken();
    validTokens.add(token);

    // Supprimer le token après 24h
    setTimeout(() => {
      validTokens.delete(token);
    }, 24 * 60 * 60 * 1000);

    return NextResponse.json({
      success: true,
      token: token,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur login admin:', error);
    return NextResponse.json(
      { error: 'Erreur de connexion' },
      { status: 500 }
    );
  }
}

// Fonction pour vérifier un token (utilisée par d'autres endpoints)
export function isValidToken(token: string): boolean {
  return validTokens.has(token);
}