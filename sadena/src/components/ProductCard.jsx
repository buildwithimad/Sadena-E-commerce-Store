'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/useCartStore';
import { useWishlist } from '@/context/WishlistContext';
import Icon from '@/components/ui/AppIcon';
import { formatPriceSAR, TRANSLATIONS } from '@/data/products';

export default function ProductCard({ product, lang = 'en' }) {
  const t = TRANSLATIONS?.[lang]?.featured || TRANSLATIONS?.en?.featured;
  const { addItem, openCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const name = lang === 'ar' ? product?.nameAr || product?.name : product?.name;
  const badge = product?.isOnSale
    ? lang === 'ar'
      ? 'عرض'
      : 'Offer'
    : product?.isBestSeller
      ? lang === 'ar'
        ? 'الأكثر مبيعاً'
        : 'Best Seller'
      : product?.isFeatured
        ? lang === 'ar'
          ? 'مميز'
          : 'Featured'
        : null;
  const price = product?.discountPrice ?? product?.price;

  const handleQuickAdd = (e) => {
    e?.preventDefault();
    addItem({
      id: product?.id,
      name: lang === 'ar' ? product?.nameAr || product?.name : product?.name,
      price,
      image: product?.images?.[0],
      sku: product?.sku,
    });
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e?.preventDefault();
    if (isInWishlist(product?.id)) {
      removeFromWishlist(product?.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link href={`/${lang}/products/${product?.id}`} className="group block">
      {/* Image */}
      <div className="relative bg-secondary aspect-[3/4] img-zoom-wrap rounded-md overflow-hidden">
        <Image
          src={product?.images?.[0]}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />

        {/* Badge */}
        {badge && (
          <span
            className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-md ${
              product?.isOnSale ? 'bg-red-600 text-white' : 'bg-primary text-primary-foreground'
            }`}
          >
            {badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isInWishlist(product?.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/90 backdrop-blur-sm text-muted-foreground hover:text-red-500'
          }`}
          aria-label={
            isInWishlist(product?.id)
              ? lang === 'ar'
                ? 'حذف من المفضلة'
                : 'Remove from wishlist'
              : lang === 'ar'
                ? 'أضف إلى المفضلة'
                : 'Add to wishlist'
          }
        >
          <Icon
            name="HeartIcon"
            size={16}
            variant={isInWishlist(product?.id) ? 'solid' : 'outline'}
          />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-primary/95 backdrop-blur-sm text-primary-foreground py-3.5 text-xs font-semibold tracking-widest uppercase rounded-b-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {added ? (
              <>
                <Icon name="CheckIcon" size={14} variant="outline" />
                {TRANSLATIONS?.[lang]?.productDetail?.addedToCart || 'Added'}
              </>
            ) : (
              <>
                <Icon name="ShoppingBagIcon" size={14} variant="outline" />
                {t?.quickAdd}
              </>
            )}
          </button>
        </div>
      </div>
      {/* Info */}
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-200 leading-tight">
            {name}
          </h3>
        </div>
        {(product?.shortDescription || product?.shortDescriptionAr) && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {lang === 'ar'
              ? product?.shortDescriptionAr || product?.shortDescription
              : product?.shortDescription}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 })?.map((_, i) => (
              <Icon
                key={i}
                name="StarIcon"
                size={10}
                variant={i < Math.round(product?.rating) ? 'solid' : 'outline'}
                className={i < Math.round(product?.rating) ? 'text-accent' : 'text-border'}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({product?.reviewsCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPriceSAR(price, lang)}
          </span>
          {product?.discountPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPriceSAR(product?.price, lang)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
