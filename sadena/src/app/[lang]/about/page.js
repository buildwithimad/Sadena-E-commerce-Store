import AboutClient from './components/AboutClient';
import { TRANSLATIONS } from '@/data/products';

export const metadata = {
  title: 'About Us | Sadena',
  description: 'Discover the story behind Sadena and our commitment to pure, organic beauty.',
};

export default function AboutPage({ params: { lang } }) {
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;

  return <AboutClient lang={lang} t={t} />;
}