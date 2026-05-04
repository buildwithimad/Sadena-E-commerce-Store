import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url);
  
  // Extract parameters
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  
  // Extract the language from the URL path (e.g., /en/auth/callback -> 'en')
  const lang = requestUrl.pathname.split('/')[1] || 'en';

  const supabase = await createClient();

  // 1. Handle Google OAuth (uses 'code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}/${lang}`);
    }
    console.error("OAuth Error:", error);
  }

  // 2. Handle Email Magic Links (uses 'token_hash' and 'type')
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}/${lang}`);
    }
    console.error("Magic Link Error:", error);
  }

  // If login fails, redirect to home safely
  return NextResponse.redirect(`${requestUrl.origin}/${lang}`);
}