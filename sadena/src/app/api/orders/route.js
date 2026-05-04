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
      lang = "en", // ✅ IMPORTANT
    } = body;

    // =========================
    // 🔥 STEP 6 → TOKEN + ORDER NUMBER
    // =========================
    const token = crypto.randomBytes(16).toString("hex");
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // =========================
    // 🔥 STEP 7 → INSERT ORDER
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
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("ORDER INSERT ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // =========================
    // 🔥 STEP 8 → SEND EMAIL (NON-BLOCKING)
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
    // 🔥 STEP 9 → RESPONSE
    // =========================
    return Response.json({
      order: data,
      orderNumber: data.order_number,
      access_url: `/${lang}/order/${data.order_number}?token=${token}`,
    });

  } catch (err) {
    console.error("ORDER API ERROR:", err);
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}