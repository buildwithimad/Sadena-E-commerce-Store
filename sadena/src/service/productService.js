import { createClient } from '@/lib/supabaseServer';

// --- HELPER: Normalizes DB row into frontend-friendly object based on language ---
const normalizeProduct = (p, lang) => {
  return {
    id: p.id,
    slug: p.slug,
    category_id: p.category_id,
    name: lang === 'ar' && p.name_ar ? p.name_ar : p.name,
    description: lang === 'ar' && p.short_description_ar ? p.short_description_ar : p.short_description,
    
    // Strict Number parsing
    price: Number(p.price) || 0,
    discount_price: p.discount_price ? Number(p.discount_price) : null,
    currency: p.currency || 'SAR',
    stock: Number(p.stock) || 0,
    rating: Number(p.rating) || 0,
    reviews_count: Number(p.reviews_count) || 0,
    
    // Arrays & Booleans
    images: p.images || [],
    is_featured: !!p.is_featured,
    is_best_seller: !!p.is_best_seller,
    is_on_sale: !!p.is_on_sale,
    created_at: p.created_at,
  };
};

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

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (categoryId) query = query.eq('category_id', categoryId);
  if (minPrice !== null) query = query.gte('price', minPrice);
  if (maxPrice !== null) query = query.lte('price', maxPrice);

  switch (sort) {
    case 'priceLow': query = query.order('price', { ascending: true }); break;
    case 'priceHigh': query = query.order('price', { ascending: false }); break;
    case 'newest': query = query.order('created_at', { ascending: false }); break;
    case 'rating': query = query.order('rating', { ascending: false }).order('reviews_count', { ascending: false }); break;
    case 'featured':
    default:
      query = query.order('is_featured', { ascending: false }).order('is_best_seller', { ascending: false }).order('created_at', { ascending: false });
      break;
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error('Products fetch error:', error);
    return { products: [], total: 0 };
  }

  return { 
    products: data.map(p => normalizeProduct(p, lang)), 
    total: count || 0 
  };
}
  
export async function getProductBySlug(slug, lang = 'en') {
  const supabase = await createClient();

  const { data: p, error } = await supabase
    .from('products')
    .select(`*, category:categories(*)`)
    .eq('slug', slug)
    .single();

  if (error || !p) return { product: null, related: [] };

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
    images: rp.images || [],
  }));

  return { product, related };
}

// 🔥 NEW: Fetch Homepage Products Concurrently
export async function getHomeProducts(lang = 'en') {
  const supabase = await createClient();

  // Run all 3 queries at the exact same time for maximum speed
  const [bestSellersRes, featuredRes, offersRes] = await Promise.all([
    supabase.from('products').select('*').eq('is_best_seller', true).limit(8),
    supabase.from('products').select('*').eq('is_featured', true).limit(8),
    supabase.from('products').select('*').not('discount_price', 'is', null).limit(8)
  ]);

  return {
    bestSellers: (bestSellersRes.data || []).map(p => normalizeProduct(p, lang)),
    featured: (featuredRes.data || []).map(p => normalizeProduct(p, lang)),
    offers: (offersRes.data || []).map(p => normalizeProduct(p, lang)),
  };
}