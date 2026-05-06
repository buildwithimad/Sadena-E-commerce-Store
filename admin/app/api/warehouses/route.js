import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkAdmin } from '@/lib/auth' // ✅ The Gatekeeper

// 🟢 CREATE WAREHOUSE
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

    if (!body.name || typeof body.name !== 'string') {
      return Response.json({ error: 'Warehouse name is required' }, { status: 400 })
    }

    // ==========================================
    // 3. EXECUTE DATABASE INSERT
    // ==========================================
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
    console.error('Server Error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}