'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AppLogo from '@/components/ui/AppLogo'
import Icon from '@/components/ui/AppIcon'

export default function Login({ lang }) {
  const translations = {
    en: {
      title: "Admin Portal",
      sub: "Log in to manage your store securely.",
      email: "Email Address",
      password: "Password",
      enter: "Sign In",
      loading: "Signing in...",
      error: "Authentication failed. Please check your credentials."
    },
    ar: {
      title: "بوابة الإدارة",
      sub: "سجل الدخول لإدارة متجرك بأمان.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      enter: "دخول",
      loading: "جاري تسجيل الدخول...",
      error: "فشلت عملية المصادقة. يرجى التحقق من بياناتك."
    },
  }

  const t = translations[lang] || translations.en
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setErrorMessage(error.message || t.error)
      } else {
        router.push(`/${lang}/overview`)
      }
    } catch (err) {
      setErrorMessage(t.error)
    } finally {
      setLoading(false)
    }
  }

  // Premium CSS Classes
  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all duration-300";
  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2";

  return (
    <div dir={dir} className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 sm:p-6">
      
      {/* Border-only Premium Card */}
      <div className="w-full max-w-[420px] bg-white border border-gray-200/80 rounded-lg p-8 sm:p-12 flex flex-col relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 to-green-600" />

        {/* Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="mb-6 p-1">
            <AppLogo size={90} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {t.sub}
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
            <Icon name="ExclamationTriangleIcon" size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Email Field */}
          <div>
            <label className={labelClass}>{t.email}</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              dir="ltr"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className={labelClass}>{t.password}</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} ${dir === 'rtl' ? 'pl-12' : 'pr-12'}`}
                dir="ltr"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${dir === 'rtl' ? 'left-4' : 'right-4'} text-gray-400 hover:text-green-600 transition-colors p-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-green-500/20`}
                tabIndex="-1" // Keep it out of standard tab flow for faster form submission
              >
                {/* Use EyeSlash if visible, Eye if hidden */}
                <Icon name={showPassword ? "EyeSlashIcon" : "EyeIcon"} size={20} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-green-600 text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-xs hover:bg-green-700 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
          >
            {loading ? (
              <>
                <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                {t.loading}
              </>
            ) : (
              t.enter
            )}
          </button>

        </form>

        {/* Footer info (optional visual balance) */}
        <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Secure Connection
        </p>
      </div>
    </div>
  )
}