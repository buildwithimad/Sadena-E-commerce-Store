"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RevealOnScroll from '@/components/RevealOnScroll';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/ProductCard'; // ✅ Imported ProductCard

export default function WeeklyOfferSection({ lang, t, product, banners = [] }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider logic (only runs if there are multiple banners)
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000); // Changes every 5 seconds
    
    return () => clearInterval(timer);
  }, [banners?.length]);

  if (!product && (!banners || banners.length === 0)) return null;

  return (
    <section 
      dir={dir} 
      className="py-16 sm:py-24 bg-[var(--secondary)] relative z-10"
    >
      {/* HEADER inside Container for alignment */}
      <Container>
        <RevealOnScroll className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            {/* Brush Stroke Title */}
            <div className="relative inline-flex items-center justify-center px-10 py-3 self-start">
              <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
              <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
              <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />
              
              <h2 className="relative z-10 font-display text-xl sm:text-2xl font-bold text-black tracking-tight">
                {t?.weeklyOffer?.heading || (lang === 'ar' ? 'عرض هذا الأسبوع' : "This Week's Special")}
              </h2>
            </div>
          </div>
        </RevealOnScroll>
      </Container>

      {/* DYNAMIC BANNERS SLIDER (100% Full Width) */}
      {banners?.length > 0 && (
        <RevealOnScroll className="w-full mb-12 sm:mb-16">
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden group bg-gray-900">
            {banners.map((banner, index) => (
              <div 
                key={banner.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                
                <img 
                  src={banner.image} 
                  alt={banner.title || 'Sadena Banner'} 
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                />

                {/* CENTERED TEXT CONTENT INSIDE IMAGE */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                  
                  {banner.subtitle && (
                    <span className="text-[#93bfa2] text-sm sm:text-base font-bold tracking-[0.2em] uppercase mb-4 drop-shadow-md">
                      {banner.subtitle}
                    </span>
                  )}

                  {banner.title && (
                    <h3 className="text-white text-4xl sm:text-5xl lg:text-6xl font-display font-bold drop-shadow-lg mb-8 max-w-4xl">
                      {banner.title}
                    </h3>
                  )}

                  {banner.link && (
                    <Link
                      href={banner.link}
                      className="inline-flex items-center gap-3 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105"
                    >
                      {lang === 'ar' ? 'تسوق العرض الآن' : 'Shop Offer Now'}
                      <svg 
                        className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* Slider Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </RevealOnScroll>
      )}

      {/* PRODUCT SPOTLIGHT (Using ProductCard Component) */}
      {product && (
        <Container>
          <RevealOnScroll>
            <div className="bg-[#ecfdf3]/50 border border-[#21c45d]/20 overflow-hidden flex flex-col md:flex-row items-center p-6 sm:p-10 lg:p-16 gap-10 lg:gap-16 group hover:bg-[#ecfdf3]/80 transition-colors duration-500">
              
              {/* Product Card Side */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end order-2 md:order-1">
                <div className="w-full max-w-[340px] bg-white transition-opacity duration-300 hover:opacity-95 [&_*]:!rounded-none shadow-xl shadow-[#21c45d]/10 border border-[#21c45d]/20">
                  {/* ✅ Replaced custom image UI with your powerful ProductCard */}
                  <ProductCard product={product} lang={lang} />
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-start rtl:md:text-right order-1 md:order-2">
                <span className="text-[#5c8b5d] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                  {t?.weeklyOffer?.sub || (lang === 'ar' ? 'منتج مميز بسعر حصري لفترة محدودة' : 'A featured product at an exclusive price for a limited time')}
                </span>
                
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                  {t?.weeklyOffer?.heading || (lang === 'ar' ? 'عرض هذا الأسبوع' : "This Week's Special")}
                </h3>
                
                <p className="text-gray-600 mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
                  {lang === 'ar' 
                    ? 'لا تفوتي فرصتك للحصول على هذا المنتج الرائع بسعر خاص جداً. الكمية محدودة، تسوقي الآن قبل انتهاء العرض!'
                    : 'Do not miss your chance to get this amazing product at a very special price. Limited stock available, shop now before the offer ends!'}
                </p>

                <Link 
                  href={`/${lang}/product/${product.slug}`}
                  className="inline-flex self-center md:self-start items-center justify-center gap-3 px-10 py-4 bg-[#21c45d] text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#1eb053] hover:scale-105"
                >
                  {lang === 'ar' ? 'تسوق العرض الآن' : 'Shop Offer Now'}
                  <svg 
                    className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

            </div>
          </RevealOnScroll>
        </Container>
      )}
    </section>
  );
}