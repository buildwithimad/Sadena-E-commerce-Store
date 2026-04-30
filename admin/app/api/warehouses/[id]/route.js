import { supabaseAdmin } from '@/lib/supabaseAdmin'

// 🟡 UPDATE WAREHOUSE
export async function PUT(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing warehouse id' }, { status: 400 })
  }

  try {
    const body = await req.json()

    // ✅ VALIDATION
    if (!body.name || typeof body.name !== 'string') {
      return Response.json({ error: 'Warehouse name is required' }, { status: 400 })
    }

    const updateData = {
      name: body.name,
      location: body.location || null
    }

    const { data, error } = await supabaseAdmin
      .from('warehouses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update warehouse error:', error)
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

// 🔴 DELETE WAREHOUSE
export async function DELETE(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing warehouse id' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('warehouses')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Delete warehouse error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return Response.json({ error: 'Warehouse not found' }, { status: 404 })
    }

    return Response.json({
      success: true,
      data,
      message: 'Warehouse deleted successfully'
    })

  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}