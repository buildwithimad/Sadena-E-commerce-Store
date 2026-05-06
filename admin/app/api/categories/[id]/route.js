import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth'; // ✅ Import your gatekeeper

// 🟡 UPDATE CATEGORY
export async function PUT(req, { params }) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER (Fail Fast)
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'Missing category id' }, { status: 400 });
    }

    const body = await req.json();

    if (!body.label) {
      return Response.json({ error: 'Category name is required' }, { status: 400 });
    }

    // 🔥 SLUG GENERATION (Updates slug if name changes)
    const slug = body.label
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters/numbers/spaces/hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();

    // 2. GET OLD CATEGORY
    const { data: oldCategory } = await supabaseAdmin
      .from('categories')
      .select('image')
      .eq('id', id)
      .single();

    // 3. DELETE OLD IMAGE FROM STORAGE IF CHANGED
    const oldImage = oldCategory?.image;
    const newImage = body.image || null;

    if (oldImage && oldImage !== newImage && oldImage.startsWith('http')) {
      const parts = oldImage.split('/storage/v1/object/public/categories/');
      const fileName = parts[1];
      if (fileName) {
        await supabaseAdmin.storage.from('categories').remove([fileName]);
      }
    }

    // 4. UPDATE DATABASE
    const updateData = {
      label: body.label,
      label_ar: body.label_ar || null,
      slug: slug, // ✅ Added updated slug
      description: body.description || null,
      description_ar: body.description_ar || null,
      image: newImage
    };

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });

  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🔴 DELETE CATEGORY
export async function DELETE(req, { params }) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER (Fail Fast)
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return Response.json({ error: 'Missing category id' }, { status: 400 });
    }

    // 2. GET CATEGORY 
    const { data: category, error: fetchError } = await supabaseAdmin
      .from('categories')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) {
      return Response.json({ error: fetchError.message }, { status: 500 });
    }

    // 3. DELETE IMAGE FROM STORAGE
    if (category?.image && category.image.startsWith('http')) {
      const parts = category.image.split('/storage/v1/object/public/categories/');
      const fileName = parts[1];
      if (fileName) {
        await supabaseAdmin.storage.from('categories').remove([fileName]);
      }
    }

    // 4. DELETE CATEGORY FROM DB
    const { data, error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      data,
      message: 'Category and image deleted successfully'
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}