'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AddToCart from '@/components/ui/AddToCart';

export default function ProductCard({ product, lang }) {
  // Localization logic
  const isArabic = lang === 'ar';
  const currency = lang === 'ar' ? 'ر.س' : 'SAR';

  // Strict number parsing
  const originalPrice = Number(product.price) || 0;
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const hasDiscount = discountPrice !== null && discountPrice < originalPrice;
  
  const showOnSaleBadge = product.is_on_sale || hasDiscount;

  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  // The URL for the details page
  const productUrl = `/${lang}/products/${product.slug}`;

  return (
    <div className="group flex flex-col h-full bg-transparent relative">
      
      {/* 1. IMAGE WRAPPER & NAVIGATION */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--secondary)]/30 mb-4 border border-[var(--border)]">
        
        {/* The main link area for the image */}
        <Link href={productUrl} className="block w-full h-full">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <Icon name="PhotoIcon" size={32} className="text-gray-300" />
            </div>
          )}
        </Link>

        {/* --- BADGES --- */}
        <div className={`absolute top-3 flex flex-col gap-2 z-10 pointer-events-none ${isArabic ? 'right-3' : 'left-3'}`}>
          {product.is_best_seller && (
            <div className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
              {isArabic ? 'الأكثر مبيعاً' : 'Best Seller'}
            </div>
          )}
          {showOnSaleBadge && (
            <div className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
              {isArabic ? 'تخفيض' : 'Sale'} {discountPercentage > 0 && `-${discountPercentage}%`}
            </div>
          )}
        </div>

        {/* --- INTERACTIVE BUTTONS (Stopping Propagation) --- */}
        
        {/* Desktop Add to Cart Slide-up */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 hidden sm:block">
          <AddToCart product={product} lang={lang} />
        </div>

        {/* Mobile Quick Add */}
        <div className="absolute bottom-2 right-2 sm:hidden z-20">
          <AddToCart product={product} lang={lang} variant="icon" />
        </div>

        {/* Wishlist Button */}
        <div className={`absolute top-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 ${isArabic ? 'left-3' : 'right-3'}`}>
          <button 
            onClick={(e) => e.preventDefault()} // Logic for wishlist goes here
            className="bg-white/90 backdrop-blur-sm p-2 text-gray-600 hover:text-rose-500 hover:bg-white transition-colors border border-[var(--border)] shadow-sm"
          >
            <Icon name="HeartIcon" size={18} variant="outline" />
          </button>
        </div>
      </div>

      {/* 2. INFO SECTION & NAVIGATION */}
      <Link href={productUrl} className="flex flex-col flex-1 text-start">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon 
                key={star} 
                name="StarIcon" 
                size={11} 
                variant={star <= Math.round(product.rating || 0) ? 'solid' : 'outline'} 
                className={star <= Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)] font-medium mt-0.5">
            ({product.reviews_count || 0})
          </span>
        </div>

        <h3 className="text-sm font-bold text-[var(--foreground)] line-clamp-1 group-hover:text-[var(--primary)] transition-colors mb-1">
          {product.name}
        </h3>

        <p className="text-[11px] text-[var(--muted-foreground)] line-clamp-1 mb-3">
          {product.description}
        </p>

        <div className="flex items-end gap-2 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-base font-bold text-rose-600">
                {discountPrice} {currency}
              </span>
              <span className="text-xs font-medium text-[var(--muted-foreground)] line-through mb-[2px]">
                {originalPrice} {currency}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-[var(--foreground)]">
              {originalPrice} {currency}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}