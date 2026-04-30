import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PUT(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing product id' }, { status: 400 })
  }

  try {
    const body = await req.json()

    // ✅ VALIDATION
    if (!body.name || !body.price) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (body.discount_price && Number(body.discount_price) >= Number(body.price)) {
      return Response.json({ error: 'Discount must be less than price' }, { status: 400 })
    }

    // 🔥 SLUG
    let slug
    if (body.name) {
      slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
    }

    // 📦 TOTAL STOCK
    const totalStock = body.stockData?.length > 0
      ? body.stockData.reduce((sum, i) => sum + (Number(i.stock) || 0), 0)
      : Number(body.stock) || 0

    // ✅ UPDATE DATA
    const updateData = {
      name: body.name,
      name_ar: body.name_ar || null,

      description: body.description || null,
      description_ar: body.description_ar || null,

      short_description: body.short_description || null,
      short_description_ar: body.short_description_ar || null,

      price: Number(body.price),
      discount_price: body.discount_price ? Number(body.discount_price) : null,

      images: Array.isArray(body.images) ? body.images : [],

      category_id: body.category_id || null,
      tags: Array.isArray(body.tags) ? body.tags : [],

      stock: totalStock,

      sku: body.sku || null,

      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      benefits_ar: Array.isArray(body.benefits_ar) ? body.benefits_ar : [],

      usage: Array.isArray(body.usage) ? body.usage : [],
      usage_ar: Array.isArray(body.usage_ar) ? body.usage_ar : [],

      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
      ingredients_ar: Array.isArray(body.ingredients_ar) ? body.ingredients_ar : [],

      is_featured: Boolean(body.is_featured),
      is_best_seller: Boolean(body.is_best_seller),
      is_on_sale: Boolean(body.is_on_sale),

      ...(slug && { slug })
    }

    // 🟢 UPDATE PRODUCT
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    // 🟢 UPDATE STOCK
    if (body.stockData) {
      await supabaseAdmin
        .from('product_stock')
        .delete()
        .eq('product_id', id)

      if (body.stockData.length > 0) {
        const stockRows = body.stockData.map((item) => ({
          product_id: id,
          warehouse_id: item.warehouse_id,
          stock: Number(item.stock) || 0
        }))

        const { error: stockError } = await supabaseAdmin
          .from('product_stock')
          .insert(stockRows)

        if (stockError) {
          return Response.json({ error: stockError.message }, { status: 500 })
        }
      }
    }

    return Response.json({
      success: true,
      data: product
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {


  console.log("PARAMS:", params)


  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing product id' }, { status: 400 })
  }

  // 🔥 delete + return deleted row
  const { data, error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Delete error:', error)
    return Response.json({ error }, { status: 500 })
  }

  // 🧠 if nothing deleted
  if (!data) {
    return Response.json({ error: 'Product not found' }, { status: 404 })
  }

  return Response.json({
    success: true,
    data,
    message: 'Product deleted successfully'
  })
}