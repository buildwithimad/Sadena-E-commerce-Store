import { supabaseAdmin } from '@/lib/supabaseAdmin'

// 🟢 CREATE CATEGORY
export async function POST(req) {
  try {
    const body = await req.json()

    // ✅ VALIDATION
    if (!body.label) {
      return Response.json({ error: 'Category name is required' }, { status: 400 })
    }

    const categoryData = {
      label: body.label,
      label_ar: body.label_ar || null,
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