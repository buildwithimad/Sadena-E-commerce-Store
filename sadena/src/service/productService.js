import { createClient } from '@/lib/supabaseServer';

export async function getProducts({ 
  page = 1, 
  limit = 16, 
  lang = 'en',
  categoryId = null,
  minPrice = null,
  maxPrice = null,
  sort = 'featured'
}) {
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Base Query: We fetch BOTH languages so we can create a smart fallback
  let query = supabase
    .from('products')
    .select(`
      id,
      slug,
      category_id,
      name,
      name_ar,
      short_description,
      short_description_ar,
      price,
      discount_price,
      currency,
      images,
      stock,
      rating,
      reviews_count,
      is_featured,
      is_best_seller,
      is_on_sale,
      created_at
    `, { count: 'exact' });

  // Apply Category Filter
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Apply Price Filters (Filters by base price)
  if (minPrice !== null) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice !== null) {
    query = query.lte('price', maxPrice);
  }

  // Apply Advanced E-commerce Sorting
  switch (sort) {
    case 'priceLow':
      query = query.order('price', { ascending: true });
      break;
    case 'priceHigh':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'rating':
      // Sort by rating first, use review count as tie-breaker
      query = query
        .order('rating', { ascending: false })
        .order('reviews_count', { ascending: false });
      break;
    case 'featured':
    default:
      // Featured first -> then Best Sellers -> then Newest
      query = query
        .order('is_featured', { ascending: false })
        .order('is_best_seller', { ascending: false })
        .order('created_at', { ascending: false });
      break;
  }

  // Fetch from Supabase
  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Products fetch error:', error);
    return { products: [], total: 0 };
  }

  // Normalize response and guarantee strict data types for the frontend
  const products = data.map((p) => {
    // Smart Fallback: Use Arabic if requested AND available, otherwise fallback to English
    const localizedName = lang === 'ar' && p.name_ar ? p.name_ar : p.name;
    const localizedDesc = lang === 'ar' && p.short_description_ar ? p.short_description_ar : p.short_description;

    return {
      id: p.id,
      slug: p.slug,
      category_id: p.category_id,
      name: localizedName,
      description: localizedDesc,
      
      // Strict Number parsing for prices & metrics
      price: Number(p.price) || 0,
      discount_price: p.discount_price ? Number(p.discount_price) : null,
      currency: p.currency || 'SAR',
      stock: Number(p.stock) || 0,
      rating: Number(p.rating) || 0,
      reviews_count: Number(p.reviews_count) || 0,
      
      // Fallback arrays to prevent frontend crashes
      images: p.images || [],
      
      // Strict Boolean parsing for e-commerce badges
      is_featured: !!p.is_featured,
      is_best_seller: !!p.is_best_seller,
      is_on_sale: !!p.is_on_sale,
      
      created_at: p.created_at,
    };
  });

  return { products, total: count || 0 };
}

  
export async function getProductBySlug(slug, lang = 'en') {
  const supabase = await createClient();

  const { data: p, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !p) return { product: null, related: [] };

  // Normalize current product
  const product = {
    ...p,
    name: lang === 'ar' && p.name_ar ? p.name_ar : p.name,
    description: lang === 'ar' && p.description_ar ? p.description_ar : p.description,
    shortDescription: lang === 'ar' && p.short_description_ar ? p.short_description_ar : p.short_description,
    benefits: lang === 'ar' && p.benefits_ar ? p.benefits_ar : p.benefits,
    usage: lang === 'ar' && p.usage_ar ? p.usage_ar : p.usage,
    ingredients: lang === 'ar' && p.ingredients_ar ? p.ingredients_ar : p.ingredients,
    price: Number(p.price),
    discountPrice: p.discount_price ? Number(p.discount_price) : null,
  };

  // Fetch Related Products (same category, different ID)
  const { data: relatedData } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', p.category_id)
    .neq('id', p.id)
    .limit(4);

  const related = (relatedData || []).map(rp => ({
    ...rp,
    name: lang === 'ar' && rp.name_ar ? rp.name_ar : rp.name,
    price: Number(rp.price),
    discountPrice: rp.discount_price ? Number(rp.discount_price) : null,
  }));

  return { product, related };
}