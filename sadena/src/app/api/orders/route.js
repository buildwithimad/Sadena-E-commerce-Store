import { createClient } from '@/lib/supabaseServer';
import { createAnonClient } from '@/lib/supabaseAnon';
import crypto from 'crypto';
import { validateOrder } from '@/lib/validations/orderValidations';
import { sendOrderEmail } from '@/lib/email/sendOrderEmail';

export async function POST(req) {
  try {
    // =========================
    // 🔥 STEP 1 → DETECT USER
    // =========================
    const serverClient = await createClient();

    const {
      data: { user },
    } = await serverClient.auth.getUser();

    // =========================
    // 🔥 STEP 2 → SELECT CLIENT
    // =========================
    const supabase = user ? serverClient : createAnonClient();

    // =========================
    // 🔥 STEP 3 → PARSE BODY
    // =========================
    const body = await req.json();

    // =========================
    // 🔥 STEP 4 → VALIDATION
    // =========================
    const { valid, errors } = validateOrder(body);

    if (!valid) {
      return Response.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    // =========================
    // 🔥 STEP 5 → EXTRACT DATA
    // =========================
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
      shipping_country,
      payment_method,
      lang = "en",
    } = body;

    // =========================
    // 🔥 STEP 6 → VALIDATE PAYMENT METHOD
    // =========================
    if (!["cod", "card"].includes(payment_method)) {
      return Response.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // =========================
    // 🔥 STEP 7 → TOKEN + ORDER NUMBER
    // =========================
    const token = crypto.randomBytes(16).toString("hex");
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // =========================
    // 🔥 STEP 8 → INSERT ORDER
    // =========================
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user?.id || null,
          items,
          subtotal,
          shipping,
          total,
          status: "placed",

          customer_first_name,
          customer_last_name,
          customer_email,
          customer_phone,

          shipping_street,
          shipping_city,
          shipping_country,

          access_token: token,
          order_number: orderNumber,

          payment_method,
          payment_status: "pending",
          payment_provider: payment_method === "card" ? "avapay" : null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("ORDER INSERT ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // =========================
    // 🔥 STEP 9 → SEND EMAIL
    // =========================
    sendOrderEmail({
      to: customer_email,
      orderNumber,
      token,
      lang,
    }).catch((err) => {
      console.error("Email failed:", err);
    });

    // =========================
    // 💰 STEP 10 → HANDLE PAYMENT
    // =========================

    // ✅ CASH ON DELIVERY
    if (payment_method === "cod") {
      return Response.json({
        order: data,
        orderNumber: data.order_number,
        access_url: `/${lang}/order/${data.order_number}?token=${token}`,
      });
    }

    // ✅ CARD (AVAPAY FORM)
    if (payment_method === "card") {
      return Response.json({
        order: data,

        payment: {
          merchant_id: process.env.AVAPAY_MERCHANT_ID,

          // ⚠️ REQUIRED by Avapay (not ideal, but needed)
          merchant_password: process.env.AVAPAY_MERCHANT_PASSWORD,

          order_id: data.id,
          amount: data.total,
          currency: "SAR",

          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/avapay`,
        },
      });
    }

  } catch (err) {
    console.error("ORDER API ERROR:", err);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}