import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("EDFA WEBHOOK:", body);

    // =========================
    // 🔥 EXTRACT DATA (adjust if needed)
    // =========================
    const order_id = body.order_id || body.orderId;
    const status = body.status;
    const payment_id = body.transaction_id || body.payment_id;
    const amount = Number(body.amount);

    // =========================
    // 🔐 BASIC VALIDATION
    // =========================
    if (!order_id || !status) {
      return new Response("Missing fields", { status: 400 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // =========================
    // 🔍 FETCH ORDER
    // =========================
    const { data: order } = await supabase
      .from("orders")
      .select("id, total, payment_status")
      .eq("id", order_id)
      .single();

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    // =========================
    // 🔐 AMOUNT CHECK
    // =========================
    if (amount && Number(order.total) !== amount) {
      return new Response("Amount mismatch", { status: 400 });
    }

    // =========================
    // 🔁 DUPLICATE PROTECTION
    // =========================
    if (order.payment_status === "paid") {
      return new Response("Already processed");
    }

    // =========================
    // 💾 UPDATE ORDER
    // =========================

    if (status === "SUCCESS" || status === "success") {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_id,
          status: "processing",
        })
        .eq("id", order_id);
    } else {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("id", order_id);
    }

    return new Response("OK");
  } catch (err) {
    console.error("WEBHOOK ERROR:", err);
    return new Response("Server Error", { status: 500 });
  }
}