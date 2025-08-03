import crypto from 'crypto';

// Stocker les tokens valides (en production, utiliser Redis ou base de données)
const validTokens = new Set<string>();

// Générer un token simple
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Fonction pour vérifier un token
export function isValidToken(token: string): boolean {
  return validTokens.has(token);
}

// Ajouter un token valide
export function addValidToken(token: string): void {
  validTokens.add(token);
}

// Supprimer un token
export function removeValidToken(token: string): void {
  validTokens.delete(token);
}