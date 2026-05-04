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
  if (!id) return null;

  // Next.js bug prevention: ignore hidden browser file requests
  if (id === 'favicon.ico' || id.includes('.')) return null;

  try {
    // Safely check if the ID is a UUID format or a standard Order Number
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    let query = supabaseAdmin.from('orders').select('*');

    // Route the query to the correct database column
    if (isUUID) {
      query = query.eq('id', id);
    } else {
      query = query.eq('order_number', id);
    }

    const { data, error } = await query.single();

    if (error) {
      // Log the actual error message so it is never an empty {} again
      console.error('getOrderById error:', error.message || error);
      return null;
    }

    // Normalize items array safely
    const order = {
      ...data,
      items: Array.isArray(data.items) ? data.items : []
    };

    return order;

  } catch (err) {
    console.error('Unexpected error in getOrderById:', err.message);
    return null;
  }
}