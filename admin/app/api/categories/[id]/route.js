import { supabaseAdmin } from '@/lib/supabaseAdmin'

// 🟡 UPDATE CATEGORY
export async function PUT(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing category id' }, { status: 400 })
  }

  try {
    const body = await req.json()

    if (!body.label) {
      return Response.json({ error: 'Category name is required' }, { status: 400 })
    }

    const updateData = {
      label: body.label,
      label_ar: body.label_ar || null,
      description: body.description || null,
      description_ar: body.description_ar || null,
      image: body.image || null
    }

    const { data, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
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

// 🔴 DELETE CATEGORY
export async function DELETE(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing category id' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return Response.json({ error: 'Category not found' }, { status: 404 })
    }

    return Response.json({
      success: true,
      data,
      message: 'Category deleted successfully'
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}