import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import BestSellersSection from './components/BestSellersSection';
import FeaturedProducts from './components/FeaturedProducts';
import OffersSection from './components/OffersSection';
import ValueProps from './components/ValueProps';
import TestimonialsSection from './components/TestimonialsSection';
import { TRANSLATIONS } from '@/data/products';
import { getCategories } from '@/service/categoriesService';
import { getHomeProducts } from '@/service/productService'; // 🔥 Import the new service

export async function generateMetadata({ params }) {
  const { lang = 'en' } = await params;
  return {
    title: lang === 'ar' ? 'سادينا — متجر العناية الطبيعية' : 'Sadena Store — Natural Beauty Store',
    description: lang === 'ar'
      ? 'عناية طبيعية للشعر والبشرة ومنتجات الحناء والزيوت — مختارة للاستخدام اليومي.'
      : 'Natural care for hair, skin, henna, and oils — curated for everyday rituals.',
  };
}

export default async function HomePage({ params }) {
  const { lang = 'en' } = await params;
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;
  
  // 🔥 Fetch categories and all home products in parallel for speed
  const [categories, homeProducts] = await Promise.all([
    getCategories(lang),
    getHomeProducts(lang)
  ]);

  return (
    <>
      <HeroSection lang={lang} t={t} />
      <CategorySection lang={lang} t={t} categories={categories} />
      <FeaturedProducts lang={lang} t={t} products={homeProducts.featured} />
      <BestSellersSection lang={lang} t={t} products={homeProducts.bestSellers} />
      <OffersSection lang={lang} t={t} products={homeProducts.offers} />
      <ValueProps lang={lang} t={t} />
      <TestimonialsSection lang={lang} t={t} />
    </>
  );
}