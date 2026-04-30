import ProductDetailClient from './components/ProductDetailClient';
import { TRANSLATIONS } from '@/data/products';
import { getProductBySlug } from '@/service/productService';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // ISR: Revalidate every hour

export async function generateMetadata({ params }) {
  const { lang = 'en', slug } = await params;
  const { product } = await getProductBySlug(slug, lang);

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — ${lang === 'ar' ? 'سادينا' : 'Sadena'}`,
    description: product.shortDescription || product.description,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { lang = 'en', slug } = await params;
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;

  const { product, related } = await getProductBySlug(slug, lang);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailClient 
      lang={lang} 
      t={t} 
      product={product} 
      related={related} 
    />
  );
}