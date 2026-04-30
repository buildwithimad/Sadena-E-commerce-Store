'use client';

import { useState } from 'react';
import useCartStore from '@/store/useCartStore';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'react-hot-toast';

export default function AddToCart({ 
  product, 
  variant = 'default', 
  lang = 'en',
  quantity = 1 // 1. Accept quantity prop from parent
}) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [loading, setLoading] = useState(false);

  const isArabic = lang === 'ar';

  const handleAdd = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const cartItem = {
        id: product.id,
        sku: product.sku || product.id,
        name: product.name,
        price: product.discount_price || product.price,
        image: product.images?.[0] || '',
        quantity: quantity, // 2. Use the prop here instead of hardcoded 1
      };

      await addItem(cartItem);
      
      setTimeout(() => {
        setLoading(false);
        openCart();
        if (typeof toast !== 'undefined') {
          toast.success(isArabic ? 'تمت الإضافة للسلة' : 'Added to cart');
        }
      }, 500);
    } catch (err) {
      setLoading(false);
    }
  };

  // ... (rest of the render logic remains the same)
  if (variant === 'icon') {
    return (
      <button 
        onClick={handleAdd}
        disabled={loading}
        className={`bg-white p-2.5 shadow-lg border border-[var(--border)] active:scale-90 transition-all hover:bg-black hover:text-white group flex items-center justify-center ${loading ? 'cursor-not-allowed opacity-80' : ''}`}
      >
        {loading ? (
          <Icon name="ArrowPathIcon" size={18} className="animate-spin text-black group-hover:text-white" />
        ) : (
          <Icon name="PlusIcon" size={18} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`
        relative overflow-hidden flex items-center justify-center gap-2
        w-full py-3 px-6 text-[11px] font-bold uppercase tracking-[0.2em] 
        transition-all duration-300 active:scale-[0.98] 
        ${loading ? 'cursor-not-allowed' : 'hover:shadow-lg'}
        ${variant === 'outline' 
          ? 'bg-transparent border border-black text-black hover:bg-black hover:text-white' 
          : 'bg-black text-white hover:bg-[var(--primary)] border border-transparent'}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2 animate-in fade-in duration-200">
          <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
          <span className="opacity-70">{isArabic ? 'جاري الإضافة...' : 'Adding...'}</span>
        </div>
      ) : (
        <>
          <Icon name="ShoppingBagIcon" size={16} />
          <span>{isArabic ? 'إضافة للسلة' : 'Add to Cart'}</span>
        </>
      )}
    </button>
  );
}