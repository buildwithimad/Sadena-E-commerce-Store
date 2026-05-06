'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // ✅ IMPORT THIS
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabaseClient';
import AppLogo from '@/components/ui/AppLogo';

export default function AuthModal({ isOpen, onClose, lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const pathname = usePathname(); // ✅ Get the exact current path (e.g., /en/checkout)
  
  // Form states
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Translations
  const t = {
    en: {
      title: 'Login',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      btnSubmit: 'Sign in with Email',
      or: 'or login with',
      successTitle: 'Check your email',
      successSub: 'We sent a secure magic link to',
      successHint: 'Click the link in the email to sign in instantly.',
      closeBtn: 'Close',
    },
    ar: {
      title: 'تسجيل الدخول',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      btnSubmit: 'تسجيل الدخول',
      or: 'أو الدخول بواسطة',
      successTitle: 'تحقق من بريدك الإلكتروني',
      successSub: 'لقد أرسلنا رابط دخول آمن إلى',
      successHint: 'انقر على الرابط في البريد الإلكتروني لتسجيل الدخول فوراً.',
      closeBtn: 'إغلاق',
    }
  }[lang];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset form fields smoothly after modal closes
      setTimeout(() => {
        setEmail('');
        setIsSuccess(false);
        setErrorMsg(null);
      }, 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // ✅ Add ?next= parameter so the backend knows where to return them
        emailRedirectTo: `${window.location.origin}/${lang}/auth/callback?next=${encodeURIComponent(pathname)}`,
      },
    });

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <div 
      dir={dir}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible delay-100'
      }`} 
    >
      
      {/* Dark Blur Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div 
        className={`relative w-full max-w-[400px] bg-white shadow-2xl p-8  transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 rtl:left-5 rtl:right-auto text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors outline-none z-10"
          aria-label="Close"
        >
          <Icon name="XMarkIcon" size={18} />
        </button>

        {isSuccess ? (
          /* =========================================
             SUCCESS STATE UI
             ========================================= */
          <div className="text-center animate-in fade-in zoom-in-95 duration-500 py-4">
            <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
              <Icon name="EnvelopeIcon" size={36} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
              {t.successTitle}
            </h2>
            <p className="text-sm text-gray-500 mb-1 leading-relaxed">
              {t.successSub}
            </p>
            <p className="text-sm font-bold text-gray-900 mb-6 px-4 py-2 bg-gray-50 rounded-lg inline-block">
              {email}
            </p>
            <p className="text-xs text-gray-400 mb-8">
              {t.successHint}
            </p>
            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-lg hover:bg-black transition-all duration-300 active:scale-95 shadow-md"
            >
              {t.closeBtn}
            </button>
          </div>
        ) : (
          /* =========================================
             LOGIN FORM UI
             ========================================= */
          <div className="animate-in fade-in duration-500">
            {/* User Icon Circle / Logo */}
            <div className="w-24 h-24 mx-auto mb-2 flex justify-center items-center">
              <AppLogo size={102} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center text-[var(--foreground)] mb-6 capitalize tracking-wide">
              {t.title}
            </h2>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                <Icon name="ExclamationTriangleIcon" size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Form Container */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              
              {/* Email Input */}
              <div className="relative overflow-hidden transition-all duration-300">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  {t.emailLabel}
                </label>
                <div className="flex border border-gray-200 rounded-md overflow-hidden focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all bg-gray-50 focus-within:bg-white">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder} 
                    className="flex-1 px-4 py-3.5 text-sm outline-none w-full text-gray-900 placeholder:text-gray-400 bg-transparent font-medium"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {/* Enter Button (Solid Green) */}
              <button 
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-green-600 text-white font-bold py-3.5 rounded-md hover:bg-green-700 transition-all duration-300 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] shadow-sm shadow-green-600/20"
              >
                {isLoading ? (
                  <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                ) : (
                  <Icon name="EnvelopeIcon" size={18} />
                )}
                {t.btnSubmit}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {t.or}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social Login (Google) */}
            <div className="flex justify-center">
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      // ✅ Add ?next= parameter for Google OAuth too!
                      redirectTo: `${window.location.origin}/${lang}/auth/callback?next=${encodeURIComponent(pathname)}`,
                    },
                  });
                }}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 rounded-xl py-3.5 font-bold text-sm hover:bg-gray-50 transition-all duration-300 active:scale-[0.98] shadow-sm"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}