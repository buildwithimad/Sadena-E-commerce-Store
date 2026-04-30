import ProductsClientPage from './components/ProductsClientPage'; // Adjust import path
import { TRANSLATIONS } from '@/data/products'; // Adjust if needed
import { getProducts } from '@/service/productService';
import { getCategories } from '@/service/categoriesService';

// ISR Cache time (in seconds)
export const revalidate = 60;

export default async function ProductsPage({ params, searchParams }) {
  // Await params and searchParams for Next.js 15+
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const lang = resolvedParams.lang || 'en';
  const t = TRANSLATIONS?.[lang] || TRANSLATIONS?.en;

  // 1. Extract URL Parameters
  const page = Number(resolvedSearchParams?.page || 1);
  const limit = 16;
  const categorySlug = resolvedSearchParams?.category || 'all';
  const priceParam = resolvedSearchParams?.price || null;
  const sortParam = resolvedSearchParams?.sort || 'featured';

  // 2. Parse Price Range
  let minPrice = null;
  let maxPrice = null;
  if (priceParam) {
    const [min, max] = priceParam.split('-');
    minPrice = min ? Number(min) : null;
    maxPrice = max ? Number(max) : null;
  }

  // 3. Fetch Categories
  const categories = await getCategories({ lang });
  console.log('Fetched Categories:', categories); // Debugging log
  
  // 4. Map the Category Slug from the URL to its Database ID
  const activeCategoryObj = categories.find(c => c.slug === categorySlug);
  const categoryId = activeCategoryObj ? activeCategoryObj.id : null;

  // 5. Fetch Filtered Products
  const { products, total } = await getProducts({
    page,
    limit,
    lang,
    categoryId,
    minPrice,
    maxPrice,
    sort: sortParam
  });

  console.log('Fetched Products:', products); // Debugging log

  return (
    <ProductsClientPage
      lang={lang}
      t={t}
      products={products}
      total={total}
      page={page}
      limit={limit}
      categories={categories}
      currentCategory={categorySlug}
      currentPrice={priceParam}
      currentSort={sortParam}
    />
  );
}