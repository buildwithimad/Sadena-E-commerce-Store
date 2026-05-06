'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/useCartStore'; 
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
    <div dir={dir} className="min-h-screen bg-white pt-24 pb-16 font-sans text-gray-900">
      
      {/* BREADCRUMB */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-10 sm:mb-16">
        <nav className="flex items-center gap-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400">
          <Link href={`/${lang}`} className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${lang}/products`} className="hover:text-gray-900 transition-colors">Products</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="relative w-full aspect-[4/5] bg-gray-50 border border-gray-200 overflow-hidden">
              <Image
                src={product?.images?.[selectedImage] || '/placeholder.png'}
                alt={product.name}
                fill
                priority
                className="object-cover object-center mix-blend-multiply transition-transform duration-700 hover:scale-105"
              />
            </div>
            {product?.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square border transition-all duration-300 ${
                      selectedImage === i ? 'border-gray-900' : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <Image src={img} alt="thumbnail" fill className="object-cover object-center p-2 mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="flex flex-col lg:pt-8">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#21c45d] mb-5">
              {lang === 'ar' ? category?.label_ar : category?.label}
            </p>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 uppercase tracking-wider leading-[1.1]">
              {lang === 'ar' ? product.name_ar : product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-2xl font-bold text-gray-900">{price} SAR</span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  {product.price} SAR
                </span>
              )}
            </div>

            <div className="w-full h-px bg-gray-200 mb-8" />

            {/* FULL DESCRIPTION */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-xl font-medium">
              {lang === 'ar' ? product.description_ar : product.description}
            </p>

            {/* Short Description */}
            {product.shortDescription && (
               <p className="text-[13px] text-gray-500 opacity-80 mb-10 italic border-l-2 border-[#21c45d] pl-4 rtl:pr-4 rtl:pl-0 rtl:border-r-2 rtl:border-l-0">
                  {lang === 'ar' ? product.short_description_ar : product.shortDescription}
               </p>
            )}

            {/* ADD TO CART ACTIONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center border border-gray-200 h-14 w-full sm:w-32 bg-white">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                  className="flex-1 h-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 flex items-center justify-center font-medium outline-none"
                >
                  <Icon name="MinusIcon" size={16} />
                </button>
                <span className="w-12 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)} 
                  className="flex-1 h-full hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900 flex items-center justify-center font-medium outline-none"
                >
                  <Icon name="PlusIcon" size={16} />
                </button>
              </div>

              <div className="flex-1 [&_*]:!rounded-none [&_button]:!h-14">
                <AddToCart
                  product={product}
                  quantity={quantity}
                  variant="outline"
                  disabled={!inStock || isAdding}
                  onAdd={handleAddToCart}
                />
              </div>
            </div>
            
            {/* Meta Info */}
            <div className="flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-gray-400 mt-auto pt-8 border-t border-gray-200">
              <p>SKU: <span className="text-gray-900">{product.sku || 'N/A'}</span></p>
              <p>AVAILABILITY: 
                <span className={inStock ? 'text-[#21c45d] ml-2 rtl:mr-2' : 'text-red-500 ml-2 rtl:mr-2'}>
                  {inStock ? (lang === 'ar' ? 'متوفر' : 'IN STOCK') : (lang === 'ar' ? 'نفذت الكمية' : 'OUT OF STOCK')}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pb-24 border-t border-gray-200 pt-16">
        <div className="flex gap-8 sm:gap-12 border-b border-gray-200 mb-12 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] relative whitespace-nowrap transition-colors outline-none ${
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#21c45d]" />}
            </button>
          ))}
        </div>

        <div className="max-w-4xl text-gray-600 leading-loose font-medium text-sm sm:text-base">
          {activeTab === 'description' && <p>{lang === 'ar' ? product.description_ar : product.description}</p>}
          {activeTab === 'benefits' && (
            <ul className="space-y-3">
              {product.benefits?.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 bg-[#21c45d] mt-2.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'usage' && (
            <ol className="space-y-4 counter-reset-usage">
              {product.usage?.map((u, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-xs font-bold text-gray-400 mt-1">{String(i + 1).padStart(2, '0')}</span>
                  <span>{u}</span>
                </li>
              ))}
            </ol>
          )}
          {activeTab === 'ingredients' && (
            <p className="leading-loose">
              {product.ingredients?.join(' • ')}
            </p>
          )}
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related?.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 pt-20 border-t border-gray-200">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-gray-900">
              {lang === 'ar' ? 'منتجات ذات صلة' : 'RELATED PRODUCTS'}
            </h2>
            <Link 
              href={`/${lang}/products`}
              className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
            >
              {lang === 'ar' ? 'عرض الكل' : 'VIEW ALL'} 
              <Icon name="ArrowLongRightIcon" size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map(p => (
              <div key={p.id} className="[&_*]:!rounded-none group">
                <ProductCard product={p} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}