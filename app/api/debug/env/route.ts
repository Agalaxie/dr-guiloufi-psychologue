import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
    ADMIN_PASSWORD_VALUE: process.env.ADMIN_PASSWORD ? 'SET' : 'NOT_SET',
    SUPABASE_URL_SET: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY_SET: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_SET: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_SET: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_SET: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  };

  return NextResponse.json(envCheck);
}