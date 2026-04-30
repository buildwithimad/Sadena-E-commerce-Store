import CheckoutClient from './components/CheckoutClient';
import { TRANSLATIONS } from '@/data/products';

export async function generateMetadata({ params }) {
  const { lang = 'en' } = await params;
  return {
    title: lang === 'ar' ? 'إتمام الشراء — سادينا' : 'Checkout — Sadena',
    description: lang === 'ar' ? 'أتمم طلبك بأمان وبخطوات بسيطة.' : 'Complete your order securely in a few simple steps.',
  };
}

export default async function CheckoutPage({ params }) {
  const { lang = 'en' } = await params;
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;
  return <CheckoutClient lang={lang} t={t} />;
}