'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';

const PRICE_RANGES = [
  { label: 'Under 50 SAR', labelAr: 'أقل من 50 ر.س', value: '0-50' },
  { label: '50 – 80 SAR', labelAr: '50 – 80 ر.س', value: '50-80' },
  { label: '80 – 120 SAR', labelAr: '80 – 120 ر.س', value: '80-120' },
  { label: '120+ SAR', labelAr: '120+ ر.س', value: '120-' },
];

export default function ProductsClientPage({ 
  lang, t, categories, products, total, page, limit, 
  currentCategory, currentPrice, currentSort 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterOpen, setFilterOpen] = useState(false);

  // --- Loading States ---
  const [pendingFilter, setPendingFilter] = useState(null); 
  const [pendingProduct, setPendingProduct] = useState(null); 
  const [pendingPage, setPendingPage] = useState(null); 
  const [pendingSort, setPendingSort] = useState(false);

  // Combined state to show overlay on the main grid
  const isFetchingGrid = !!pendingFilter || !!pendingPage || pendingSort;

  const totalPages = Math.ceil(total / limit);

  // Clear all fetching states when the URL search params change (server responded with data)
  useEffect(() => {
    setPendingFilter(null);
    setPendingPage(null);
    setPendingSort(false);
  }, [searchParams]);

  // Clear product loading state when pathname changes
  useEffect(() => {
    setPendingProduct(null);
  }, [pathname]);

  // --- URL Update Function ---
  const updateQueryString = (name, value, loadingKey) => {
    if (loadingKey) setPendingFilter(loadingKey);
    
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 if changing a filter
    if (name !== 'page') params.set('page', '1');

    if (value && value !== 'all') {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Push new URL
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleProductClick = (e, product) => {
    if (e.target.closest('button')) return; // Ignore add to cart clicks
    setPendingProduct(product.id);
    router.push(`/${lang}/products/${product.slug}`);
  };

  const sortOptions = [
    { value: 'featured', label: t?.products?.sortOptions?.featured || (lang === 'ar' ? 'المميزة' : 'Featured') },
    { value: 'priceLow', label: t?.products?.sortOptions?.priceLow || (lang === 'ar' ? 'السعر: من الأقل للأعلى' : 'Price: Low to High') },
    { value: 'priceHigh', label: t?.products?.sortOptions?.priceHigh || (lang === 'ar' ? 'السعر: من الأعلى للأقل' : 'Price: High to Low') },
    { value: 'newest', label: t?.products?.sortOptions?.newest || (lang === 'ar' ? 'الأحدث' : 'Newest Arrivals') },
    { value: 'rating', label: t?.products?.sortOptions?.rating || (lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated') },
  ];

  const allCategories = [
    { slug: 'all', name: t?.products?.allCategories || (lang === 'ar' ? 'كل الأقسام' : 'All Categories') },
    ...categories,
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-16 mt-10">
      
      {/* BREADCRUMB */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <nav className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          <Link href={`/${lang}`} className="hover:text-[var(--foreground)] transition-colors">
            {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)]">
            {t?.nav?.products || (lang === 'ar' ? 'المنتجات' : 'Products')}
          </span>
        </nav>
      </div>

      {/* HEADER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20 flex flex-col items-center">
        <RevealOnScroll className="flex justify-center">
          <div className="relative inline-flex items-center justify-center px-12 py-4">
            <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
            <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
            <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />
            <h1 className="relative z-10 font-display text-3xl sm:text-4xl font-bold text-black tracking-tight text-center">
              {t?.products?.heading || (lang === 'ar' ? 'مجموعتنا الكاملة' : 'Our Collection')}
            </h1>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={1}>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-6 text-center max-w-2xl">
            {t?.products?.sub || (lang === 'ar' ? 'اكتشف مجموعتنا المتميزة من المنتجات الطبيعية والعضوية.' : 'Discover our premium selection of natural and organic products.')}
          </p>
        </RevealOnScroll>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* TOOLBAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border border-[var(--border)] text-sm font-bold tracking-widest uppercase text-[var(--foreground)] hover:border-[var(--primary)] transition-colors rounded-none outline-none"
            >
              <Icon name="AdjustmentsHorizontalIcon" size={18} variant="outline" />
              {t?.products?.filter || (lang === 'ar' ? 'تصفية' : 'Filters')}
            </button>
            <p className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-widest hidden sm:block">
              {lang === 'ar' ? `عرض ${total} منتجات` : `Showing ${total} Products`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="hidden sm:block text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)]">
              {t?.products?.sort || (lang === 'ar' ? 'ترتيب حسب:' : 'Sort By:')}
            </span>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => {
                  setPendingSort(true);
                  updateQueryString('sort', e.target.value);
                }}
                disabled={isFetchingGrid}
                className="appearance-none bg-transparent border border-[var(--border)] text-[var(--foreground)] text-xs font-bold uppercase tracking-widest pl-4 pr-10 py-3 focus:outline-none focus:border-[var(--primary)] cursor-pointer rounded-none transition-colors w-full sm:w-auto disabled:opacity-50"
              >
                {sortOptions?.map((opt) => (
                  <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
                ))}
              </select>
              {pendingSort ? (
                 <Icon name="ArrowPathIcon" size={14} className="absolute top-1/2 -translate-y-1/2 right-4 animate-spin text-[var(--primary)] pointer-events-none" />
              ) : (
                 <Icon name="ChevronDownIcon" size={14} className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none text-[var(--foreground)]" />
              )}
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="flex gap-10 xl:gap-14 items-start">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-60 shrink-0 sticky top-28">
            {/* Categories */}
            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-3">
                {lang === 'ar' ? 'الأقسام' : 'Categories'}
              </h3>
              <ul className="space-y-4">
                {allCategories?.map((cat) => {
                  const isCurrent = currentCategory === cat.slug;
                  const isLoading = pendingFilter === `category-${cat.slug}`;
                  
                  return (
                    <li key={cat?.slug}>
                      <button
                        disabled={isFetchingGrid}
                        onClick={() => updateQueryString('category', cat.slug, `category-${cat.slug}`)}
                        className={`w-full flex items-center justify-between text-start text-sm transition-all duration-300 outline-none group disabled:cursor-not-allowed ${
                          isCurrent
                            ? 'text-[var(--primary)] font-bold'
                            : 'text-[var(--muted-foreground)] font-medium hover:text-[var(--foreground)]'
                        } ${isLoading ? 'opacity-70' : ''}`}
                      >
                        <span className="relative">
                          {cat.name}
                          <span className={`absolute left-0 -bottom-1 h-[1px] bg-[var(--primary)] transition-all duration-300 ${isCurrent ? 'w-full' : 'w-0 group-hover:w-full group-disabled:w-0'}`} />
                        </span>
                        
                        {isLoading ? (
                          <Icon name="ArrowPathIcon" size={14} className="animate-spin text-[var(--primary)]" />
                        ) : isCurrent ? (
                          <Icon name="CheckIcon" size={14} className="text-[var(--primary)]" />
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)] mb-6 border-b border-[var(--border)] pb-3">
                {lang === 'ar' ? 'السعر' : 'Price'}
              </h3>
              <ul className="space-y-4">
                <li>
                  <button
                    disabled={isFetchingGrid}
                    onClick={() => updateQueryString('price', null, 'price-all')}
                    className={`w-full flex items-center justify-between text-start text-sm transition-all duration-300 outline-none group disabled:cursor-not-allowed ${
                      !currentPrice ? 'text-[var(--primary)] font-bold' : 'text-[var(--muted-foreground)] font-medium hover:text-[var(--foreground)]'
                    }`}
                  >
                    <span className="relative">
                      {lang === 'ar' ? 'جميع الأسعار' : 'All Prices'}
                      <span className={`absolute left-0 -bottom-1 h-[1px] bg-[var(--primary)] transition-all duration-300 ${!currentPrice ? 'w-full' : 'w-0 group-hover:w-full group-disabled:w-0'}`} />
                    </span>
                    {pendingFilter === 'price-all' ? (
                      <Icon name="ArrowPathIcon" size={14} className="animate-spin text-[var(--primary)]" />
                    ) : !currentPrice ? (
                      <Icon name="CheckIcon" size={14} className="text-[var(--primary)]" />
                    ) : null}
                  </button>
                </li>
                {PRICE_RANGES?.map((range) => {
                  const isCurrent = currentPrice === range.value;
                  const isLoading = pendingFilter === `price-${range.value}`;

                  return (
                    <li key={range.value}>
                      <button
                        disabled={isFetchingGrid}
                        onClick={() => updateQueryString('price', range.value, `price-${range.value}`)}
                        className={`w-full flex items-center justify-between text-start text-sm transition-all duration-300 outline-none group disabled:cursor-not-allowed ${
                          isCurrent
                            ? 'text-[var(--primary)] font-bold'
                            : 'text-[var(--muted-foreground)] font-medium hover:text-[var(--foreground)]'
                        } ${isLoading ? 'opacity-70' : ''}`}
                      >
                        <span className="relative">
                          {lang === 'ar' ? range.labelAr : range.label}
                          <span className={`absolute left-0 -bottom-1 h-[1px] bg-[var(--primary)] transition-all duration-300 ${isCurrent ? 'w-full' : 'w-0 group-hover:w-full group-disabled:w-0'}`} />
                        </span>
                        {isLoading ? (
                          <Icon name="ArrowPathIcon" size={14} className="animate-spin text-[var(--primary)]" />
                        ) : isCurrent ? (
                          <Icon name="CheckIcon" size={14} className="text-[var(--primary)]" />
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          {/* PRODUCT GRID & LOADING OVERLAY */}
          <div className="flex-1 min-w-0 relative min-h-[500px]">
            
            {/* 🟢 Grid Loading Overlay (Updated to match global loading.js) */}
            {isFetchingGrid && (
              <div className="absolute inset-0 z-30 bg-[var(--background)]/60 backdrop-blur-[2px] flex items-start justify-center pt-32 animate-in fade-in duration-300">
                <div className="flex flex-col items-center gap-4 animate-in zoom-in-[98%] duration-300 ease-out">
                  <Icon name="ArrowPathIcon" size={48} className="animate-spin text-[var(--primary)] drop-shadow-md" />
                  <p className="text-xs font-bold text-[var(--muted-foreground)] tracking-widest uppercase animate-pulse">
                    {lang === 'ar' ? 'جاري التحديث...' : 'Updating...'}
                  </p>
                </div>
              </div>
            )}

            {products?.length === 0 ? (
              <div className="text-center py-32 px-4 border border-[var(--border)] bg-[var(--secondary)]/30">
                <Icon name="MagnifyingGlassIcon" size={48} variant="outline" className="mx-auto text-[var(--border)] mb-6" />
                <p className="font-display text-2xl font-medium text-[var(--foreground)] mb-2">
                  {lang === 'ar' ? 'لا توجد نتائج' : 'No products found'}
                </p>
                <p className="text-[var(--muted-foreground)]">
                  {lang === 'ar' ? 'جرب تغيير خيارات التصفية للعثور على ما تبحث عنه.' : 'Try adjusting your filters to find what you are looking for.'}
                </p>
                <button 
                  onClick={() => router.push(pathname)}
                  className="mt-8 text-sm font-bold tracking-widest uppercase text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1 hover:text-[var(--primary-dark)] hover:border-[var(--primary-dark)] transition-colors"
                >
                  {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8">
                  {products?.map((product, i) => (
                    <RevealOnScroll key={product?.id} delay={(i % 8) + 1}>
                      <div 
                        onClick={(e) => handleProductClick(e, product)}
                        className="group relative h-full w-full transition-opacity duration-300 hover:opacity-90 [&_*]:!rounded-none cursor-pointer"
                      >
                        <ProductCard product={product} lang={lang} />
                        
                        {/* Individual Product Click Overlay (Updated theme support) */}
                        {pendingProduct === product.id && (
                          <div className="absolute inset-0 z-20 bg-[var(--background)]/50 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in zoom-in-[98%] duration-200">
                            <Icon name="ArrowPathIcon" size={32} className="animate-spin text-[var(--primary)] drop-shadow-md" />
                          </div>
                        )}
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>

                {/* PAGINATION UI */}
                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-2">
                    <button
                      disabled={page === 1 || isFetchingGrid}
                      onClick={() => {
                        setPendingPage('prev');
                        updateQueryString('page', page - 1);
                      }}
                      className="flex items-center justify-center min-w-[80px] px-4 py-2 border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--primary)] transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      {pendingPage === 'prev' ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : (lang === 'ar' ? 'السابق' : 'Prev')}
                    </button>
                    
                    <span className="px-4 text-sm font-bold text-[var(--muted-foreground)]">
                      {page} / {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages || isFetchingGrid}
                      onClick={() => {
                        setPendingPage('next');
                        updateQueryString('page', page + 1);
                      }}
                      className="flex items-center justify-center min-w-[80px] px-4 py-2 border border-[var(--border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--primary)] transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      {pendingPage === 'next' ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : (lang === 'ar' ? 'التالي' : 'Next')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setFilterOpen(false)}
        aria-hidden="true"
      />
      
      <div
        className={`fixed top-0 bottom-0 z-50 w-[85%] max-w-sm bg-[var(--background)] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden flex flex-col ${
          dir === 'rtl' 
            ? `right-0 ${filterOpen ? 'translate-x-0' : 'translate-x-full'}` 
            : `left-0 ${filterOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
        dir={dir}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="font-display text-xl font-bold uppercase tracking-widest text-[var(--foreground)]">
            {t?.products?.filter || (lang === 'ar' ? 'تصفية' : 'Filters')}
          </h2>
          <button
            onClick={() => setFilterOpen(false)}
            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors bg-[var(--secondary)] rounded-full"
            aria-label="Close filters"
          >
            <Icon name="XMarkIcon" size={20} variant="outline" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-5">
              {lang === 'ar' ? 'الأقسام' : 'Categories'}
            </h3>
            <ul className="space-y-4">
              {allCategories?.map((cat) => {
                const isCurrent = currentCategory === cat.slug;
                const isLoading = pendingFilter === `mobile-category-${cat.slug}`;

                return (
                  <li key={cat.slug}>
                    <button
                      disabled={isFetchingGrid}
                      onClick={() => { updateQueryString('category', cat.slug, `mobile-category-${cat.slug}`); setFilterOpen(false); }}
                      className={`w-full flex items-center justify-between text-start text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isCurrent ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground)] font-medium'
                      }`}
                    >
                      {cat.name}
                      {isLoading ? (
                        <Icon name="ArrowPathIcon" size={16} className="animate-spin text-[var(--primary)]" />
                      ) : isCurrent ? (
                         <Icon name="CheckIcon" size={16} className="text-[var(--primary)]" />
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="w-full h-px bg-[var(--border)]" />

          {/* Price */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-5">
              {lang === 'ar' ? 'السعر' : 'Price Range'}
            </h3>
            <ul className="space-y-4">
              <li>
                <button
                  disabled={isFetchingGrid}
                  onClick={() => { updateQueryString('price', null, 'mobile-price-all'); setFilterOpen(false); }}
                  className={`w-full flex items-center justify-between text-start text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    !currentPrice ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground)] font-medium'
                  }`}
                >
                  {lang === 'ar' ? 'جميع الأسعار' : 'All Prices'}
                  {pendingFilter === 'mobile-price-all' ? (
                     <Icon name="ArrowPathIcon" size={16} className="animate-spin text-[var(--primary)]" />
                  ) : !currentPrice ? (
                     <Icon name="CheckIcon" size={16} className="text-[var(--primary)]" />
                  ) : null}
                </button>
              </li>
              {PRICE_RANGES?.map((range) => {
                const isCurrent = currentPrice === range.value;
                const isLoading = pendingFilter === `mobile-price-${range.value}`;

                return (
                  <li key={range.value}>
                    <button
                      disabled={isFetchingGrid}
                      onClick={() => { updateQueryString('price', range.value, `mobile-price-${range.value}`); setFilterOpen(false); }}
                      className={`w-full flex items-center justify-between text-start text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isCurrent ? 'text-[var(--primary)] font-bold' : 'text-[var(--foreground)] font-medium'
                      }`}
                    >
                      {lang === 'ar' ? range.labelAr : range.label}
                      {isLoading ? (
                         <Icon name="ArrowPathIcon" size={16} className="animate-spin text-[var(--primary)]" />
                      ) : isCurrent ? (
                         <Icon name="CheckIcon" size={16} className="text-[var(--primary)]" />
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--border)] bg-[var(--background)]">
          <button 
            onClick={() => setFilterOpen(false)}
            className="w-full py-4 bg-[var(--primary)] text-white text-sm font-bold tracking-widest uppercase rounded-none hover:bg-[var(--primary-dark)] transition-colors"
          >
            {lang === 'ar' ? `عرض النتائج (${total})` : `Show Results (${total})`}
          </button>
        </div>
      </div>
    </div>
  );
}