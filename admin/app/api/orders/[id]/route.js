import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function PUT(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing order id' }, { status: 400 })
  }

  try {
    const body = await req.json()

    // ✅ Validate status
    const allowedStatus = ['placed', 'processing', 'shipped', 'delivered', 'cancelled']

    if (!allowedStatus.includes(body.status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      data
    })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}





export async function DELETE(req, { params }) {
  const { id } = await params

  if (!id) {
    return Response.json({ error: 'Missing order id' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: 'Order deleted'
    })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}