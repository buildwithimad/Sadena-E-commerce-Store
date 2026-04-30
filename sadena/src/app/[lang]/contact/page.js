import { TRANSLATIONS } from '@/data/products';
import ContactClient from './components/ContactClient';

export async function generateMetadata({ params }) {
  const { lang = 'en' } = await params;
  return {
    title: lang === 'ar' ? 'تواصل معنا — سادينا' : 'Contact — Sadena',
    description: lang === 'ar' ? 'تواصل مع فريق سادينا.' : 'Get in touch with the Sadena team.',
  };
}

export default async function ContactPage({ params }) {
  const { lang = 'en' } = await params;
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;
  return <ContactClient lang={lang} t={t} />;
}