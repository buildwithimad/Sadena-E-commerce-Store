'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/useCartStore';
import Icon from '@/components/ui/AppIcon';
import { formatPriceSAR, TRANSLATIONS } from '@/data/products';

export default function CartDrawer({ lang = 'en' }) {
  const t = TRANSLATIONS?.[lang]?.cart || TRANSLATIONS?.en?.cart;
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const totalPriceValue = totalPrice();
  const drawerRef = useRef(null);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const enterClass = dir === 'rtl' ? 'cart-drawer-enter-rtl' : 'cart-drawer-enter-ltr';
  const FREE_SHIPPING_THRESHOLD = 199;
  const shippingFree = totalPriceValue >= FREE_SHIPPING_THRESHOLD;
  const remaining = FREE_SHIPPING_THRESHOLD - totalPriceValue;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e?.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex" dir={dir}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm overlay-fade transition-opacity duration-500"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`
          absolute top-0 bottom-0 w-[85%] sm:w-[400px] md:w-[420px]
          bg-white flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${dir === 'rtl' ? 'left-0' : 'right-0'}
          ${enterClass}
        `}
        role="dialog"
        aria-modal="true"
        aria-label={t?.title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-lg font-medium uppercase tracking-wider text-[var(--foreground)]">
              {t?.title || (lang === 'ar' ? 'السلة' : 'Cart')}
            </h2>
            {items?.length > 0 && (
              <span className="w-4 h-4 flex items-center justify-center bg-[var(--primary)] text-white text-[9px] font-medium rounded-full">
                {items?.reduce((s, i) => s + i?.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors rounded-full"
            aria-label="Close cart"
          >
            <Icon name="XMarkIcon" size={18} variant="outline" />
          </button>
        </div>

        {/* Shipping Progress */}
        {items?.length > 0 && (
          <div className="px-6 py-4 bg-[var(--secondary)]/30 border-b border-[var(--border)]">
            {shippingFree ? (
              <p className="text-[11px] text-[var(--foreground)] font-medium tracking-wide flex items-center gap-2 uppercase">
                <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-[#5c8b5d]" />
                {t?.freeShippingQualified ||
                  (lang === 'ar' ? 'أنت مؤهل للشحن المجاني!' : 'You qualify for free shipping!')}
              </p>
            ) : (
              <p className="text-[11px] text-[var(--muted-foreground)] uppercase tracking-wide font-medium">
                {(
                  t?.addMoreForFreeShipping ||
                  (lang === 'ar'
                    ? 'أضف {amount} للحصول على الشحن المجاني'
                    : 'Add {amount} more for free shipping')
                ).replace('{amount}', formatPriceSAR(Math.max(0, remaining), lang))}
              </p>
            )}
            <div className="mt-2.5 h-[3px] bg-[var(--border)] rounded-none overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: `${Math.min((totalPriceValue / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-2">
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-2">
                <Icon
                  name="ShoppingBagIcon"
                  size={24}
                  variant="outline"
                  className="text-[var(--muted-foreground)]"
                />
              </div>
              <div>
                <p className="font-display text-lg font-medium text-[var(--foreground)] mb-1">
                  {t?.empty || (lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty')}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] max-w-[220px] mx-auto leading-relaxed">
                  {t?.emptyDesc ||
                    (lang === 'ar'
                      ? 'تصفح منتجاتنا وأضف ما يعجبك هنا.'
                      : 'Browse our products and add your favorites here.')}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-6 px-8 py-3 bg-[var(--primary)] text-white text-[11px] font-medium uppercase tracking-widest hover:bg-[var(--primary-dark)] transition-colors rounded-none"
              >
                {t?.continueShopping || (lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping')}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {items?.map((item) => (
                <li key={`${item?.id}-${item?.sku || ''}`} className="py-5 flex gap-4">
                  {/* Image - Flat edge, cover */}
                  <div className="w-20 h-24 bg-[var(--secondary)]/30 rounded-none shrink-0 overflow-hidden relative border border-[var(--border)]">
                    <Image
                      src={item?.image || '/placeholder.png'}
                      alt={item?.name}
                      fill
                      className="object-cover p-1.5"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 pr-2">
                        <Link
                          href={`/${lang}/product/${item.id}`}
                          onClick={closeCart}
                          className="outline-none"
                        >
                          <p className="text-[13px] font-medium text-[var(--foreground)] leading-snug line-clamp-2 hover:text-[var(--primary)] transition-colors">
                            {item?.name}
                          </p>
                        </Link>
                        {item?.sku && (
                          <p className="text-[10px] text-[var(--muted-foreground)] mt-1 font-mono">
                            {item?.sku}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item?.id, item?.sku)}
                        className="shrink-0 p-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                        aria-label={t?.remove || 'Remove item'}
                      >
                        <Icon name="XMarkIcon" size={14} variant="outline" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      {/* Quantity - Sharp edges */}
                      <div className="flex items-center border border-[var(--border)] rounded-none h-8">
                        <button
                          onClick={() => updateQuantity(item?.id, item?.sku, item?.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Icon name="MinusIcon" size={10} variant="outline" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium text-[var(--foreground)]">
                          {item?.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item?.id, item?.sku, item?.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Icon name="PlusIcon" size={10} variant="outline" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-medium text-[var(--foreground)] tracking-wide">
                        {formatPriceSAR(item?.price * item?.quantity, lang)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items?.length > 0 && (
          <div className="border-t border-[var(--border)] bg-[var(--background)] px-6 py-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.03)]">
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)] font-medium uppercase tracking-wider">
                  {t?.subtotal || (lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal')}
                </span>
                <span className="font-medium text-[var(--foreground)]">
                  {formatPriceSAR(totalPriceValue, lang)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)] font-medium uppercase tracking-wider">
                  {t?.shipping || (lang === 'ar' ? 'الشحن' : 'Shipping')}
                </span>
                <span
                  className={`font-medium ${
                    shippingFree
                      ? 'text-[#5c8b5d] uppercase tracking-widest text-[10px]'
                      : 'text-[var(--foreground)]'
                  }`}
                >
                  {shippingFree
                    ? t?.shippingFree || (lang === 'ar' ? 'مجاني' : 'Free')
                    : formatPriceSAR(25, lang)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[var(--border)]">
                <span className="font-medium text-[var(--foreground)] uppercase tracking-wider text-xs">
                  {t?.orderTotal || (lang === 'ar' ? 'الإجمالي' : 'Total')}
                </span>
                <span className="font-display font-medium text-lg text-[var(--foreground)]">
                  {formatPriceSAR(totalPriceValue + (shippingFree ? 0 : 25), lang)}
                </span>
              </div>
            </div>

            <Link
              href={`/${lang}/checkout`}
              onClick={closeCart}
              className="flex items-center justify-center w-full bg-[var(--primary)] text-white py-3.5 text-xs font-medium tracking-widest uppercase transition-all duration-300 hover:bg-[#1a4a31] rounded-none mb-3"
            >
              {t?.checkout || (lang === 'ar' ? 'إتمام الطلب' : 'Checkout')}
            </Link>

            <button
              onClick={closeCart}
              className="w-full text-center text-[11px] font-medium tracking-widest uppercase text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors pb-1"
            >
              {t?.continueShopping || (lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}