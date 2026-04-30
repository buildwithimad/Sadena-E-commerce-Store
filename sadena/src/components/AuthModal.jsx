'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppLogo from './ui/AppLogo';

export default function AuthModal({ isOpen, onClose, lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // State to track which login method is currently active
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' | 'email'

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset back to phone when modal closes (after the exit animation finishes)
      setTimeout(() => setLoginMethod('phone'), 500);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div 
      dir={dir}
      // We use pointer-events-none and invisible to hide it completely when closed without destroying the DOM instantly
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible delay-100'
      }`} 
    >
      
      {/* Dark Blur Backdrop - Smooth fade */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`} 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Modal Box - Premium scale and slide up animation */}
      <div 
        className={`relative w-full max-w-[400px] bg-white shadow-2xl p-8 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-red-400 hover:text-red-600 transition-colors outline-none"
          aria-label="Close"
        >
          <Icon name="XMarkIcon" size={20} variant="outline" />
        </button>

        {/* User Icon Circle */}
        <div className="w-24 h-24 mx-auto">
            <AppLogo size={102} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-[var(--foreground)] mb-6 capitalize tracking-wide">
          {lang === 'ar' ? 'تسجيل الدخول' : 'login'}
        </h2>

        {/* Form Container */}
        <div className="space-y-4">
          
          {/* Conditional Input Rendering based on state */}
          <div className="relative overflow-hidden transition-all duration-300">
            {loginMethod === 'phone' ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                  {lang === 'ar' ? 'رقم الجوال' : 'Mobile Number'}
                </label>
                <div className="flex border border-[var(--border)] rounded-md overflow-hidden focus-within:border-[var(--primary)] transition-colors">
                  <div className={`flex items-center justify-center bg-gray-50 px-4 py-3 text-sm text-[var(--foreground)] font-medium ${dir === 'rtl' ? 'border-l' : 'border-r'} border-[var(--border)]`}>
                    +966
                  </div>
                  <input 
                    type="tel" 
                    placeholder="051 234 5678" 
                    className="flex-1 px-4 py-3 text-sm outline-none w-full text-[var(--foreground)] placeholder:text-gray-400 bg-transparent"
                    dir="ltr" // Force LTR so numbers type correctly even in Arabic
                  />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="flex border border-[var(--border)] rounded-md overflow-hidden focus-within:border-[var(--primary)] transition-colors">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="flex-1 px-4 py-3 text-sm outline-none w-full text-[var(--foreground)] placeholder:text-gray-400 bg-transparent"
                    dir="ltr"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Enter Button (Solid Green) */}
          <button className="w-full bg-[var(--primary)] text-white font-bold py-3.5 rounded-md hover:bg-[var(--primary-dark)] transition-colors duration-300 mt-2">
            {lang === 'ar' ? 'دخول' : 'Enter'}
          </button>

          {/* Toggle Login Method Button (Outline Green) */}
          <button 
            onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}
            className="w-full bg-white border border-[var(--primary)] text-[var(--primary)] font-bold py-3.5 rounded-md hover:bg-[var(--secondary)] transition-colors duration-300"
          >
            {loginMethod === 'phone' 
              ? (lang === 'ar' ? 'تسجيل الدخول بالبريد الإلكتروني' : 'Sign in with email')
              : (lang === 'ar' ? 'تسجيل الدخول برسالة نصية' : 'Sign in with a text message')
            }
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-[var(--muted-foreground)] uppercase tracking-widest">
            {lang === 'ar' ? 'أو الدخول بواسطة' : 'or login with'}
          </span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        {/* Social Login (Google) */}
        <div className="flex justify-center gap-4">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm border border-[var(--border)]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}