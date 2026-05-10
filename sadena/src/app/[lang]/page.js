import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import NewArrivalsSection from './components/NewArrival';
import OffersSection from './components/OffersSection';
import WeeklyOfferSection from './components/WeeklyOffers';
import BestSellersSection from './components/BestSellersSection';
import FeaturedProducts from './components/FeaturedProducts';
import SpecialProductsSection from './components/SpecialProducts';
import ValueProps from './components/ValueProps';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';

import { TRANSLATIONS } from '@/data/products';
import { getCategories } from '@/service/categoriesService';
import { getHomeProducts } from '@/service/productService';
import { getBanners } from '@/service/bannerServices';

// ✅ Helper
function groupBanners(banners = []) {
  return banners.reduce((acc, banner) => {
    if (!banner?.section) return acc;

    if (!acc[banner.section]) acc[banner.section] = [];
    acc[banner.section].push(banner);

    return acc;
  }, {});
}

export async function generateMetadata({ params }) {
  const { lang = 'en' } = await params;
  return {
    title:
      lang === 'ar'
        ? 'سادينا — متجر العناية الطبيعية'
        : 'Sadena Store — Natural Beauty Store',
    description:
      lang === 'ar'
        ? 'عناية طبيعية للشعر والبشرة ومنتجات الحناء والزيوت — مختارة للاستخدام اليومي.'
        : 'Natural care for hair, skin, henna, and oils — curated for everyday rituals.',
  };
}

export default async function HomePage({ params }) {
  const { lang = 'en' } = await params;
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;

  // 🔥 Fetch EVERYTHING in parallel
  const [categories, homeProducts, bannersRaw] = await Promise.all([
    getCategories(lang),
    getHomeProducts(lang),
    getBanners(lang),
  ]);

  const banners = groupBanners(bannersRaw);

  return (
    <>
      {/* 1) Hero Section */}
      <HeroSection
        lang={lang}
        t={t}
        banners={banners.hero}
      />

      {/* 2) Categories */}
      <CategorySection
        lang={lang}
        t={t}
        categories={categories}
      />

      {/* 3) New Arrivals */}
      <NewArrivalsSection
        lang={lang}
        t={t}
        products={homeProducts.newArrivals}
        banners={banners.new_arrivals}
      />

      {/* 4) Offers */}
      <OffersSection
        lang={lang}
        t={t}
        products={homeProducts.offers}
        banners={banners.offers}
      />

      {/* 5) Weekly Offer */}
      {homeProducts.weekly && (
        <WeeklyOfferSection
          lang={lang}
          t={t}
          product={homeProducts.weekly}
          banners={banners.weekly}
        />
      )}

      {/* 6) Best Sellers */}
      <BestSellersSection
        lang={lang}
        t={t}
        products={homeProducts.bestSellers}
        banners={banners.best_sellers}
      />

      {/* 7) Featured */}
      <FeaturedProducts
        lang={lang}
        t={t}
        products={homeProducts.featured}
        banners={banners.featured}
      />

      {/* 8) Special */}
      <SpecialProductsSection
        lang={lang}
        t={t}
        products={homeProducts.special}
        banners={banners.special}
      />

      {/* 9) Value Props */}
      <ValueProps lang={lang} t={t} />

      {/* 10) Reviews + FAQ */}
      <div className="bg-gray-50/50">
        <TestimonialsSection lang={lang} t={t} />
        <FAQSection lang={lang} t={t} />
      </div>
    </>
  );
}