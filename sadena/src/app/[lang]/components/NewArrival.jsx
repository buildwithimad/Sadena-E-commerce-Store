"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import RevealOnScroll from '@/components/RevealOnScroll';
import Container from '@/components/ui/Container';

export default function NewArrivalsSection({ lang, t, products = [], banners = [] }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const items = products?.slice(0, 8);
  
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

  if (!items?.length) return null;

  return (
    <section 
      dir={dir} 
      className="py-16 sm:py-24 bg-white relative z-10"
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
                {t?.newArrivals?.heading || (lang === 'ar' ? 'جديد سادينا' : 'New from Sadina')}
              </h2>
            </div>

            {/* "View All" Link */}
            <Link
              href={`/${lang}/products?sort=newest`}
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-[var(--foreground)] hover:text-[#5c8b5d] transition-colors duration-300 self-start sm:self-auto"
            >
              <span className="relative pb-1">
                {t?.featured?.viewAll || (lang === 'ar' ? 'عرض الكل' : 'View All')}
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#5c8b5d] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ease-out ${dir === 'rtl' ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'rtl' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
              </svg>
            </Link>
          </div>
        </RevealOnScroll>
      </Container>

      {/* DYNAMIC BANNERS SLIDER (Only renders if admin uploaded banners for this section) */}
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
                  src={banner.image} // Make sure this matches your DB column name (image or image_url)
                  alt={banner.title || 'Sadena Banner'} 
                  className={`w-full h-full object-cover transition-transform duration-[10000ms] ${index === currentSlide ? 'scale-110' : 'scale-100'}`}
                />

                {/* CENTERED TEXT CONTENT INSIDE IMAGE */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                  
                  {/* Banner Subtitle / Eyebrow */}
                  {banner.subtitle && (
                    <span className="text-[#93bfa2] text-sm sm:text-base font-bold tracking-[0.2em] uppercase mb-4 drop-shadow-md">
                      {banner.subtitle}
                    </span>
                  )}

                  {/* Main Slide Title */}
                  {banner.title && (
                    <h3 className="text-white text-4xl sm:text-5xl lg:text-6xl font-display font-bold drop-shadow-lg mb-8 max-w-4xl">
                      {banner.title}
                    </h3>
                  )}

                  {/* Dynamic CTA Button */}
                  <Link
                    href={banner.link || `/${lang}/products?sort=newest`}
                    className="inline-flex items-center gap-3 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105"
                  >
                    {t?.featured?.viewAll || (lang === 'ar' ? 'عرض الكل' : 'View All')}
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
            ))}

            {/* Slider Dots (Only show if more than 1 banner) */}
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

      {/* GRID inside Container for alignment */}
      <Container>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
          {items?.map((product, i) => (
            <RevealOnScroll key={product?.id} delay={Math.min((i % 4) + 1, 4)}>
              <div className="group h-full w-full transition-opacity duration-300 hover:opacity-90 [&_*]:!rounded-none">
                <ProductCard product={product} lang={lang} />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}