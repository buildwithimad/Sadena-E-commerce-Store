import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => res.cookies.set(key, value, options),
        remove: (key, options) => res.cookies.set(key, '', options)
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // 🛑 Skip static + api
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return res
  }

  const segments = pathname.split('/')
  const lang = segments[1] || 'en'

  const loginPage = `/${lang}`

  // ❌ Not logged in → go to login
  if (!user) {
    return NextResponse.redirect(new URL(loginPage, req.url))
  }

  // ❌ Not admin → block EVERYTHING
  if (user.user_metadata?.role !== 'admin') {
    return NextResponse.redirect(new URL(loginPage, req.url))
  }

  // ✅ Logged in admin → prevent going back to login
  if (pathname === loginPage) {
    return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.).*)',
  ],
}