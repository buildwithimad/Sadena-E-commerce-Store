'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/store/useCartStore';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';
import { formatPriceSAR } from '@/data/products';

export default function WishlistClientPage({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem, openCart } = useCart();

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: lang === 'ar' ? product.nameAr || product.name : product.name,
      price: product.discountPrice ?? product.price,
      image: product.images?.[0],
      sku: product.sku,
      quantity: 1,
    });
    openCart();
  };

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

            {/* GRID: Flat, minimal, shadow-free */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
              {wishlist.map((product, i) => (
                <RevealOnScroll key={product.id} delay={i + 1} className="group flex flex-col">
                  {/* Image Container - Sharp edges, flat background */}
                  <div className="relative aspect-[4/5] bg-[var(--secondary)]/50 rounded-none overflow-hidden mb-4">
                    {/* Delete Button - Hover to reveal */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-none flex items-center justify-center text-[var(--muted-foreground)] hover:text-red-500 hover:bg-white transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-sm"
                      aria-label={lang === 'ar' ? 'حذف من المفضلة' : 'Remove from wishlist'}
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>

                    {/* Fixed Image to object-cover to fill entirely */}
                    <Image
                      src={product.images?.[0] || '/placeholder.png'}
                      alt={lang === 'ar' ? product.nameAr || product.name : product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />

                    {/* Sale Badge */}
                    {product.discountPrice && product.discountPrice < product.price && (
                      <span
                        className={`absolute top-3 ${dir === 'rtl' ? 'right-3' : 'left-3'} px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#1a3b47] text-white z-10 shadow-sm`}
                      >
                        {lang === 'ar' ? 'تخفيض' : 'Sale'}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1">
                    {/* Title */}
                    <Link href={`/${lang}/product/${product.slug}`} className="outline-none">
                      <h3 className="font-sans font-medium text-[15px] sm:text-base text-[var(--foreground)] leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors mb-2">
                        {lang === 'ar' ? product.nameAr || product.name : product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Icon
                            key={idx}
                            name="StarIcon"
                            size={12}
                            variant="solid"
                            className={
                              idx < Math.round(product.rating || 5)
                                ? 'text-[#5c8b5d]'
                                : 'text-[var(--border)]'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        ({product.reviewsCount || 0})
                      </span>
                    </div>

                    {/* Price & Cart Actions (Pushed to bottom) */}
                    <div className="mt-auto pt-4 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-semibold text-[var(--foreground)]">
                          {formatPriceSAR(product.discountPrice ?? product.price, lang)}
                        </span>
                        {product.discountPrice && product.discountPrice < product.price && (
                          <span className="text-xs text-[var(--muted-foreground)] line-through">
                            {formatPriceSAR(product.price, lang)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-3 bg-transparent border border-[var(--border)] text-[var(--foreground)] text-xs font-bold tracking-widest uppercase rounded-none hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <Icon name="ShoppingBagIcon" size={16} />
                        {t?.wishlist?.addToCart || (lang === 'ar' ? 'أضف للسلة' : 'Add to Cart')}
                      </button>
                    </div>
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
