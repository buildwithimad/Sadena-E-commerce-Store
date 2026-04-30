import { supabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * 🧠 Helper for multilingual fields
 */
function t(en, ar, lang) {
  return lang === 'ar' ? ar || en : en
}

/**
 * 📦 Get Products (Paginated + Multilingual)
 */
export async function getProducts({
  lang = 'en',
  page = 1,
  limit = 16
}) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      category_id (*)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('getProducts error:', error)
    return {
      products: [],
      total: 0,
      page: 1,
      totalPages: 0
    }
  }

  const formatted = data.map((p) => ({
    ...p,

    // 🌍 multilingual
    name: t(p.name, p.name_ar, lang),
    description: t(p.description, p.description_ar, lang),

    // 🏷 category
    category_name: t(
      p.category_id?.label,
      p.category_id?.label_ar,
      lang
    )
  }))

  return {
    products: formatted,
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit)
  }
}

/**
 * 📦 Get Single Product by Slug (Full Details)
 */
export async function getProductDetailsBySlug(slug, lang = 'en') {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      category_id (*)
    `)
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('getProductDetails error:', error)
    return null
  }

  const product = {
    ...data,

    // 🌍 multilingual
    name: t(data.name, data.name_ar, lang),
    description: t(data.description, data.description_ar, lang),
    short_description: t(
      data.short_description,
      data.short_description_ar,
      lang
    ),

    // 🏷 category
    category_name: t(
      data.category_id?.label,
      data.category_id?.label_ar,
      lang
    ),

    // 📦 arrays
    benefits: lang === 'ar'
      ? data.benefits_ar || data.benefits || []
      : data.benefits || [],

    usage: lang === 'ar'
      ? data.usage_ar || data.usage || []
      : data.usage || [],

    ingredients: lang === 'ar'
      ? data.ingredients_ar || data.ingredients || []
      : data.ingredients || [],

    // 🖼 images
    images: data.images || [],

    // 💰 pricing
    price: data.price,
    discount_price: data.discount_price,

    // 📊 stock
    stock: data.stock,

    // ⭐ rating
    rating: data.rating,
    reviews_count: data.reviews_count,

    // 🔥 flags
    is_featured: data.is_featured,
    is_best_seller: data.is_best_seller,
    is_on_sale: data.is_on_sale,

    // 📅 meta
    created_at: data.created_at
  }

  return product
}


export async function fetchProductStockPerWarehouse(productId) {
  const { data, error } = await supabaseAdmin
    .from('product_stock')
    .select(`
      *,
      warehouses (*)
    `)
    .eq('product_id', productId)

  if (error) {
    console.error('Stock fetch error:', error)
    return []
  }

  return data
}