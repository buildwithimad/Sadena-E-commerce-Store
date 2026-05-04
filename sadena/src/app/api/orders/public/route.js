import { createClient } from "@/lib/supabaseServer";

export async function GET(req) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);

  const orderNumber = searchParams.get("order_number");
  const token = searchParams.get("token");

  if (!orderNumber) {
    return Response.json(
      { error: "Order number required" },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // =========================
  // 🔐 BUILD QUERY
  // =========================
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

  // 🔥 CASE 1: Logged-in user → allow own order
  if (user) {
    query = query.eq("user_id", user.id);
  }

  // 🔥 CASE 2: Guest → must use token
  else {
    if (!token) {
      return Response.json(
        { error: "Token required" },
        { status: 400 }
      );
    }

    query = query.eq("access_token", token);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json({ order: data });
}