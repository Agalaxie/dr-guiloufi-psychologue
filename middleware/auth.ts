import { NextRequest } from 'next/server';

// Vérifier l'authentification admin
export function checkAdminAuth(request: NextRequest): { isAuth: boolean; token?: string } {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isAuth: false };
  }

  const token = authHeader.substring(7); // Enlever "Bearer "
  
  // Ici, vous devriez vérifier le token contre votre système
  // Pour la simplicité, on fait une vérification basique
  return { isAuth: true, token };
}

// Hook pour protéger les composants côté client
export function useAdminAuth() {
  if (typeof window === 'undefined') return { isAuth: false };
  
  const token = localStorage.getItem('admin_token');
  return { isAuth: !!token, token };
}