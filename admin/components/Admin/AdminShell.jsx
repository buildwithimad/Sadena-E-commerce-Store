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
  const [loadingPath, setLoadingPath] = useState(null); // Track active navigation
  const [isSwitchingLang, setIsSwitchingLang] = useState(false); // Track language switch loading
  const profileDropdownRef = useRef(null);

  const pathname = usePathname();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const otherLang = lang === 'en' ? 'ar' : 'en';

  // --- Dynamic User Display Logic ---
  const userEmail = user?.email || '';
  const rawName = userEmail ? userEmail.split('@')[0] : 'Admin';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const userInitial = displayName.charAt(0).toUpperCase() || 'A';

  // ------------------------
  // 🌍 Internal Translations
  // ------------------------
  const translations = {
    en: {
      sidebar: {
        mainMenu: 'Main Menu',
        dashboard: 'Overview',
        analytics: "Analytics",
        categories: "Categories",
        orders: 'Orders',
        products: 'Products',
        customers: 'Customers',
        warehouse: 'Warehouse',
        settings: 'Settings',
      },
      nav: {
        search: 'Search...',
        myProfile: 'My Profile',
        role: 'Store Manager'
      }
    },
    ar: {
      sidebar: {
        mainMenu: 'القائمة الرئيسية',
        dashboard: 'لوحة القيادة',
        analytics: 'التحليلات',
        categories: 'الفئات',
        orders: 'الطلبات',
        products: 'المنتجات',
        customers: 'العملاء',
        warehouse: 'المخزن',
        settings: 'الإعدادات',
      },
      nav: {
        search: 'بحث...',
        myProfile: 'ملفي الشخصي',
        role: 'مدير المتجر'
      }
    }
  };

  const t = translations[lang] || translations.en;

  // Clear loading state and close mobile sidebar when path changes
  useEffect(() => {
    setSidebarOpen(false);
    setProfileDropdownOpen(false);
    setLoadingPath(null); 
    setIsSwitchingLang(false); 
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Handle click outside to close profile dropdown
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
    { name: t.sidebar.dashboard, icon: 'Squares2X2Icon', href: `/${lang}/overview` },
    { name: t.sidebar.analytics, icon: 'ChartBarIcon', href: `/${lang}/analytics` },
    { name: t.sidebar.orders, icon: 'ShoppingBagIcon', href: `/${lang}/orders` },
    { name: t.sidebar.products, icon: 'TagIcon', href: `/${lang}/products` },
    { name: t.sidebar.categories, icon: 'ListBulletIcon', href: `/${lang}/categories` },
    { name: t.sidebar.customers, icon: 'UsersIcon', href: `/${lang}/customers` },
    { name: t.sidebar.warehouse, icon: 'BuildingStorefrontIcon', href: `/${lang}/warehouse` },
    { name: t.sidebar.settings, icon: 'Cog8ToothIcon', href: `/${lang}/settings` },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[#f8fafc] flex">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      <div 
        className={`fixed inset-0 bg-gray-900/10 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 ${dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-[260px] bg-white border-gray-200 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:fixed lg:inset-y-0 ${
          sidebarOpen 
            ? 'translate-x-0' 
            : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <Link href={`/${lang}`} className="flex items-center outline-none">
            <AppLogo size={100} />
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-xl active:scale-95"
          >
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
          <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 mt-2">
            {t.sidebar.mainMenu}
          </span>
          
          <nav className="space-y-1.5 flex-1">
            {menuItems.map((item) => {
              const isActive = item.href === `/${lang}` ? pathname === item.href : pathname.startsWith(item.href);
              const isCurrentlyLoading = loadingPath === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (!isActive) {
                      setLoadingPath(item.href);
                    }
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 outline-none ${
                    isActive 
                      ? 'bg-green-50 text-green-700' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {isCurrentlyLoading ? (
                    <Icon name="ArrowPathIcon" size={20} className="animate-spin text-green-600" />
                  ) : (
                    <Icon name={item.icon} size={20} variant={isActive ? 'solid' : 'outline'} className={isActive ? 'text-green-600' : 'text-gray-400'} />
                  )}
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${dir === 'rtl' ? 'lg:mr-[260px]' : 'lg:ml-[260px]'}`}>
        
        {/* PREMIUM NAVBAR */}
        <header className="sticky top-0 h-20 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 shrink-0 shadow-gray-200/20 transition-all shadow-sm">
          
          {/* Left Side: Toggle & Search */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all outline-none active:scale-95"
              aria-label="Open sidebar"
            >
              <Icon name="Bars3Icon" size={22} />
            </button>
            
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200/60 hover:bg-white hover:border-gray-300 hover:shadow-sm rounded-xl px-3 py-2 w-72 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-300 group">
              <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input 
                type="text" 
                placeholder={t.nav.search}
                className="bg-transparent border-none outline-none text-sm px-3 w-full text-gray-900 placeholder:text-gray-400 font-medium"
              />
              <div className="flex items-center justify-center px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-bold text-gray-400 shadow-sm shadow-black/[0.02]">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Professional Language Switcher */}
            <Link
              href={switchLangPath()}
              onClick={() => {
                if (pathname !== switchLangPath()) setIsSwitchingLang(true);
              }}
              className="group flex items-center justify-center gap-2 px-3 py-1.5 min-w-[80px] sm:min-w-[96px] bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-200 outline-none active:scale-95 shadow-sm shadow-black/[0.02]"
            >
              {isSwitchingLang ? (
                <Icon name="ArrowPathIcon" size={16} className="animate-spin text-green-600" />
              ) : (
                <>
                  <span className="text-sm drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                    {otherLang === 'ar' ? '🇸🇦' : '🇺🇸'}
                  </span>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mt-[1px]">
                    {otherLang === 'ar' ? 'عربي' : 'EN'}
                  </span>
                </>
              )}
            </Link>

            <div className="w-px h-6 bg-gray-200 hidden sm:block mx-1" />

            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 outline-none active:scale-95 group">
              <Icon name="BellIcon" size={22} className="group-hover:animate-swing origin-top" />
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
              </span>
            </button>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center gap-2 sm:gap-3 p-1.5 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl outline-none transition-all duration-200 group active:scale-95 ${profileDropdownOpen ? 'bg-white border-gray-200 shadow-sm shadow-black/[0.02]' : ''}`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 text-green-700 flex items-center justify-center font-bold text-sm border border-green-200/60 shadow-inner group-hover:from-green-600 group-hover:to-green-500 group-hover:text-white transition-all duration-300">
                  {userInitial}
                </div>
                <div className="hidden md:flex flex-col items-start pr-1">
                  <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {t.nav.role}
                  </span>
                </div>
                <Icon 
                  name="ChevronDownIcon" 
                  size={14} 
                  className={`hidden md:block text-gray-400 mr-2 group-hover:text-gray-600 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className={`absolute top-[calc(100%+0.5rem)] w-60 bg-white border border-gray-200/80 rounded-2xl py-2 z-50 shadow-xl shadow-gray-900/5 animate-in fade-in zoom-in-95 duration-200 ease-out origin-top-right ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0'}`}>
                  <div className="px-4 py-3 border-b border-gray-100 mb-2 md:hidden bg-gray-50/50">
                    <p className="text-sm font-bold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{userEmail || t.nav.role}</p>
                  </div>
                  
                  <div className="hidden md:block px-4 py-2 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Signed in as</p>
                    <p className="text-xs font-medium text-gray-900 truncate">{userEmail}</p>
                  </div>

                  <div className="h-px bg-gray-100 my-1 hidden md:block" />
                  
                  <Link 
                    href={`/${lang}/settings/profile`}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors group"
                  >
                    <Icon name="UserCircleIcon" size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    {t.nav.myProfile}
                  </Link>

                  <div className="px-2 mt-1">
                    <LogoutBtn 
                      lang={lang}
                      onLogout={() => setProfileDropdownOpen(false)}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative">
          
          {/* Subtle loading overlay over the main content */}
          {(loadingPath || isSwitchingLang) && (
            <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none" />
          )}

          {/* Key-based transition wrapper */}
          <div 
            key={pathname} 
            className="h-full animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out"
          >
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}