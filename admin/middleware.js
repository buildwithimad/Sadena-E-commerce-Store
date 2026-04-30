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

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname
  const segments = pathname.split('/')
  const lang = segments[1] || 'en'

  // 👉 LOGIN PAGE
  const isLoginPage = pathname === `/${lang}`

  // 👉 PROTECTED ROUTES (your admin pages)
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
  ]

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 🔒 Not logged in → redirect to login
  if (isProtected && !user) {
    return NextResponse.redirect(new URL(`/${lang}`, req.url))
  }

  // 🔁 Already logged in → skip login page
  if (isLoginPage && user) {
    return NextResponse.redirect(new URL(`/${lang}/overview`, req.url))
  }

  return res
}