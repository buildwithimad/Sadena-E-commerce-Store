'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCartStore';
import { useWishlist } from '@/context/WishlistContext';
import Icon from '@/components/ui/AppIcon';
import { formatPriceSAR, TRANSLATIONS } from '@/data/products';
import WishlistButton from '@/components/ui/WishlistButton';

export default function ProductCard({ product, lang = 'en' }) {
  const t = TRANSLATIONS?.[lang]?.featured || TRANSLATIONS?.en?.featured;
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // UI States
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Navigation Transition State
  const [isNavigating, startNavigation] = useTransition();

  // Safely handle varying database key formats (camelCase vs snake_case)
  const name = lang === 'ar' ? product?.name_ar || product?.nameAr || product?.name : product?.name;
  const shortDesc = lang === 'ar' ? product?.short_description_ar || product?.shortDescriptionAr || product?.short_description || product?.shortDescription : product?.short_description || product?.shortDescription;
  
  // Pricing Logic
  const originalPrice = product?.price;
  const discountPrice = product?.discount_price || product?.discountPrice;
  const currentPrice = discountPrice ?? originalPrice;
  
  // Badge Logic - Now independent so they can stack!
  const isOnSale = product?.is_on_sale || product?.isOnSale || !!discountPrice;
  const isBestSeller = product?.is_best_seller || product?.isBestSeller;
  const isFeatured = product?.is_featured || product?.isFeatured;

  // Calculate discount percentage if on sale
  const discountPercentage = (isOnSale && originalPrice && discountPrice && originalPrice > discountPrice)
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : null;

  // Add to Cart Logic
  const handleQuickAdd = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isAdding || added || isNavigating) return;

    setIsAdding(true);

    // Small simulated delay for premium UX feel
    await new Promise(resolve => setTimeout(resolve, 400));

    addItem({
      id: product?.id,
      name: name,
      price: currentPrice,
      image: product?.images?.[0] || '/placeholder.png',
      sku: product?.sku,
    });

    setIsAdding(false);
    setAdded(true);
    openCart();

    // Reset button after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  // Handle Card Click (Route Transition)
  const handleCardClick = (e) => {
    // Allow standard "open in new tab" behavior without showing loading state
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    startNavigation(() => {
      router.push(`/${lang}/products/${product?.slug}`);
    });
  };

  return (
    // Replaced outer <Link> with <div> so we can split click areas for Mobile vs Desktop
    <div className="group relative flex flex-col h-full outline-none">
      
      {/* LOADING OVERLAY - Covers entire card when navigating */}
      {isNavigating && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-md transition-opacity duration-300">
          <Icon name="ArrowPathIcon" size={36} className="animate-spin text-primary drop-shadow-md" />
        </div>
      )}

      {/* Image Container */}
      <div className="relative bg-secondary aspect-[3/4] img-zoom-wrap rounded-md overflow-hidden">
        
        {/* DESKTOP-ONLY LINK: Covers the image only on large screens */}
        <Link 
          href={`/${lang}/products/${product?.slug}`}
          onClick={handleCardClick}
          className="hidden lg:block absolute inset-0 z-10 cursor-pointer"
          aria-label={name}
        />

        <Image
          src={product?.images?.[0] || '/placeholder.png'}
          alt={name || 'Product'}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 pointer-events-none"
        />

        {/* STACKED BADGES (Top Left/Right) */}
        <div className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} z-20 flex flex-col gap-1.5 items-start pointer-events-none`}>
          {isBestSeller && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-black text-white shadow-sm">
              {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
            </span>
          )}
          
          {isOnSale && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-red-600 text-white shadow-sm">
              {lang === 'ar' ? 'تخفيض' : 'Sale'} {discountPercentage ? `-${discountPercentage}%` : ''}
            </span>
          )}

          {isFeatured && !isBestSeller && !isOnSale && (
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm bg-primary text-primary-foreground shadow-sm">
              {lang === 'ar' ? 'مميز' : 'Featured'}
            </span>
          )}
        </div>

        {/* Wishlist Button - Increased touch target size with p-3 */}
        <div 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
          className="absolute top-0 right-0 rtl:left-0 rtl:right-auto z-30 p-3 cursor-pointer"
        >
          <WishlistButton product={product} size={24} />
        </div>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-30">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || isNavigating}
            className="w-full bg-primary/95 backdrop-blur-sm text-primary-foreground py-3.5 text-xs font-semibold tracking-widest uppercase rounded-b-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {isAdding ? (
              <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
            ) : added ? (
              <>
                <Icon name="CheckIcon" size={14} variant="outline" />
                {TRANSLATIONS?.[lang]?.productDetail?.addedToCart || (lang === 'ar' ? 'تمت الإضافة' : 'Added')}
              </>
            ) : (
              <>
                <Icon name="ShoppingBagIcon" size={14} variant="outline" />
                {t?.quickAdd || (lang === 'ar' ? 'أضف للسلة' : 'Quick Add')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Section - Always a link so mobile users tap text to view product */}
      <Link 
        href={`/${lang}/products/${product?.slug}`}
        onClick={handleCardClick}
        className="mt-3 flex flex-col flex-1 space-y-1 relative z-10 outline-none"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200 leading-tight line-clamp-1">
            {name}
          </h3>
        </div>
        
        {shortDesc && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {shortDesc}
          </p>
        )}

        <div className="mt-auto pt-2 flex flex-col gap-1">
          {/* Rating (Yellow Stars) */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 })?.map((_, i) => {
                const rating = Number(product?.rating) || 0;
                const isFilled = i < Math.round(rating);
                return (
                  <Icon
                    key={i}
                    name="StarIcon"
                    size={10}
                    variant={isFilled ? 'solid' : 'outline'}
                    className={isFilled ? 'text-amber-400' : 'text-border'}
                  />
                );
              })}
            </div>
            <span className="text-[10px] text-muted-foreground">
              ({product?.reviews_count || product?.reviewsCount || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${discountPrice ? 'text-red-600' : 'text-foreground'}`}>
              {formatPriceSAR(currentPrice, lang)}
            </span>
            {discountPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPriceSAR(originalPrice, lang)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}