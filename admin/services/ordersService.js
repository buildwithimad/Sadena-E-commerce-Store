import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getOrders({ page = 1, limit = 10 }) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('getOrders error:', error)
    return { orders: [], total: 0 }
  }

  return {
    orders: data,
    total: count,
    page,
    totalPages: Math.ceil(count / limit)
  }
}


export async function getOrderById(id) {
  if (!id) return null

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getOrderById error:', error)
    return null
  }

  // 🔥 OPTIONAL: normalize items (safe)
  const order = {
    ...data,
    items: Array.isArray(data.items) ? data.items : []
  }

  return order
}