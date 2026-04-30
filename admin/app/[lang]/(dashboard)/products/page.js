import ProductsClient from './ProductsClient';
import { getProducts } from '@/services/productService';
import { getCategories } from '@/services/categoriesService';
import { getWarehouses } from '@/services/wareHousesService';

export const metadata = {
  title: 'Products | Admin Panel',
};

export default async function ProductsPage({ params, searchParams }) {
  const { lang } = await params;
  
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const limit = 16; 

  // Fetch Products & Categories
  const { products, totalPages, total } = await getProducts({ lang, page, limit });
  const categories = await getCategories(lang);

  // 🔥 Fetch Warehouses for Stock Allocation
  const warehouses = await getWarehouses();

  return (
    <ProductsClient
      lang={lang}
      products={products}
      categories={categories}
      warehouses={warehouses || []} // 👈 Pass to client
      totalPages={totalPages}
      currentPage={page}
      total={total}
      limit={limit}
    />
  );
}