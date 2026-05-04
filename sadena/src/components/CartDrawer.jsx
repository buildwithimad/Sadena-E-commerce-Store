'use client';

import { useEffect, useState, useRef } from 'react';
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
  const FREE_SHIPPING_THRESHOLD = 199;
  const shippingFree = totalPriceValue >= FREE_SHIPPING_THRESHOLD;
  const remaining = FREE_SHIPPING_THRESHOLD - totalPriceValue;

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const [loadingItem, setLoadingItem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsMounted(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const handleQuantityChange = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    
    setLoadingItem(id);
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateQuantity(id, newQty);
    setLoadingItem(null);
  };

  const handleRemoveItem = async (id) => {
    setLoadingItem(id);
    await new Promise((resolve) => setTimeout(resolve, 400));
    removeItem(id);
    setLoadingItem(null);
  };

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex" dir={dir}>
      
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-700 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className={`absolute top-0 bottom-0 w-[90%] sm:w-[440px] md:w-[480px] bg-white flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-l border-r border-[var(--border)]
          ${dir === 'rtl' ? 'left-0' : 'right-0'}
          ${isVisible 
            ? 'translate-x-0' 
            : dir === 'rtl' ? '-translate-x-full' : 'translate-x-full'
          }
        `}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)] bg-[var(--background)]">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-medium uppercase tracking-widest text-[var(--foreground)]">
              {t?.title || (lang === 'ar' ? 'السلة' : 'Cart')}
            </h2>
            {items?.length > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[var(--foreground)] text-[var(--background)] text-[10px] font-medium rounded-full">
                {items?.reduce((s, i) => s + i?.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-[var(--muted-foreground)] hover:text-black hover:bg-gray-50 transition-colors rounded-full"
            aria-label="Close cart"
          >
            <Icon name="XMarkIcon" size={20} variant="outline" />
          </button>
        </div>

        {items?.length > 0 && (
          <div className="px-8 py-4 bg-[var(--secondary)]/40 border-b border-[var(--border)]">
            {shippingFree ? (
              <p className="text-[10px] sm:text-[11px] text-[var(--foreground)] font-medium tracking-widest flex items-center gap-2 uppercase">
                <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-[#5c8b5d]" />
                {t?.freeShippingQualified || (lang === 'ar' ? 'أنت مؤهل للشحن المجاني' : 'You qualify for free shipping')}
              </p>
            ) : (
              <p className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] uppercase tracking-widest font-medium">
                {(
                  t?.addMoreForFreeShipping ||
                  (lang === 'ar'
                    ? 'أضف {amount} للحصول على الشحن المجاني'
                    : 'Add {amount} more for free shipping')
                ).replace('{amount}', formatPriceSAR(Math.max(0, remaining), lang))}
              </p>
            )}
            <div className="mt-3 h-[2px] bg-[var(--border)] rounded-none overflow-hidden">
              <div
                className="h-full bg-[#5c8b5d] rounded-none transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((totalPriceValue / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-2">
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center mb-2">
                <Icon name="ShoppingBagIcon" size={24} variant="outline" className="text-[var(--muted-foreground)]" />
              </div>
              <div>
                <p className="font-display text-lg font-medium text-[var(--foreground)] mb-2">
                  {t?.empty || (lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty')}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] max-w-[240px] mx-auto leading-relaxed">
                  {t?.emptyDesc || (lang === 'ar' ? 'تصفح منتجاتنا وأضف ما يعجبك هنا.' : 'Browse our products and add your favorites here.')}
                </p>
              </div>
              <button
                onClick={closeCart}
                className="mt-6 px-10 py-4 border border-[var(--foreground)] text-[var(--foreground)] text-[10px] font-medium uppercase tracking-widest hover:bg-[var(--foreground)] hover:text-white transition-colors rounded-none"
              >
                {t?.continueShopping || (lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping')}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {items?.map((item) => (
                <li key={item?.id} className="py-6 flex gap-6 relative">
                  
                  {loadingItem === item.id && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center transition-all">
                      <Icon name="ArrowPathIcon" size={20} className="animate-spin text-[var(--primary)]" />
                    </div>
                  )}

                  <div className="w-20 h-24 bg-[var(--secondary)] rounded-none shrink-0 overflow-hidden relative border border-[var(--border)]/50 group">
                    <Image
                      src={item?.image || '/placeholder.png'}
                      alt={item?.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 p-1"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/${lang}/product/${item.id}`} onClick={closeCart} className="outline-none">
                          <h3 className="text-sm font-medium text-[var(--foreground)] leading-relaxed line-clamp-2 hover:text-[var(--primary)] transition-colors">
                            {item?.name}
                          </h3>
                        </Link>
                        {item.sku && <p className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mt-1.5">{item.sku}</p>}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item?.id)}
                        className="shrink-0 p-1.5 text-[var(--muted-foreground)] hover:text-red-400 transition-colors rounded-full"
                        aria-label={t?.remove || 'Remove item'}
                      >
                        <Icon name="XMarkIcon" size={16} variant="outline" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div className="flex items-center border border-[var(--border)] rounded-none h-8 w-24 bg-[var(--background)]">
                        <button
                          onClick={() => handleQuantityChange(item?.id, item?.quantity, -1)}
                          className="w-8 h-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                        >
                          <Icon name="MinusIcon" size={10} variant="outline" />
                        </button>
                        <span className="flex-1 text-center text-xs font-medium text-[var(--foreground)] h-full flex items-center justify-center">
                          {item?.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item?.id, item?.quantity, 1)}
                          className="w-8 h-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)] transition-colors"
                        >
                          <Icon name="PlusIcon" size={10} variant="outline" />
                        </button>
                      </div>

                      <div className="text-right rtl:text-left">
                        <p className="text-sm font-medium text-[var(--foreground)] tracking-wide">
                          {formatPriceSAR(item?.price * item?.quantity, lang)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                            {formatPriceSAR(item.price, lang)} {lang === 'ar' ? 'للقطعة' : 'each'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items?.length > 0 && (
          <div className="border-t border-[var(--border)] bg-[var(--background)] px-8 py-8">
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)] font-medium uppercase tracking-widest text-[10px]">
                  {t?.subtotal || (lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal')}
                </span>
                <span className="font-medium text-[var(--foreground)] tracking-wide">
                  {formatPriceSAR(totalPriceValue, lang)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--muted-foreground)] font-medium uppercase tracking-widest text-[10px]">
                  {t?.shipping || (lang === 'ar' ? 'الشحن' : 'Shipping')}
                </span>
                <span className={`font-medium tracking-wide ${shippingFree ? 'text-[#5c8b5d] uppercase tracking-widest text-[10px]' : 'text-[var(--foreground)]'}`}>
                  {shippingFree ? t?.shippingFree || (lang === 'ar' ? 'مجاني' : 'Free') : formatPriceSAR(25, lang)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-5 mt-2 border-t border-[var(--border)]">
                <span className="font-medium text-[var(--foreground)] uppercase tracking-widest text-xs">
                  {t?.orderTotal || (lang === 'ar' ? 'الإجمالي' : 'Total')}
                </span>
                <span className="font-display font-medium text-xl text-[var(--foreground)] tracking-wide">
                  {formatPriceSAR(totalPriceValue + (shippingFree ? 0 : 25), lang)}
                </span>
              </div>
            </div>

            <Link
              href={`/${lang}/checkout`}
              onClick={closeCart}
              className="flex items-center justify-center w-full bg-[var(--foreground)] text-[var(--background)] py-4 text-[11px] font-medium tracking-widest uppercase transition-all duration-300 hover:bg-[#1a4a31] active:scale-95 rounded-none mb-4"
            >
              {t?.checkout || (lang === 'ar' ? 'إتمام الطلب' : 'Checkout')}
            </Link>

            <button
              onClick={closeCart}
              className="w-full text-center text-[10px] font-medium tracking-widest uppercase text-[var(--muted-foreground)] hover:text-black transition-colors"
            >
              {t?.continueShopping || (lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}