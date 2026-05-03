import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import RevealOnScroll from '@/components/RevealOnScroll';
import Container from '@/components/ui/Container';

export default function FeaturedProducts({ lang, t, products = [] }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const items = products?.slice(0, 8);

  if (!items?.length) return null;

  return (
    <section 
      dir={dir} 
      className="py-16 sm:py-24 bg-[var(--secondary)] relative z-10"
    >
      <Container>
        <RevealOnScroll className="mb-12 sm:mb-16">
          {/* HEADER: Brush Stroke Style */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            {/* Brush Stroke Title */}
            <div className="relative inline-flex items-center justify-center px-10 py-3 self-start">
              <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
              <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
              <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />
              
              <h2 className="relative z-10 font-display text-xl sm:text-2xl font-bold text-black tracking-tight">
                {t?.featured?.heading || 'Featured Products'}
              </h2>
            </div>

            {/* "View All" Link */}
            <Link
              href={`/${lang}/products`}
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

        {/* GRID: Flat, no borders, no shadows */}
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