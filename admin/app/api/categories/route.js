import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkAdmin } from '@/lib/auth' // ✅ Import your gatekeeper

// 🟢 CREATE CATEGORY
export async function POST(req) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER (Fail Fast)
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    // ==========================================
    // 2. PARSE & VALIDATE
    // ==========================================
    const body = await req.json()

    // ✅ VALIDATION
    if (!body.label) {
      return Response.json({ error: 'Category name is required' }, { status: 400 })
    }

    // 🔥 SLUG GENERATION (Supports English & Arabic)
    const slug = body.label
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters/numbers/spaces/hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase()

    // ==========================================
    // 3. EXECUTE DATABASE INSERT
    // ==========================================
    const categoryData = {
      label: body.label,
      label_ar: body.label_ar || null,
      slug: slug, // ✅ Added auto-generated slug
      description: body.description || null,
      description_ar: body.description_ar || null,
      image: body.image || null
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) {
      console.error(error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      data
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}