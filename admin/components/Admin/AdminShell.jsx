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

  // --- Dynamic User Display Logic ---
  const userEmail = user?.email || '';
  const rawName = userEmail ? userEmail.split('@')[0] : 'John Doe';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const userInitial = displayName.charAt(0).toUpperCase() || 'J';

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
        customers: 'Customers',
        warehouse: 'Warehouse',
        settings: 'Settings',
        adminProfile: 'Admins',
        activityLogs: 'Activity Logs'
      },
      nav: {
        search: 'Search for orders, products, customers...',
        myProfile: 'My Profile',
        role: 'Admin'
      }
    },
    ar: {
      sidebar: {
        dashboard: 'لوحة القيادة',
        analytics: 'التحليلات',
        categories: 'الفئات',
        orders: 'الطلبات',
        products: 'المنتجات',
        customers: 'العملاء',
        warehouse: 'المخزن',
        settings: 'الإعدادات',
        adminProfile: 'ملف ',
        activityLogs: 'سجلات النشاط'
      },
      nav: {
        search: 'البحث عن الطلبات والمنتجات والعملاء...',
        myProfile: 'ملفي الشخصي',
        role: 'مسؤول'
      }
    }
  };

  const t = translations[lang] || translations.en;

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
    { name: t.sidebar.customers, icon: 'UsersIcon', href: `/${lang}/customers` },
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
        {/* Logo Section */}
        <div className="h-[72px] flex items-center px-6 shrink-0">
          <Link href={`/${lang}`} className="flex items-center gap-2.5 outline-none">
            <img 
              src="/logo.png" 
              alt="Sadena Logo" 
              className="h-8 w-auto object-contain" 
            />
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-gray-400 hover:text-gray-900 p-1.5 rounded-lg active:scale-95"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-6 pb-4 flex flex-col gap-6">
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = item.href === `/${lang}` ? pathname === item.href : pathname.startsWith(item.href);
              const isCurrentlyLoading = loadingPath === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (!isActive) setLoadingPath(item.href);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 outline-none ${
                    isActive 
                      ? 'bg-[#21c45d] text-white shadow-sm shadow-[#21c45d]/20' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {isCurrentlyLoading ? (
                    <Icon name="ArrowPathIcon" size={20} className={`animate-spin ${isActive ? 'text-white' : 'text-[#21c45d]'}`} />
                  ) : (
                    <Icon name={item.icon} size={20} variant={isActive ? 'solid' : 'outline'} className={isActive ? 'text-white' : 'text-gray-400'} />
                  )}
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Menu */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">ADMIN</h3>
            <nav className="space-y-1.5">
              {adminMenuItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const isCurrentlyLoading = loadingPath === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (!isActive) setLoadingPath(item.href);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 outline-none ${
                      isActive 
                        ? 'bg-[#21c45d] text-white shadow-sm shadow-[#21c45d]/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {isCurrentlyLoading ? (
                      <Icon name="ArrowPathIcon" size={20} className={`animate-spin ${isActive ? 'text-white' : 'text-[#21c45d]'}`} />
                    ) : (
                      <Icon name={item.icon} size={20} variant={isActive ? 'solid' : 'outline'} className={isActive ? 'text-white' : 'text-gray-400'} />
                    )}
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Admin Profile Card (Bottom) */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-gray-200 shrink-0 shadow-sm">
              <img src="https://i.pravatar.cc/150?img=11" alt={displayName} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 font-medium truncate">
                Administrator
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${dir === 'rtl' ? 'lg:mr-[260px]' : 'lg:ml-[260px]'}`}>
        
        {/* TOP NAVBAR */}
        <header className="sticky top-0 h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-6 z-30 shrink-0">
          
          {/* Left Side: Toggle & Search */}
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded-xl transition-all outline-none"
            >
              <Icon name="Bars3Icon" size={22} />
            </button>
            
            <div className="hidden sm:flex items-center bg-gray-50 border border-transparent rounded-xl px-4 py-2.5 w-[420px] focus-within:bg-white focus-within:border-gray-200 focus-within:shadow-sm transition-all group">
              <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 group-focus-within:text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder={t.nav.search}
                className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400 font-medium"
              />
              <div className="flex items-center justify-center px-2 py-0.5 rounded-md border border-gray-200 bg-white text-[11px] font-medium text-gray-400 ml-2 shadow-sm">
                ⌘K
              </div>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex items-center gap-5">
            
            <Link
              href={switchLangPath()}
              onClick={() => { if (pathname !== switchLangPath()) setIsSwitchingLang(true); }}
              className="hidden sm:flex items-center justify-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wider"
            >
              {otherLang === 'ar' ? 'عربي' : 'EN'}
            </Link>

            {/* Notification Bell */}
            <button className="relative cursor-pointer p-2 text-gray-500 hover:text-gray-900 transition-colors outline-none group">
              <Icon name="BellIcon" size={24} variant="outline" />
              <span className="absolute top-1.5 right-2 flex items-center justify-center h-4 w-4 rounded-full bg-[#21c45d] border-2 border-white text-[9px] font-bold text-white shadow-sm">
                3
              </span>
            </button>

            <div className="w-px h-8 bg-gray-200 hidden sm:block mx-1" />

            {/* Admin Profile Navbar Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center cursor-pointer gap-3 outline-none transition-all group pl-2 ${profileDropdownOpen ? 'opacity-80' : ''}`}
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0 relative shadow-sm">
                  {/* Mock user avatar from UI reference */}
                  <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="hidden md:flex flex-col items-start pr-1">
                  <span className="text-sm font-semibold text-gray-900 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {t.nav.role}
                  </span>
                </div>
                <Icon 
                  name="ChevronDownIcon" 
                  size={14} 
                  className={`hidden md:block text-gray-400 ml-1 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className={`absolute top-[calc(100%+0.75rem)] w-56 bg-white border border-gray-100 rounded-2xl py-2 z-50 shadow-xl shadow-gray-900/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0'}`}>
                  <div className="px-4 py-3 border-b border-gray-50 mb-1 md:hidden">
                    <p className="text-sm font-bold text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail || t.nav.role}</p>
                  </div>
                  
                  <Link 
                    href={`/${lang}/settings/profile`}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#21c45d] transition-colors"
                  >
                    <Icon name="UserCircleIcon" size={18} className="text-gray-400" />
                    {t.nav.myProfile}
                  </Link>

                  <div className="px-2 mt-1 border-t border-gray-50 pt-1">
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
        <main className="flex-1 p-6 lg:p-8 relative overflow-x-hidden">
          {(loadingPath || isSwitchingLang) && (
            <div className="absolute inset-0 z-20 bg-white/40 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-none" />
          )}

          <div key={pathname} className="h-full animate-in fade-in duration-500 ease-out">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}