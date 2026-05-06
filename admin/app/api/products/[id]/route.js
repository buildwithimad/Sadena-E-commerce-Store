import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth'; // ✅ The Gatekeeper

// 🟡 UPDATE PRODUCT
export async function PUT(req, { params }) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'Missing product id' }, { status: 400 });
    }

    const body = await req.json();

    // ✅ VALIDATION
    if (!body.name || !body.price) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.discount_price && Number(body.discount_price) >= Number(body.price)) {
      return Response.json({ error: 'Discount must be less than price' }, { status: 400 });
    }

    // 🟢 2. GET OLD PRODUCT (To compare images for deletion)
    const { data: oldProduct } = await supabaseAdmin
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    const oldImages = oldProduct?.images || [];
    const incomingImages = Array.isArray(body.images) ? body.images : [];
    
    // Separate existing URLs from new base64 uploads
    const existingUrls = incomingImages.filter(img => img.startsWith('http'));
    const newBase64s = incomingImages.filter(img => img.startsWith('data:image'));

    // 🟢 3. DELETE REMOVED IMAGES FROM STORAGE BUCKET
    const removedImages = oldImages.filter(oldUrl => !existingUrls.includes(oldUrl));
    if (removedImages.length > 0) {
      const filePaths = removedImages.map(url => {
        const parts = url.split('/storage/v1/object/public/products/');
        return parts[1];
      }).filter(Boolean);

      if (filePaths.length > 0) {
        await supabaseAdmin.storage.from('products').remove(filePaths);
      }
    }

    // 🟢 4. UPLOAD NEW IMAGES TO STORAGE BUCKET
    const finalImages = [...existingUrls];
    
    for (const b64 of newBase64s) {
      const matches = b64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = mimeType.split('/')[1] || 'png';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from('products')
          .upload(fileName, buffer, { contentType: mimeType });

        if (!uploadError) {
          const { data: { publicUrl } } = supabaseAdmin.storage.from('products').getPublicUrl(fileName);
          finalImages.push(publicUrl);
        }
      }
    }

    // 🔥 5. SLUG GENERATION
    let slug;
    if (body.name) {
      slug = body.name
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, '') 
        .replace(/\s+/g, '-')
        .toLowerCase();
    }

    // 📦 6. TOTAL STOCK CALCULATION
    const totalStock = body.stockData?.length > 0
      ? body.stockData.reduce((sum, i) => sum + (Number(i.stock) || 0), 0)
      : Number(body.stock) || 0;

    // ✅ 7. PREPARE UPDATE DATA
    const updateData = {
      name: body.name,
      name_ar: body.name_ar || null,
      description: body.description || null,
      description_ar: body.description_ar || null,
      short_description: body.short_description || null,
      short_description_ar: body.short_description_ar || null,
      price: Number(body.price),
      discount_price: body.discount_price ? Number(body.discount_price) : null,
      images: finalImages,
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
      is_published: Boolean(body.is_published),
      is_featured: Boolean(body.is_featured),
      is_best_seller: Boolean(body.is_best_seller),
      is_on_sale: Boolean(body.is_on_sale),
      ...(slug && { slug })
    };

    // 🟢 8. UPDATE PRODUCT IN DB
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // 🟢 9. UPDATE STOCK ALLOCATION (Delete and Re-insert)
    if (body.stockData) {
      await supabaseAdmin.from('product_stock').delete().eq('product_id', id);
      
      if (body.stockData.length > 0) {
        const stockRows = body.stockData.map((item) => ({
          product_id: id,
          warehouse_id: item.warehouse_id,
          stock: Number(item.stock) || 0
        }));
        const { error: stockError } = await supabaseAdmin.from('product_stock').insert(stockRows);
        if (stockError) {
          return Response.json({ error: stockError.message }, { status: 500 });
        }
      }
    }

    return Response.json({ success: true, data: product });

  } catch (err) {
    console.error("Product Update Error:", err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🔴 DELETE PRODUCT
export async function DELETE(req, { params }) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'Missing product id' }, { status: 400 });
    }

    // 🟢 2. GET PRODUCT FIRST (to access images)
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('images')
      .eq('id', id)
      .single();

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 });
    }

    // 🟢 3. DELETE IMAGES FROM STORAGE
    if (product.images && product.images.length > 0) {
      const filePaths = product.images.map((url) => {
        const parts = url.split('/storage/v1/object/public/products/');
        return parts[1];
      }).filter(Boolean);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('products')
          .remove(filePaths);

        if (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }
    }

    // 🟢 4. DELETE PRODUCT FROM DB (Cascading will handle stock table if set up)
    const { data, error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      data,
      message: 'Product and images deleted successfully'
    });

  } catch (err) {
    console.error("Product Delete Error:", err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}