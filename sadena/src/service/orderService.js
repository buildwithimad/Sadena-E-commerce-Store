import { createClient } from "@/lib/supabaseServer";

export async function getOrder(orderNumber, token = null) {
  const supabase = await createClient();
  
  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Build the query safely
  let query = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
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
      shipping_country,
      created_at
    `)
    .eq("order_number", orderNumber);

  // 3. Apply Auth Rules
  if (user) {
    // Logged in user: must own the order
    query = query.eq("user_id", user.id);
  } else if (token) {
    // Guest user: must have the exact access token
    query = query.eq("access_token", token);
  } else {
    // No user and no token = Block access instantly
    return { order: null, error: "Unauthorized" };
  }

  // 4. Fetch the order
  const { data: order, error } = await query.single();

  return { order, error };
}