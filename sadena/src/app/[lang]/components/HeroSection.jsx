'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      eyebrow: t?.hero?.eyebrow || 'Organic & Natural',
      headline: t?.hero?.headline || 'The best products from Sadina',
      sub: t?.hero?.sub || "Discover Sadina's chemical-free products",
      cta: t?.hero?.cta || 'Shop now',
      image: 'https://images.pexels.com/photos/8329266/pexels-photo-8329266.jpeg', 
    },
    {
      id: 2,
      eyebrow: t?.hero?.eyebrow2 || '100% Pure',
      headline: t?.hero?.headlineSecondary || "Nature's secret for your beauty",
      sub: t?.hero?.subSecondary || 'Nourish your hair and skin with our premium organic line.',
      cta: t?.hero?.cta || 'Shop now',
      image: 'https://images.pexels.com/photos/4871219/pexels-photo-4871219.jpeg',
    },
    {
      id: 3,
      eyebrow: t?.hero?.eyebrow3 || 'Eco-Friendly',
      headline: t?.hero?.headlineTertiary || 'Care crafted from the earth',
      sub: t?.hero?.subTertiary || 'Experience the gentle touch of botanical extracts.',
      cta: t?.hero?.cta || 'Shop now',
      image: 'https://images.pexels.com/photos/4871304/pexels-photo-4871304.jpeg',
    }
  ];

  // Autoplay logic for the carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Slightly longer duration (6s) so the slow zoom can be appreciated
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      dir={dir}
      // Full screen height, hiding overflow for the zoom effect
      className="relative overflow-hidden h-[100svh] min-h-[600px] w-full bg-black mt-14 sm:mt-20"
    >
      {/* Carousel Container */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              
              {/* Full Background Image Layer with "Ken Burns" slow zoom effect */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
                <Image
                  src={slide.image}
                  alt={lang === 'ar' ? 'عناية طبيعية للشعر والبشرة' : 'Natural care for hair and skin'}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className={`object-cover transform transition-transform duration-[10000ms] ease-out ${
                    isActive ? 'scale-105' : 'scale-110'
                  }`}
                />
                {/* Overlay to ensure text readability (dark gradient bottom, slight dark everywhere) */}
                <div className="absolute inset-0 bg-black/30 sm:bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
              </div>

              {/* Text Content Layer */}
              <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-start">
                <div 
                  className={`max-w-xl xl:max-w-2xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                >
                  
                  {/* Eyebrow */}
                  <span className="block text-[11px] sm:text-xs font-bold tracking-[0.25em] text-white/90 uppercase mb-4 sm:mb-6 drop-shadow-md">
                    {slide.eyebrow}
                  </span>

                  {/* Headline */}
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-medium text-white leading-[1.1] tracking-tight drop-shadow-lg mb-6">
                    {slide.headline}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base lg:text-lg text-white/80 font-medium leading-relaxed max-w-[90%] mx-auto lg:mx-0 drop-shadow-md mb-10 lg:mb-12">
                    {slide.sub}
                  </p>

                  {/* Button */}
                  <div className="flex justify-center lg:justify-start">
                    <Link
                      href={`/${lang}/products`}
                      className="group inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white px-10 py-4 sm:px-12 sm:py-5 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-500 hover:bg-white hover:text-black shadow-xl"
                    >
                      {slide.cta}
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ease-out ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'rtl' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
                      </svg>
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Carousel Dots Navigation - Clean lines at the very bottom */}
      <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 z-20 flex justify-center gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 sm:h-1.5 rounded-none transition-all duration-500 ease-out ${
              index === currentSlide 
                ? 'bg-white w-10 sm:w-16 opacity-100' 
                : 'bg-white/40 w-4 sm:w-6 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}