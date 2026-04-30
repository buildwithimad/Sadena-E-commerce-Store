'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore'; // Updated to use your store path
import Icon from '@/components/ui/AppIcon';
import ProductCard from '@/components/ProductCard';
import RevealOnScroll from '@/components/RevealOnScroll';
import AddToCart from '@/components/ui/AddToCart';

export default function ProductDetailClient({ lang, t, product, related }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const td = t?.productDetail;


  console.log('ProductDetailClient rendered with product:', product);

  const isArabic = lang === 'ar';
  
  // Zustand Store
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdding, setIsAdding] = useState(false);

  const price = product?.discountPrice ?? product?.price;
  const hasDiscount = Boolean(product?.discountPrice && product?.discountPrice < product?.price);
  const inStock = (product?.stock ?? 0) > 0;
  const category = product?.category;

  const handleAddToCart = async () => {
    if (!inStock) return;
    setIsAdding(true);

    await addItem({
      id: product.id,
      sku: product.sku || product.id,
      name: product.name,
      price: price,
      image: product.images?.[0] || '',
      quantity: quantity,
    });

    setIsAdding(false);
    openCart();
  };

  const tabs = [
    { id: 'description', label: td?.description || (lang === 'ar' ? 'الوصف' : 'Description') },
    { id: 'benefits', label: td?.benefits || (lang === 'ar' ? 'الفوائد' : 'Benefits') },
    { id: 'usage', label: td?.usage || (lang === 'ar' ? 'طريقة الاستخدام' : 'How to Use') },
    { id: 'ingredients', label: td?.ingredients || (lang === 'ar' ? 'المكونات' : 'Ingredients') },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-16 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <nav className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          <Link href={`/${lang}`} className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <span className="text-[var(--border)]">/</span>
          <Link href={`/${lang}/products`} className="hover:text-[var(--foreground)] transition-colors">Products</Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)] truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/5] bg-[var(--secondary)]/50 overflow-hidden border border-[var(--border)]">
              <Image
                src={product?.images?.[selectedImage] || '/placeholder.png'}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-700 hover:scale-105"
              />
            </div>
            {product?.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square border transition-all ${selectedImage === i ? 'border-black' : 'border-transparent opacity-60'}`}
                  >
                    <Image src={img} alt="thumbnail" fill className="object-cover p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
<div className="flex flex-col">
  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[var(--primary)] mb-4">
    {lang === 'ar' ? category?.label_ar : category?.label}
  </p>
  
  <h1 className="text-3xl sm:text-5xl font-bold text-[var(--foreground)] mb-4 italic uppercase tracking-tighter">
    {lang === 'ar' ? product.name_ar : product.name}
  </h1>

  {/* FULL DESCRIPTION ADDED HERE */}
  <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed mb-8 max-w-xl">
    {lang === 'ar' ? product.description_ar : product.description}
  </p>
  
  <div className="flex items-end gap-4 mb-8">
    <span className="text-3xl font-bold">{price} SAR</span>
    {hasDiscount && <span className="text-xl text-gray-400 line-through">{product.price} SAR</span>}
  </div>

  {/* Short Description can stay here or be removed if you only want the long one above */}
  {product.shortDescription && (
     <p className="text-sm text-[var(--muted-foreground)] opacity-80 mb-8 italic">
        {lang === 'ar' ? product.short_description_ar : product.shortDescription}
     </p>
  )}

  <div className="flex flex-col sm:flex-row gap-4 mb-10">
    <div className="flex items-center border border-[var(--border)] h-[56px] w-full sm:w-32 bg-white">
      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 h-full hover:bg-gray-50 transition-colors">-</button>
      <span className="w-10 text-center font-bold">{quantity}</span>
      <button onClick={() => setQuantity(q => q + 1)} className="flex-1 h-full hover:bg-gray-50 transition-colors">+</button>
    </div>

    <AddToCart
      product={product}
      quantity={quantity}
      variant="outline"
      disabled={!inStock || isAdding}
      onAdd={handleAddToCart}
    />
  </div>
</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 border-t border-[var(--border)] pt-12">
        <div className="flex gap-8 border-b border-[var(--border)] mb-10 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold uppercase tracking-widest relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />}
            </button>
          ))}
        </div>

        <div className="max-w-3xl text-[var(--muted-foreground)] leading-loose">
          {activeTab === 'description' && <p>{product.description}</p>}
          {activeTab === 'benefits' && (
            <ul className="list-disc list-inside space-y-2">
              {product.benefits?.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
          {activeTab === 'usage' && (
            <ol className="list-decimal list-inside space-y-2">
              {product.usage?.map((u, i) => <li key={i}>{u}</li>)}
            </ol>
          )}
          {activeTab === 'ingredients' && <p>{product.ingredients?.join(' • ')}</p>}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-10">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
          </div>
        </div>
      )}
    </div>
  );
}