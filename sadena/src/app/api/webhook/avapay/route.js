import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    let body;

    // 🔥 Handle BOTH JSON + form-data
    try {
      body = await req.json();
    } catch {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    console.log("🔥 WEBHOOK HIT:", body);

    const order_id = body.order_id || body.orderId;
    const status = body.status || body.payment_status;
    const payment_id = body.transaction_id || body.payment_id;
    const amount = Number(body.amount || body.order_amount);

    if (!order_id || !status) {
      console.log("❌ Missing fields");
      return new Response("Missing fields", { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 🔍 Find order
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status")
      .eq("order_number", order_id)
      .single();

    if (error || !order) {
      console.log("❌ Order not found:", order_id);
      return new Response("Order not found", { status: 404 });
    }

    // 🔐 Amount check
    if (amount && Number(order.total) !== amount) {
      console.log("❌ Amount mismatch:", amount, order.total);
      return new Response("Amount mismatch", { status: 400 });
    }

    // 🔁 Prevent duplicate update
    if (order.payment_status === "paid") {
      console.log("⚠️ Already processed");
      return new Response("Already processed");
    }

    const statusUpper = String(status).toUpperCase();

    if (statusUpper === "SUCCESS") {
      console.log("✅ Payment SUCCESS");

      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_id,
          status: "processing",
        })
        .eq("order_number", order_id);

    } else {
      console.log("❌ Payment FAILED:", status);

      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("order_number", order_id);
    }

    return new Response("OK");

  } catch (err) {
    console.error("💥 WEBHOOK ERROR:", err);
    return new Response("Server Error", { status: 500 });
  }
}