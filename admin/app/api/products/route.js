import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth'; // ✅ The Gatekeeper

// =======================================================================
// 🟢 CREATE PRODUCT (POST)
// =======================================================================
export async function POST(req) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER (Fail Fast)
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const body = await req.json();

    // -------------------------------
    // 🔒 BASIC & LOGICAL VALIDATION
    // -------------------------------
    if (!body.name || typeof body.name !== 'string') {
      return Response.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!body.price || isNaN(body.price)) {
      return Response.json({ error: 'Valid price is required' }, { status: 400 });
    }

    // ✅ NEW: Discount price validation
    if (body.discount_price && Number(body.discount_price) >= Number(body.price)) {
      return Response.json({ error: 'Discount price must be less than the original price' }, { status: 400 });
    }

    // ✅ NEW: Ensure images array is not empty
    if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
      return Response.json({ error: 'At least one product image is required' }, { status: 400 });
    }

    // -------------------------------
    // 🔒 VALIDATE STOCK DATA
    // -------------------------------
    if (body.stockData) {
      if (!Array.isArray(body.stockData)) {
        return Response.json({ error: 'stockData must be an array' }, { status: 400 });
      }

      for (const item of body.stockData) {
        if (!item.warehouse_id) {
          return Response.json({ error: 'warehouse_id is required in stockData' }, { status: 400 });
        }

        if (item.stock !== undefined && isNaN(item.stock)) {
          return Response.json({ error: 'Stock must be a number' }, { status: 400 });
        }
      }
    }

    // -------------------------------
    // 🔥 GENERATE SLUG
    // -------------------------------
    let slug = body.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    slug = `${slug}-${Date.now()}`;

    // -------------------------------
    // 📦 CALCULATE TOTAL STOCK
    // -------------------------------
    const totalStock = body.stockData
      ? body.stockData.reduce((sum, i) => sum + (Number(i.stock) || 0), 0)
      : Number(body.stock) || 0;

    // -------------------------------
    // ✅ PRODUCT DATA OBJECT (With New Fields)
    // -------------------------------
    const productData = {
      name: body.name,
      name_ar: body.name_ar || null,
      slug,
      description: body.description || null,
      description_ar: body.description_ar || null,
      short_description: body.short_description || null,
      short_description_ar: body.short_description_ar || null,
      price: Number(body.price),
      discount_price: body.discount_price ? Number(body.discount_price) : null,
      currency: body.currency || 'SAR',
      images: body.images,
      category_id: body.category_id || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      stock: totalStock,
      sku: body.sku || null,
      rating: body.rating ? Number(body.rating) : 0,
      reviews_count: body.reviews_count ? Number(body.reviews_count) : 0,
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      benefits_ar: Array.isArray(body.benefits_ar) ? body.benefits_ar : [],
      usage: Array.isArray(body.usage) ? body.usage : [],
      usage_ar: Array.isArray(body.usage_ar) ? body.usage_ar : [],
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
      ingredients_ar: Array.isArray(body.ingredients_ar) ? body.ingredients_ar : [],
      is_published: Boolean(body.is_published),
      is_featured: Boolean(body.is_featured),
      is_best_seller: Boolean(body.is_best_seller),
      
      // ✅ NEW: Auto-set is_on_sale based on discount_price existence
      is_on_sale: Boolean(body.discount_price && Number(body.discount_price) > 0),
      
      // ✅ NEW: Added Missing Fields
      is_weekly_offer: Boolean(body.is_weekly_offer),
      badge: body.badge || null,
      badge_ar: body.badge_ar || null,
      position: Number(body.position) || 0,
      offer_expires_at: body.offer_expires_at ? new Date(body.offer_expires_at).toISOString() : null,
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
    };

    // -------------------------------
    // 🟢 2. CREATE PRODUCT
    // -------------------------------
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Product Insert Error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // -------------------------------
    // 🟢 3. INSERT WAREHOUSE STOCK
    // -------------------------------
    if (body.stockData && body.stockData.length > 0) {
      const stockRows = body.stockData.map((item) => ({
        product_id: product.id,
        warehouse_id: item.warehouse_id,
        stock: Number(item.stock) || 0
      }));

      const { error: stockError } = await supabaseAdmin
        .from('product_stock')
        .insert(stockRows);

      if (stockError) {
        console.error('Stock Insert Error:', stockError);

        // ❌ ROLLBACK: Delete the product if stock insertion fails
        await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', product.id);

        return Response.json(
          { error: 'Failed to insert stock, product rolled back' },
          { status: 500 }
        );
      }
    }

    // -------------------------------
    // ✅ SUCCESS
    // -------------------------------
    return Response.json({
      success: true,
      data: product
    });

  } catch (err) {
    console.error('Server Error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

