import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url);
  
  // Extract parameters
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  
  // ✅ 1. Extract the "next" parameter from the URL
  const next = requestUrl.searchParams.get('next');
  
  // Extract the language from the URL path (e.g., /en/auth/callback -> 'en')
  const lang = requestUrl.pathname.split('/')[1] || 'en';

  const supabase = await createClient();

  // ✅ 2. Determine the exact redirect URL
  // If "next" exists, go there. Otherwise, fallback to the home page.
  const redirectTarget = next ? `${requestUrl.origin}${next}` : `${requestUrl.origin}/${lang}`;

  // 1. Handle Google OAuth (uses 'code')
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(redirectTarget);
    }
    console.error("OAuth Error:", error);
  }

  // 2. Handle Email Magic Links (uses 'token_hash' and 'type')
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(redirectTarget);
    }
    console.error("Magic Link Error:", error);
  }

  // If login fails, redirect to home safely
  return NextResponse.redirect(`${requestUrl.origin}/${lang}`);
}