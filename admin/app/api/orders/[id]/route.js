import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth'; // ✅ The Gatekeeper

// 🟡 UPDATE ORDER STATUS
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
      return Response.json({ error: 'Missing order id' }, { status: 400 });
    }

    const body = await req.json();

    // ✅ Validate status
    const allowedStatus = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!allowedStatus.includes(body.status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // ==========================================
    // 2. EXECUTE UPDATE
    // ==========================================
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status: body.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      data
    });

  } catch (err) {
    console.error("Order Update Error:", err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🔴 DELETE ORDER
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
      return Response.json({ error: 'Missing order id' }, { status: 400 });
    }

    // ==========================================
    // 2. EXECUTE DELETE
    // ==========================================
    const { data, error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'Order deleted'
    });

  } catch (err) {
    console.error("Order Delete Error:", err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}