import { createClient } from '@/lib/supabaseServer';

export async function POST(req) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json();

  const {
    items,
    subtotal,
    shipping,
    total,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    shipping_street,
    shipping_city,
    shipping_country
  } = body;

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: user?.id || null, // 🔥 guest OR user
        items,
        subtotal,
        shipping,
        total,
        status: 'pending',
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone,
        shipping_street,
        shipping_city,
        shipping_country,
        order_number: `ORD-${Date.now()}`
      }
    ])
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ order: data });
}