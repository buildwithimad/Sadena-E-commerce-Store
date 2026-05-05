import AdminShell from '@/components/Admin/AdminShell'
import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

const validLangs = ["en", "ar"]

// ------------------------
// Metadata
// ------------------------
export async function generateMetadata({ params }) {
  const { lang } = await params

  return {
    title: lang === "ar" ? "سادينا | لوحة الإدارة" : "Sadena | Admin Panel",
    description: lang === "ar" ? "إدارة متجرك العضوي" : "Manage your organic store",
  }
}

// ------------------------
// Premium Loading Fallback
// ------------------------
function PageLoader() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500 ease-out">
      <div className="relative flex items-center justify-center w-12 h-12 mb-4">
        {/* Soft background ring */}
        <div className="absolute inset-0 border-4 border-green-500/10 rounded-full"></div>
        {/* Animated spinning ring */}
        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase animate-pulse">
        Loading...
      </p>
    </div>
  )
}

// ------------------------
// Layout (SSR Protected)
// ------------------------
export default async function RootLayout({ children, params }) {
  const { lang } = await params

  if (!validLangs.includes(lang)) {
    notFound()
  }

  const cookieStore = await cookies()

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

  if (!user) {
    redirect(`/${lang}`)
  }

  const { data } = await supabase.auth.getSession()
console.log("user data from layout", data.session.user)

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <div lang={lang} dir={dir}>
      <div className="bg-[#fafafa] text-gray-900 antialiased min-h-screen">
        
        <AdminShell lang={lang} user={user}>
          {/* Suspense automatically catches any async server components (pages) 
            loading inside this layout and displays the premium loader.
          */}
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </AdminShell>

      </div>
    </div>
  )
}