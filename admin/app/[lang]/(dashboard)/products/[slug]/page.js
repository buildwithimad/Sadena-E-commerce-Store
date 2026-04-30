import ProductDetailsClient from './ProductDetailsClient';
import {
  fetchProductStockPerWarehouse,
  getProductDetailsBySlug
} from '@/services/productService';
import { getCategories } from '@/services/categoriesService';
import { notFound } from 'next/navigation';
import { getWarehouses } from '@/services/wareHousesService';

export default async function ProductPage({ params }) {
  const { slug, lang } = await params;

  // 🟢 1. Fetch product first
  const product = await getProductDetailsBySlug(slug, lang);

  if (!product) {
    return notFound();
  }

  // 🟢 2. Fetch other data
  const [categories, warehouses, productStock] = await Promise.all([
    getCategories(lang),
    getWarehouses(),
    fetchProductStockPerWarehouse(product.id)
  ]);

  // 🟢 3. Pass EVERYTHING to client
  return (
    <ProductDetailsClient
      product={product}
      categories={categories}
      warehouses={warehouses}
      productStock={productStock} // 🔥 IMPORTANT
      lang={lang}
    />
  );
}