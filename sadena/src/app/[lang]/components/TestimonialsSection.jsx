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

  // Autoplay logic
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Slides every 5 seconds
    return () => clearInterval(timer);
  }, [totalSlides]);

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

        {/* CAROUSEL WRAPPER 
            Uses a custom CSS variable [--visible-items] to perfectly handle responsive sliding 
            without needing complex Javascript window resize listeners.
        */}
        <div className="relative w-full overflow-hidden [--visible-items:1] md:[--visible-items:3]">
          <div 
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] -mx-3 sm:-mx-4"
            style={{
              transform: dir === 'rtl'
                ? `translateX(calc(${currentSlide} * (100% / var(--visible-items))))`
                : `translateX(calc(${currentSlide} * (-100% / var(--visible-items))))`
            }}
          >
            {TESTIMONIALS?.map((review, i) => (
              // Each slide dynamically calculates its width based on the CSS variable
              <div 
                key={review?.id || i} 
                className="w-[calc(100%/var(--visible-items))] shrink-0 px-3 sm:px-4 pb-6 pt-2"
              >
                {/* CARD: Sharp corners, flat white background, subtle hover lift */}
                <div className="group relative bg-white rounded-none border border-[var(--border)]/60 p-8 sm:p-10 flex flex-col justify-between h-full min-h-[260px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)]">
                  
                  {/* Decorative Quote Mark */}
                  <span className="absolute top-6 right-8 text-7xl leading-none text-[var(--secondary)] font-serif opacity-50 pointer-events-none select-none">
                    &rdquo;
                  </span>

                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-5">
                      {Array.from({ length: review?.rating || 5 })?.map((_, j) => (
                        <Icon key={j} name="StarIcon" size={16} variant="solid" className="text-[#5c8b5d]" />
                      ))}
                    </div>
                    
                    {/* Review Text */}
                    <blockquote className="text-[15px] sm:text-base text-[var(--foreground)] leading-relaxed font-medium">
                      {review?.text}
                    </blockquote>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[var(--border)]/50 relative z-10">
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 relative border border-[var(--border)]">
                      <Image
                        src={review?.avatar || '/default-avatar.png'}
                        alt={review?.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm font-bold text-[var(--foreground)] tracking-wide">
                        {review?.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {review?.location}
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAROUSEL DOTS NAVIGATION */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2.5 mt-6 sm:mt-10">
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
    </section>
  );
}