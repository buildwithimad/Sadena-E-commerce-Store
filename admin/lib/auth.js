import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function checkAdmin() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value
      }
    }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user
}