'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import AuthModal from '@/components/AuthModal';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/store/useCartStore';
import { useWishlist } from '@/context/WishlistContext';
import { TRANSLATIONS } from '@/data/products';
import { useUser } from '@/context/UserContext';

export default function Navbar({ lang = 'en', categories = [] }) {
  const { user, isLoading: isUserLoading, logout } = useUser();
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;


  console.log("Categories from Navbar", categories)
  
  const { totalItems, openCart } = useCart();
  const cartItemCount = totalItems();
  const { wishlist } = useWishlist();
  const wishlistItems = wishlist.length; 

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  // --- Loading States for Navigation & Actions ---
  const router = useRouter();
  const [isPendingWishlist, startWishlistTransition] = useTransition();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileDropdownRef = useRef(null);
  const pathname = usePathname();
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const getLocalizedPath = () => {
    if (!pathname || pathname === '/') return `/${otherLang}`;
    const segments = pathname.split('/');
    segments[1] = otherLang;
    return segments.join('/');
  };

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body on mobile menu open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const handleWishlistClick = (e) => {
    e.preventDefault();
    if (menuOpen) setMenuOpen(false);
    startWishlistTransition(() => {
      router.push(`/${lang}/wishlist`);
    });
  };

  const handleLogoutClick = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
      setProfileDropdownOpen(false);
    }
  };

  const navLinks = [
    { label: t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home'), href: `/${lang}` },
    { label: t?.nav?.products || (lang === 'ar' ? 'المنتجات' : 'Products'), href: `/${lang}/products` },
    { label: t?.nav?.contact || (lang === 'ar' ? 'اتصل بنا' : 'Contact'), href: `/${lang}/contact` },
    { label: t?.nav?.about || (lang === 'ar' ? 'من نحن' : 'About'), href: `/${lang}/about` },
  ];

  // 🔥 Helper using your EXACT Database Schema (label, label_ar)
 // 🔥 Bulletproof Category Name Helper
const getCategoryName = (cat) => {
  if (lang === 'ar') {
    return cat?.label_ar || cat?.name_ar || cat?.label;
  }
  return cat?.label || cat?.name || cat?.title || 'Unknown Category';
};

  return (
    <>
      <header
        dir={dir}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] py-2 border-b border-[var(--border)]'
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* LEFT: Logo */}
            <div className="flex-1 flex justify-start">
              <Link href={`/${lang}`} className="flex items-center shrink-0 group outline-none">
                <AppLogo size={102} className="transition-transform duration-500 ease-out group-hover:scale-105 active:scale-95" />
              </Link>
            </div>

            {/* CENTER: Desktop Nav */}
            <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-12 flex-1">
              <Link
                href={`/${lang}`}
                className="group relative uppercase py-2 text-[13px] font-semibold tracking-wider text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 outline-none"
              >
                {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
                <span className={`absolute bottom-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${dir === 'rtl' ? 'right-0 origin-right' : 'left-0 origin-left'}`} />
              </Link>

              {/* Desktop Categories Dropdown */}
              <div className="group relative uppercase py-2 outline-none cursor-pointer">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold tracking-wider text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
                  {t?.nav?.categories || (lang === 'ar' ? 'الأقسام' : 'Categories')}
                  <Icon name="ChevronDownIcon" size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>
                <span className={`absolute bottom-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${dir === 'rtl' ? 'right-0 origin-right' : 'left-0 origin-left'}`} />

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                  <div className="bg-white border border-[var(--border)] shadow-xl p-2 w-64 flex flex-col rounded-2xl overflow-hidden">
                    {/* Maps through dynamic database categories */}
                    {categories?.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${lang}/products?category=${cat.slug || cat.id}`}
                        className="block w-full px-4 py-3 text-[13px] font-semibold text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 rounded-lg transition-colors duration-200 text-start active:bg-gray-100"
                      >
                        {getCategoryName(cat)}
                      </Link>
                    ))}
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    <Link
                      href={`/${lang}/products`}
                      className="block w-full px-4 py-3 text-[13px] font-bold text-[var(--primary)] hover:bg-[var(--primary)]/5 rounded-lg transition-colors duration-200 text-start active:bg-[var(--primary)]/10"
                    >
                      {lang === 'ar' ? 'كل المنتجات' : 'All Products'}
                    </Link>
                  </div>
                </div>
              </div>

              {navLinks.slice(2).map((link) => (
                <Link
                  key={link?.href}
                  href={link?.href}
                  className="group relative uppercase py-2 text-[13px] font-semibold tracking-wider text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 outline-none"
                >
                  {link?.label}
                  <span className={`absolute bottom-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${dir === 'rtl' ? 'right-0 origin-right' : 'left-0 origin-left'}`} />
                </Link>
              ))}
            </nav>

            {/* RIGHT: Actions */}
            <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3">
              
              {/* Language Switcher */}
              <Link href={getLocalizedPath()} className="hidden sm:flex items-center px-3 py-1.5 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors tracking-widest uppercase outline-none bg-gray-50 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200 active:scale-95">
                {otherLang === 'ar' ? 'عربي' : 'EN'}
              </Link>

              <div className="h-5 w-px bg-gray-200 hidden sm:block mx-1" />

              {/* USER / AUTH SECTION */}
              <div className="relative flex items-center justify-center" ref={profileDropdownRef}>
                {isUserLoading ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse m-2" />
                ) : user ? (
                  <>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 m-1 rounded-full bg-[var(--foreground)] text-[var(--background)] font-bold text-sm hover:scale-105 active:scale-95 transition-transform outline-none shadow-sm"
                    >
                      {(user?.user_metadata?.full_name || user.email)[0].toUpperCase()}
                    </button>

                    {/* Premium Profile Dropdown */}
                    {profileDropdownOpen && (
                      <div className={`absolute top-full mt-3 w-56 bg-white border border-[var(--border)] rounded-2xl py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Account</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogoutClick}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-start outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoggingOut ? (
                            <Icon name="ArrowPathIcon" size={18} className="animate-spin text-red-500" />
                          ) : (
                            <Icon name="ArrowRightOnRectangleIcon" size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
                          )}
                          {isLoggingOut ? (lang === 'ar' ? 'جاري الخروج...' : 'Logging out...') : (lang === 'ar' ? 'تسجيل الخروج' : 'Logout')}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button onClick={() => setAuthModalOpen(true)} className="p-2 text-[var(--foreground)] transition-colors duration-300 outline-none active:scale-90 group">
                    <Icon name="UserIcon" size={24} variant="outline" className="group-hover:text-[var(--primary)] transition-colors" />
                  </button>
                )}
              </div>
              
              {/* Wishlist Icon */}
              <button onClick={handleWishlistClick} disabled={isPendingWishlist} className="relative p-2 text-[var(--foreground)] transition-colors outline-none active:scale-90 group disabled:opacity-70 disabled:scale-100">
                {isPendingWishlist ? (
                  <Icon name="ArrowPathIcon" size={24} className="animate-spin text-[var(--primary)]" />
                ) : (
                  <Icon name="HeartIcon" size={24} variant="outline" className="group-hover:text-[var(--primary)] transition-colors" />
                )}
                
                {wishlistItems > 0 && !isPendingWishlist && (
                  <span className={`absolute top-1 ${dir === 'rtl' ? 'left-0' : 'right-0'} min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm`}>
                    {wishlistItems}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button onClick={openCart} className="relative p-2 text-[var(--foreground)] transition-colors outline-none active:scale-90 group">
                <Icon name="ShoppingBagIcon" size={24} variant="outline" className="group-hover:text-[var(--primary)] transition-colors" />
                {cartItemCount > 0 && (
                  <span className={`absolute top-1 ${dir === 'rtl' ? 'left-0' : 'right-0'} min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--primary)] text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm`}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-[var(--foreground)] outline-none active:scale-90 group ml-1 rtl:mr-1 rtl:ml-0">
                <Icon name="Bars3Icon" size={26} className="group-hover:text-[var(--primary)] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)} />
      <div className={`fixed top-0 bottom-0 z-50 w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 md:hidden flex flex-col ${dir === 'rtl' ? `right-0 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}` : `left-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}`} dir={dir}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <AppLogo size={102} />
          <button onClick={() => setMenuOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors active:scale-90">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="flex flex-col py-6 px-6 gap-1 text-start overflow-y-auto">
          <Link href={`/${lang}`} onClick={() => setMenuOpen(false)} className="py-3 text-lg font-bold text-[var(--foreground)] border-b border-transparent active:opacity-70">
            {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
          </Link>

          <div className="py-1 border-b border-gray-100">
            <button onClick={() => setCategoriesOpen(!categoriesOpen)} className="w-full flex items-center justify-between py-3 text-lg font-bold text-[var(--foreground)] active:opacity-70">
              {t?.nav?.categories || (lang === 'ar' ? 'الأقسام' : 'Categories')}
              <Icon name="ChevronDownIcon" size={16} className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${categoriesOpen ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
              <div className={`flex flex-col px-4 ${dir === 'rtl' ? 'border-r-2' : 'border-l-2'} border-green-100 space-y-3 mt-2`}>
                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${lang}/products?category=${cat.slug || cat.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-1 text-sm font-medium text-gray-600 hover:text-[var(--primary)] transition-colors active:opacity-70"
                  >
                    {getCategoryName(cat)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link key={link?.href} href={link?.href} onClick={() => setMenuOpen(false)} className="py-3 text-lg font-bold text-[var(--foreground)] border-b border-gray-100 active:opacity-70">
              {link?.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto p-6 bg-gray-50 flex flex-col gap-3">
          <Link href={getLocalizedPath()} onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full px-6 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm uppercase tracking-widest transition-all active:scale-95">
            {otherLang === 'ar' ? 'التبديل للعربية' : 'Switch to English'}
          </Link>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} lang={lang} />
    </>
  );
}