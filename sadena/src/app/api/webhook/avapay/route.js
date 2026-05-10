import { createClient } from "@supabase/supabase-js";

// ===============================
// ✅ GET (browser redirect only)
// ===============================
export async function GET(req) {
  const url = new URL(req.url);
  const order_id = url.searchParams.get("order_id");

  if (!order_id) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/en`,
      302
    );
  }

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/en/order-success?order_id=${order_id}`,
    302
  );
}

// ===============================
// ✅ POST (EDFAPay webhook)
// ===============================
export async function POST(req) {
  try {
    let body = {};

    const contentType = req.headers.get("content-type") || "";

    // ===============================
    // ✅ READ BODY (ONLY ONCE)
    // ===============================
    if (contentType.includes("application/json")) {
      body = await req.json();

    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      body = Object.fromEntries(new URLSearchParams(text));

    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());

    } else {
      await req.text();
    }

    // ===============================
    // ✅ FIELD MAPPING
    // ===============================
    const order_id =
      body.order_id ||
      body.orderId ||
      body.merchant_order_id;

    const payment_id =
      body.transaction_id ||
      body.payment_id ||
      body.trans_id;

    const amount = Number(body.amount || body.order_amount);

    if (!order_id) {
      return new Response("Missing order_id", { status: 400 });
    }

    // ===============================
    // ✅ INIT SUPABASE
    // ===============================
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ===============================
    // 🔍 FIND ORDER
    // ===============================
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status")
      .eq("order_number", order_id)
      .single();

    if (error || !order) {
      return new Response("Order not found", { status: 404 });
    }

    // ===============================
    // 🔒 VALIDATE AMOUNT
    // ===============================
    if (amount && Number(order.total) !== amount) {
      return new Response("Amount mismatch", { status: 400 });
    }

    // ===============================
    // ⚠️ PREVENT DOUBLE UPDATE
    // ===============================
    if (order.payment_status === "paid") {
      return new Response("Already processed");
    }

    // ===============================
    // ✅ EDFAPAY STATE HANDLING
    // ===============================
    const resultUpper = String(body.result || "").toUpperCase();
    const statusUpper = String(body.status || "").toUpperCase();

    const isSuccess =
      resultUpper === "SUCCESS" &&
      ["SETTLED", "APPROVED", "SUCCESS", "CAPTURED"].includes(statusUpper);

    const isFailed =
      ["FAILED", "DECLINED", "CANCELLED", "ERROR"].includes(resultUpper) ||
      ["FAILED", "DECLINED", "CANCELLED", "ERROR"].includes(statusUpper);

    const isPending =
      ["PENDING", "REDIRECT"].includes(resultUpper) ||
      ["PENDING", "REDIRECT"].includes(statusUpper);

    // ===============================
    // ✅ HANDLE STATES
    // ===============================
    if (isSuccess) {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_id,
          status: "processing",
        })
        .eq("order_number", order_id);

    } else if (isFailed) {
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("order_number", order_id);

    } else if (isPending) {
      return new Response("Pending");
    }

    return new Response("OK");

  } catch (err) {
    return new Response("Server Error", { status: 500 });
  }
}