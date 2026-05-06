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
  
  // 🛑 1. STOP middleware if it's a static file or internal Next.js path
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') // This catches logo.png, favicon.ico, etc.
  ) {
    return res
  }

  const segments = pathname.split('/')
  const lang = segments[1] || 'en'

  const isLoginPage = pathname === `/${lang}`

  const protectedRoutes = [
    `/${lang}/overview`,
    `/${lang}/products`,
    `/${lang}/categories`,
    `/${lang}/orders`,
    `/${lang}/warehouses`,
    `/${lang}/settings`,
    `/${lang}/analytics`,
    `/${lang}/customers`,
    `/${lang}/wishlists`,
    `/${lang}/testimonials`,
    `/${lang}/admins`, // Added admins since you have that page now
    `/${lang}/profile`, // Added profile
  ]

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtected && !user) {
    return NextResponse.redirect(new URL(`/${lang}`, req.url))
  }

  if (isLoginPage && user) {
    return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
  }

  return res
}

// 🛑 2. ADD THIS MATCHER CONFIG
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (your specific logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.).*)',
  ],
}