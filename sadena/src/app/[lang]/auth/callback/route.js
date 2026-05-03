import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient();

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}