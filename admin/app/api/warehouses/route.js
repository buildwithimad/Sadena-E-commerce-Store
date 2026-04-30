import { supabaseAdmin } from '@/lib/supabaseAdmin'

// 🟢 CREATE WAREHOUSE
export async function POST(req) {
  try {
    const body = await req.json()

    // ✅ VALIDATION
    if (!body.name || typeof body.name !== 'string') {
      return Response.json({ error: 'Warehouse name is required' }, { status: 400 })
    }

    const warehouseData = {
      name: body.name,
      location: body.location || null
    }

    const { data, error } = await supabaseAdmin
      .from('warehouses')
      .insert([warehouseData])
      .select()
      .single()

    if (error) {
      console.error('Create warehouse error:', error)
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