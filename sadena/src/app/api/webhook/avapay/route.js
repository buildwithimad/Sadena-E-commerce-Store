import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const order_id = formData.get("order_id");
    const status = formData.get("status");
    const payment_id = formData.get("payment_id");
    const merchant_id = formData.get("merchant_id");
    const amount = Number(formData.get("amount"));

    // =========================
    // 🔐 BASIC VALIDATION
    // =========================

    if (!order_id || !status || !merchant_id) {
      return new Response("Missing fields", { status: 400 });
    }

    if (!["success", "failed"].includes(status)) {
      return new Response("Invalid status", { status: 400 });
    }

    // ✅ Verify merchant
    if (merchant_id !== process.env.AVAPAY_MERCHANT_ID) {
      return new Response("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // =========================
    // 🔍 CHECK ORDER
    // =========================
    const { data: order } = await supabase
      .from("orders")
      .select("id, total, payment_status")
      .eq("id", order_id)
      .single();

    if (!order) {
      return new Response("Order not found", { status: 404 });
    }

    // ✅ Verify amount
    if (Number(order.total) !== amount) {
      return new Response("Amount mismatch", { status: 400 });
    }

    // ✅ Prevent duplicate updates
    if (order.payment_status === "paid") {
      return new Response("Already processed");
    }

    // =========================
    // 💾 UPDATE ORDER
    // =========================
    if (status === "success") {
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