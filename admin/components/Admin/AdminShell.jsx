'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AppLogo from '@/components/ui/AppLogo';
import LogoutBtn from '@/components/Logout';

export default function AdminShell({ children, lang = 'en', user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loadingPath, setLoadingPath] = useState(null); 
  const [isSwitchingLang, setIsSwitchingLang] = useState(false); 
  const profileDropdownRef = useRef(null);

  const pathname = usePathname();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const otherLang = lang === 'en' ? 'ar' : 'en';

  // --- 🔥 FIXED: Dynamic User Details from Supabase Metadata ---
  const metadata = user?.user_metadata;
  
  // Use first_name and last_name from metadata, fallback to email prefix
  const firstName = metadata?.first_name || '';
  const lastName = metadata?.last_name || '';
  const emailPrefix = user?.email?.split('@')[0] || 'Admin';
  
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : emailPrefix;
  
  // Get initial for avatar fallback
  const userInitial = (firstName || emailPrefix).charAt(0).toUpperCase();
  
  // Get Avatar URL
  const userImage = metadata?.avatar_url;

  // Get Role
  const userRole = metadata?.role || 'admin';

  // ------------------------
  // 🌍 Internal Translations
  // ------------------------
  const translations = {
    en: {
      sidebar: {
        dashboard: 'Overview',
        analytics: "Analytics",
        categories: "Categories",
        orders: 'Orders',
        products: 'Products',
        warehouse: 'Warehouse',
        settings: 'Settings',
        adminProfile: 'Admins',
        activityLogs: 'Activity Logs'
      },
      nav: {
        search: 'Search for orders, products, customers...',
        myProfile: 'My Profile',
      },
      roles: {
        admin: 'Administrator',
        user: 'User'
      }
    },
    ar: {
      sidebar: {
        dashboard: 'لوحة القيادة',
        analytics: 'التحليلات',
        categories: 'الفئات',
        orders: 'الطلبات',
        products: 'المنتجات',
        warehouse: 'المخزن',
        settings: 'الإعدادات',
        adminProfile: 'المسؤولين',
        activityLogs: 'سجلات النشاط'
      },
      nav: {
        search: 'البحث عن الطلبات والمنتجات والعملاء...',
        myProfile: 'ملفي الشخصي',
      },
      roles: {
        admin: 'مسؤول',
        user: 'مستخدم'
      }
    }
  };

  const t = translations[lang] || translations.en;
  const displayRole = t.roles[userRole] || userRole;

  useEffect(() => {
    setSidebarOpen(false);
    setProfileDropdownOpen(false);
    setLoadingPath(null); 
    setIsSwitchingLang(false); 
  }, [pathname]);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchLangPath = () => {
    if (!pathname) return `/${otherLang}`;
    const segments = pathname.split('/');
    segments[1] = otherLang;
    return segments.join('/');
  };

  const menuItems = [
    { name: t.sidebar.dashboard, icon: 'HomeIcon', href: `/${lang}/overview` },
    { name: t.sidebar.analytics, icon: 'ChartBarIcon', href: `/${lang}/analytics` },
    { name: t.sidebar.orders, icon: 'ClipboardDocumentListIcon', href: `/${lang}/orders` },
    { name: t.sidebar.products, icon: 'CubeIcon', href: `/${lang}/products` },
    { name: t.sidebar.categories, icon: 'Squares2X2Icon', href: `/${lang}/categories` },
    { name: t.sidebar.warehouse, icon: 'BuildingStorefrontIcon', href: `/${lang}/warehouse` },
  ];

  const adminMenuItems = [
    { name: t.sidebar.adminProfile, icon: 'UserCircleIcon', href: `/${lang}/admins` },
    { name: t.sidebar.settings, icon: 'Cog8ToothIcon', href: `/${lang}/settings` },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[#f9fafb] flex text-gray-900">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      <div 
        className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} z-50 w-[260px] bg-white border-r border-gray-100 shadow-sm flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:fixed lg:inset-y-0 ${
          sidebarOpen 
            ? 'translate-x-0' 
            : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="h-[72px] flex items-center px-6 shrink-0">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 outline-none">
            <img src="/logo.png" alt="Logo" className="h-16 md:h-18 w-auto object-contain" />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-400 p-1.5"><Icon name="XMarkIcon" size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-6 flex flex-col gap-6">
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  pathname.startsWith(item.href) ? 'bg-[#21c45d] text-white shadow-sm shadow-[#21c45d]/20' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon name={item.icon} size={20} variant={pathname.startsWith(item.href) ? 'solid' : 'outline'} />
                <span className="flex-1">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ADMIN</h3>
            <nav className="space-y-1.5">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                    pathname.startsWith(item.href) ? 'bg-[#21c45d] text-white shadow-sm shadow-[#21c45d]/20' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon name={item.icon} size={20} variant={pathname.startsWith(item.href) ? 'solid' : 'outline'} />
                  <span className="flex-1">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ✅ Updated Sidebar Bottom Card */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#ecfdf3] border border-[#21c45d]/10 overflow-hidden flex items-center justify-center shrink-0">
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="font-bold text-[#21c45d] text-sm">{userInitial}</span>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">{displayName}</span>
              <span className="text-xs text-gray-500 font-medium truncate capitalize">{displayRole}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${dir === 'rtl' ? 'lg:mr-[260px]' : 'lg:ml-[260px]'}`}>
        
        {/* TOP NAVBAR */}
        <header className="sticky top-0 h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 bg-gray-50 rounded-xl"><Icon name="Bars3Icon" size={22} /></button>
            
            <div className="hidden sm:flex items-center bg-gray-50 rounded-xl px-4 py-2.5 w-[420px] group focus-within:bg-white border border-transparent focus-within:border-gray-200">
              <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 mr-2" />
              <input type="text" placeholder={t.nav.search} className="bg-transparent outline-none text-sm w-full text-gray-900 font-medium" />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href={switchLangPath()} className="text-xs font-semibold text-gray-500 hover:text-gray-900 uppercase">{otherLang === 'ar' ? 'عربي' : 'EN'}</Link>
            
            <button className="relative p-2 text-gray-500">
              <Icon name="BellIcon" size={24} variant="outline" />
              <span className="absolute top-1.5 right-2 h-4 w-4 rounded-full bg-[#21c45d] border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">3</span>
            </button>

            <div className="w-px h-8 bg-gray-200 hidden sm:block mx-1" />

            {/* ✅ Updated Top Navbar Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex cursor-pointer items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-[#ecfdf3] border border-[#21c45d]/10 overflow-hidden flex items-center justify-center shrink-0">
                  {userImage ? (
                    <img src={userImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="font-bold text-[#21c45d] text-sm">{userInitial}</span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</span>
                  <span className="text-[11px] text-gray-500 font-medium capitalize">{displayRole}</span>
                </div>
                <Icon name="ChevronDownIcon" size={14} className={`text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileDropdownOpen && (
                <div className={`absolute top-[calc(100%+0.75rem)] w-56 bg-white border border-gray-100 rounded-2xl py-2 z-50 shadow-xl ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                  <Link href={`/${lang}/profile`} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#21c45d]">
                    <Icon name="UserCircleIcon" size={18} className="text-gray-400" />
                    {t.nav.myProfile}
                  </Link>
                  <div className="px-2 mt-1 border-t border-gray-50 pt-1">
                    <LogoutBtn lang={lang} onLogout={() => setProfileDropdownOpen(false)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 relative">
          <div key={pathname} className="h-full animate-in fade-in duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}