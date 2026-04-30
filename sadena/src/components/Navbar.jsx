'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import AuthModal from '@/components/AuthModal';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/store/useCartStore';
import { useWishlist } from '@/context/WishlistContext';
import { TRANSLATIONS } from '@/data/products';

export default function Navbar({ lang = 'en', categories = [] }) {
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;
  const { totalItems, openCart } = useCart();
  const cartItemCount = totalItems();
  const { totalItems: wishlistItems } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const pathname = usePathname();
  const otherLang = lang === 'en' ? 'ar' : 'en';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const getLocalizedPath = () => {
    if (!pathname || pathname === '/') return `/${otherLang}`;
    const segments = pathname.split('/');
    segments[1] = otherLang;
    return segments.join('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [menuOpen]);

  const navLinks = [
    { label: t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home'), href: `/${lang}` },
    { label: t?.nav?.products || (lang === 'ar' ? 'المنتجات' : 'Products'), href: `/${lang}/products` },
    { label: t?.nav?.contact || (lang === 'ar' ? 'اتصل بنا' : 'Contact'), href: `/${lang}/contact` },
    { label: t?.nav?.about || (lang === 'ar' ? 'من نحن' : 'About'), href: `/${lang}/about` },
  ];

  return (
    <>
      <header
        dir={dir}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm py-2 border-b border-[var(--border)]'
            : 'bg-white/80 backdrop-blur-sm border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex-1 flex justify-start">
              <Link href={`/${lang}`} className="flex items-center shrink-0 group outline-none">
                <AppLogo size={102} className="transition-transform duration-500 ease-out group-hover:scale-105" />
              </Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-12 flex-1">
              <Link
                href={`/${lang}`}
                className="group relative uppercase py-2 text-xs font-semibold tracking-wide text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 outline-none"
              >
                {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
                <span className={`absolute bottom-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${dir === 'rtl' ? 'right-0 origin-right' : 'left-0 origin-left'}`} />
              </Link>

              {/* Desktop Categories Dropdown */}
              <div className="group relative uppercase py-2 outline-none cursor-pointer">
                <div className="flex items-center gap-1 text-xs font-semibold tracking-wide text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
                  {t?.nav?.categories || (lang === 'ar' ? 'الأقسام' : 'Categories')}
                  <Icon name="ChevronDownIcon" size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </div>
                <span className={`absolute bottom-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${dir === 'rtl' ? 'right-0 origin-right' : 'left-0 origin-left'}`} />

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50">
                  <div className="bg-white border border-[var(--border)] shadow-xl p-2 w-56 flex flex-col rounded-xl overflow-hidden">
                    {/* 🔥 FIX: Mapping through dynamic categories and using SLUG */}
                   {categories?.map((cat) => (
  <Link
    key={cat.id}
    href={`/${lang}/products?category=${cat.slug}`}
    // Changed text color to gray-900 for better visibility
    className="px-4 py-3 text-[13px] font-semibold text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors duration-200 text-start"
  >
    {/* 🔥 FIX: Changed cat.labelAr to cat.label_ar */}
    {lang === 'ar' ? cat.label_ar || cat.label : cat.label}
  </Link>
))}
                    <div className="h-px bg-[var(--border)] my-1 mx-2" />
                    <Link
                      href={`/${lang}/products`}
                      className="px-4 py-3 text-[13px] font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-200 text-start"
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
                  className="group relative uppercase py-2 text-xs font-semibold tracking-wide text-[var(--foreground)] hover:text-[var(--primary)] transition-colors duration-300 outline-none"
                >
                  {link?.label}
                  <span className={`absolute bottom-0 w-full h-[2px] bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${dir === 'rtl' ? 'right-0 origin-right' : 'left-0 origin-left'}`} />
                </Link>
              ))}
            </nav>

            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4">
              <Link href={getLocalizedPath()} className="hidden sm:flex items-center px-2 py-1 text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors tracking-widest uppercase outline-none">
                {otherLang === 'ar' ? 'عربي' : 'EN'}
              </Link>

              <button onClick={() => setAuthModalOpen(true)} className="p-2 text-[var(--foreground)] transition-colors duration-300 outline-none">
                <Icon name="UserIcon" size={24} variant="outline" className="hover:text-[var(--primary)]" />
              </button>

              <Link href={`/${lang}/wishlist`} className="relative p-2 text-[var(--foreground)] transition-colors outline-none">
                <Icon name="HeartIcon" size={24} variant="outline" className="hover:text-[var(--primary)]" />
                {wishlistItems > 0 && (
                  <span className={`absolute top-1 ${dir === 'rtl' ? 'left-0' : 'right-0'} min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white`}>
                    {wishlistItems}
                  </span>
                )}
              </Link>

              <button onClick={openCart} className="relative p-2 text-[var(--foreground)] transition-colors outline-none">
                <Icon name="ShoppingBagIcon" size={24} variant="outline" className="hover:text-[var(--primary)]" />
                {cartItemCount > 0 && (
                  <span className={`absolute top-1 ${dir === 'rtl' ? 'left-0' : 'right-0'} min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--primary)] text-white text-[10px] font-bold rounded-full border-2 border-white`}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMenuOpen(true)} className="md:hidden p-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors outline-none">
                <Icon name="Bars3Icon" size={26} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMenuOpen(false)} />
      <div className={`fixed top-0 bottom-0 z-50 w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 md:hidden flex flex-col ${dir === 'rtl' ? `right-0 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}` : `left-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}`} dir={dir}>
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <AppLogo size={102} />
          <button onClick={() => setMenuOpen(false)} className="p-2 bg-[var(--secondary)] rounded-full text-[var(--muted-foreground)]">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="flex flex-col py-6 px-6 gap-2 text-start overflow-y-auto">
          <Link href={`/${lang}`} onClick={() => setMenuOpen(false)} className="py-4 text-xl font-display font-medium text-[var(--foreground)] border-b border-transparent">
            {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
          </Link>

          <div className="py-2">
            <button onClick={() => setCategoriesOpen(!categoriesOpen)} className="w-full flex items-center justify-between py-2 text-xl font-display font-medium text-[var(--foreground)]">
              {t?.nav?.categories || (lang === 'ar' ? 'الأقسام' : 'Categories')}
              <Icon name="ChevronDownIcon" size={16} className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${categoriesOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
              <div className={`flex flex-col px-4 ${dir === 'rtl' ? 'border-r-2' : 'border-l-2'} border-[var(--secondary)] space-y-3 mt-2`}>
                {/* 🔥 FIX: Using cat.slug for Mobile Drawer links */}
                {categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/${lang}/products?category=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-base text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {lang === 'ar' ? cat.label_ar || cat.label : cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {navLinks.slice(1).map((link) => (
            <Link key={link?.href} href={link?.href} onClick={() => setMenuOpen(false)} className="py-4 text-xl font-display font-medium text-[var(--foreground)]">
              {link?.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto p-6 border-t border-[var(--border)] bg-[var(--secondary)]/30">
          <Link href={getLocalizedPath()} onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-full px-6 py-4 bg-white border border-[var(--border)] rounded-full text-sm font-semibold shadow-sm uppercase tracking-widest transition-all">
            {otherLang === 'ar' ? 'التبديل للعربية' : 'Switch to English'}
          </Link>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} lang={lang} />
    </>
  );
}