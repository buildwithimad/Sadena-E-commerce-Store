'use client';

import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';
import ProductCard from '@/components/ProductCard';

export default function WishlistClientPage({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const { wishlist } = useWishlist();

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-16 mt-10">
      
      {/* BREADCRUMB - Clean and minimal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <nav className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          <Link href={`/${lang}`} className="hover:text-[var(--foreground)] transition-colors">
            {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)]">
            {t?.wishlist?.heading || (lang === 'ar' ? 'المفضلة' : 'Wishlist')}
          </span>
        </nav>
      </div>

      {/* HEADER: Brush Stroke Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20 flex flex-col items-center">
        <RevealOnScroll className="flex justify-center">
          <div className="relative inline-flex items-center justify-center px-12 py-4">
            <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
            <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
            <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />

            <h1 className="relative z-10 font-display text-3xl sm:text-4xl font-bold text-black tracking-tight">
              {t?.wishlist?.heading || (lang === 'ar' ? 'المفضلة' : 'Wishlist')}
            </h1>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={1}>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-6 text-center">
            {t?.wishlist?.sub ||
              (lang === 'ar'
                ? 'تصفح منتجاتك المفضلة وأضفها إلى السلة بسهولة.'
                : 'Browse your favorite items and easily add them to your cart.')}
          </p>
        </RevealOnScroll>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* EMPTY STATE - Minimalist editorial style */}
        {wishlist.length === 0 ? (
          <RevealOnScroll className="max-w-md mx-auto text-center py-20 px-4">
            <div className="w-24 h-24 mx-auto mb-8 bg-[var(--secondary)] rounded-full flex items-center justify-center">
              <Icon
                name="HeartIcon"
                size={32}
                variant="outline"
                className="text-[var(--muted-foreground)]"
              />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-[var(--foreground)] mb-4">
              {t?.wishlist?.empty || (lang === 'ar' ? 'قائمتك فارغة' : 'Your wishlist is empty')}
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mb-10 leading-relaxed">
              {t?.wishlist?.emptyDesc ||
                (lang === 'ar'
                  ? 'لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. استكشف مجموعتنا واعثر على ما يناسبك.'
                  : 'You haven’t added any items to your wishlist yet. Explore our collection and find something you love.')}
            </p>
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white px-10 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-500 hover:bg-[#1a4a31] hover:-translate-y-1"
            >
              {t?.wishlist?.continueShopping ||
                (lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping')}
              <Icon name="ArrowRightIcon" size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          </RevealOnScroll>
        ) : (
          /* FILLED STATE */
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[var(--muted-foreground)]">
                {lang === 'ar'
                  ? `${wishlist.length} منتجات`
                  : `${wishlist.length} item${wishlist.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {/* GRID: Uses exact identical layout to Best Sellers / Featured Products */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
              {wishlist.map((product, i) => (
                <RevealOnScroll key={product.id} delay={i + 1}>
                  <div className="group h-full w-full transition-opacity duration-300 hover:opacity-90 [&_*]:!rounded-none">
                    <ProductCard product={product} lang={lang} />
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}