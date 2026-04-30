'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Icon from '@/components/ui/AppIcon';

export default function LogoutBtn({ lang = 'en', onLogout }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Internal Translations for the button
  const text = {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  }[lang] || 'Logout';

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double-clicks
    
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      onLogout?.(); // Close dropdown
      router.push(`/${lang}`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Note: If the redirect happens fast enough, this component unmounts, 
      // but it's good practice to clear the loading state just in case.
      setIsLoggingOut(false); 
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full flex items-center cursor-pointer gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-1 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoggingOut ? (
        <Icon 
          name="ArrowPathIcon" 
          size={18} 
          className="text-red-500 animate-spin" 
        />
      ) : (
        <Icon 
          name="ArrowRightOnRectangleIcon" 
          size={18} 
          className={`text-red-500 ${dir === 'rtl' ? 'rotate-180' : ''}`} 
        />
      )}
      <span>{isLoggingOut ? (lang === 'ar' ? 'جاري تسجيل الخروج...' : 'Logging out...') : text}</span>
    </button>
  );
}