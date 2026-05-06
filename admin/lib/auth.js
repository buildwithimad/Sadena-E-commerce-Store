import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Production-ready Admin Gatekeeper
 * Verifies session and 'admin' role via Server-Side Cookies.
 */
export async function checkAdmin() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        // We wrap set/remove in try/catch because Next.js sometimes 
        // prevents cookie setting during specific server-side operations.
        set: (name, value, options) => {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove: (name, options) => {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Strict check: No user or no admin role = immediate null
  if (!user || user.user_metadata?.role !== 'admin') {
    return null
  }

  return user
}