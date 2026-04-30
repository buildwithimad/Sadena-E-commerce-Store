import WishlistClientPage from './components/WishlistClientPage';
import { TRANSLATIONS } from '@/data/products';

export async function generateMetadata({ params }) {
  const { lang = 'en' } = await params;
  return {
    title: lang === 'ar' ? 'المفضلة — سادينا' : 'Wishlist — Sadena',
    description: lang === 'ar' ? 'المنتجات المحفوظة في مفضلتك.' : 'Your saved wishlist items.',
  };
}

export default async function WishlistPage({ params }) {
  const { lang = 'en' } = await params;
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;

  return <WishlistClientPage lang={lang} t={t} />;
}
