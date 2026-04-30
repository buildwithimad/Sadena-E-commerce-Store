import RevealOnScroll from '@/components/RevealOnScroll';
import Container from '@/components/ui/Container';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/data/products';

export default function CategorySection({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Ensure we show 6 categories for the 6-column grid layout
  const displayCategories = CATEGORIES?.slice(0, 6);

  return (
    <section
      id="categories"
      dir={dir}
      // Very light greenish-gray background matching the screenshot
      className="py-16 sm:py-24  relative z-10"
    >
      <Container>
        {/* HEADER - Brush Stroke Style */}
        <RevealOnScroll className="mb-16 flex justify-center">
          <div className="relative inline-flex items-center justify-center px-12 py-3">
            {/* Layered blobs to create a textured brush-stroke effect */}
            <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
            <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
            <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />

            <h2 className="relative z-10 font-display text-xl sm:text-2xl font-bold text-black tracking-tight">
              {t?.categories?.heading || 'Shop by category'}
            </h2>
          </div>
        </RevealOnScroll>

        {/* GRID LAYOUT - Exactly 6 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-10 sm:gap-x-6 max-w-[1400px] mx-auto">
          {displayCategories?.map((cat, i) => (
            <RevealOnScroll key={cat?.id} delay={i + 1}>
              <Link
                href={`/${lang}/category/${cat?.slug || cat?.id}`}
                className="group flex flex-col items-center outline-none"
              >
                {/* CARD CONTAINER - Two-tone background with center stripe */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#e0ebe1] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                  {/* Central Dark Green Stripe */}
                  <div className="absolute top-0 bottom-0 left-[28%] right-[28%] bg-[#5c8b5d]" />

                  {/* Faint curved line matching the screenshot's background detail */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M -10,50 Q 50,110 110,20"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M -10,60 Q 50,120 110,30"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                  </svg>

                  {/* Soft white glare from top corner for depth */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.6)_0%,transparent_60%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  {/* Product Image */}
                  <div className="absolute inset-0 p-4 flex items-center justify-center">
                    <Image
                      src={cat?.image || '/placeholder-category.png'}
                      alt={cat?.name || 'Category'}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-contain p-2 sm:p-3 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 drop-shadow-lg"
                    />
                  </div>
                </div>

                {/* TYPOGRAPHY - Dark blue/teal, placed below the card */}
                <div className="mt-4 sm:mt-5 text-center px-1">
                  <h3 className="font-sans font-medium text-[14px] sm:text-[15px] text-[#1a3b47] group-hover:text-[#5c8b5d] transition-colors duration-300 capitalize tracking-tight">
                    {lang === 'ar' ? cat?.labelAr : cat?.label}
                  </h3>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
