'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';
import { TESTIMONIALS } from '@/data/products';

export default function TestimonialsSection({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = TESTIMONIALS?.length || 0;

  // Autoplay logic (Only visually affects mobile carousel)
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Slides every 5 seconds
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Reusable Review Card Component (Google Reviews Style)
  const ReviewCard = ({ review }) => (
    <div className="bg-white border border-[var(--border)] p-6 sm:p-8 flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300">
      
      {/* Header: User Profile */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden relative border border-gray-100 shrink-0">
            <Image
              src={review?.avatar || '/default-avatar.png'}
              alt={review?.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <p className="text-sm sm:text-[15px] font-bold text-[var(--foreground)] tracking-wide">
              {review?.name}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {review?.location}
            </p>
          </div>
        </div>
        
        {/* Google 'G' Icon Indicator (Optional aesthetic touch) */}
        <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
          <span className="text-gray-400 font-serif font-bold text-xs italic">&rdquo;</span>
        </div>
      </div>

      {/* Stars (Yellow) */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: review?.rating || 5 })?.map((_, j) => (
          <Icon key={j} name="StarIcon" size={14} variant="solid" className="text-amber-400" />
        ))}
        {/* Adds empty stars if rating is less than 5 */}
        {Array.from({ length: 5 - (review?.rating || 5) })?.map((_, j) => (
          <Icon key={`empty-${j}`} name="StarIcon" size={14} variant="outline" className="text-gray-300" />
        ))}
      </div>
      
      {/* Review Text */}
      <blockquote className="text-[13px] sm:text-[15px] text-gray-700 leading-relaxed font-medium">
        {review?.text}
      </blockquote>
      
    </div>
  );

  return (
    <section 
      dir={dir} 
      // Transparent background so the organic pattern shows through
      className="py-16 sm:py-24 bg-transparent relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER: Brush Stroke Style */}
        <RevealOnScroll className="mb-12 sm:mb-16 flex justify-center">
          <div className="relative inline-flex items-center justify-center px-10 py-3">
            <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
            <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
            <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />
            
            <h2 className="relative z-10 font-display text-xl sm:text-2xl font-bold text-black tracking-tight">
              {t?.testimonials?.heading || (lang === 'ar' ? 'آراء العملاء' : 'Customer Reviews')}
            </h2>
          </div>
        </RevealOnScroll>


        {/* =========================================
            DESKTOP VIEW: GOOGLE REVIEWS GRID
            ========================================= */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {TESTIMONIALS?.slice(0, 6).map((review, i) => (
            <RevealOnScroll key={review?.id || i} delay={i + 1}>
              <ReviewCard review={review} />
            </RevealOnScroll>
          ))}
        </div>


        {/* =========================================
            MOBILE/TABLET VIEW: AUTOPLAY CAROUSEL
            ========================================= */}
        <div className="block lg:hidden">
          <div className="relative w-full overflow-hidden [--visible-items:1] md:[--visible-items:2]">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] -mx-2 sm:-mx-3"
              style={{
                transform: dir === 'rtl'
                  ? `translateX(calc(${currentSlide} * (100% / var(--visible-items))))`
                  : `translateX(calc(${currentSlide} * (-100% / var(--visible-items))))`
              }}
            >
              {TESTIMONIALS?.map((review, i) => (
                <div 
                  key={review?.id || i} 
                  className="w-[calc(100%/var(--visible-items))] shrink-0 px-2 sm:px-3 pb-6 pt-2"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* CAROUSEL DOTS NAVIGATION */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2.5 mt-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'bg-[#5c8b5d] w-8' 
                      : 'bg-black/15 w-2 hover:bg-[#5c8b5d]/50'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}