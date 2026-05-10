import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("order_id");

    if (!order_id) {
      return Response.json({ error: "Missing order_id" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: order, error } = await supabase
      .from("orders")
      .select("order_number, payment_status")
      .eq("order_number", order_id)
      .single();

    if (error || !order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({
      order_number: order.order_number,
      payment_status: order.payment_status,
    });

  } catch (err) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}