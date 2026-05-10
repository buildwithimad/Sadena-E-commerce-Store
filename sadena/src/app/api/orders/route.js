import { createClient } from '@/lib/supabaseServer';
import { createAnonClient } from '@/lib/supabaseAnon';
import crypto from 'crypto';
import { validateOrder } from '@/lib/validations/orderValidations';
import { sendOrderEmail } from '@/lib/email/sendOrderEmail';
import { generateHash } from '@/lib/payment/hash';

export async function POST(req) {
  try {
    const serverClient = await createClient();

    const {
      data: { user },
    } = await serverClient.auth.getUser();

    const supabase = user ? serverClient : createAnonClient();

    const body = await req.json();

    // =========================
    // ✅ VALIDATION
    // =========================
    const { valid, errors } = validateOrder(body);

    if (!valid) {
      return Response.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

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

    if (!["cod", "card"].includes(payment_method)) {
      return Response.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // =========================
    // 🧾 CREATE ORDER
    // =========================
    const token = crypto.randomBytes(16).toString("hex");
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

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
          payment_provider: payment_method === "card" ? "edfapay" : null,
        },
      ])
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // =========================
    // 📧 EMAIL
    // =========================
    sendOrderEmail({
      to: customer_email,
      orderNumber,
      token,
      lang,
    }).catch(() => {});

    // =========================
    // 💵 COD
    // =========================
    if (payment_method === "cod") {
      return Response.json({
        order: data,
        orderNumber: data.order_number,
      });
    }

    // =========================
    // 💳 CARD (EDFA PAY)
    // =========================
    if (payment_method === "card") {
      try {

        const hash = generateHash({
          order_id: data.order_number,
          amount: data.total,
          currency: "SAR",
          description: "Order Payment",
          password: process.env.AVAPAY_PASSWORD,
        });

        const formData = new URLSearchParams();

        formData.append("action", "SALE");
        formData.append("edfa_merchant_id", process.env.AVAPAY_MERCHANT_ID);

        formData.append("order_id", data.order_number);
        formData.append("order_amount", data.total);
        formData.append("order_currency", "SAR");
        formData.append("order_description", "Order Payment");

        formData.append("req_token", "N");

        formData.append("payer_first_name", customer_first_name);
        formData.append("payer_last_name", customer_last_name);
        formData.append("payer_address", shipping_street);
        formData.append("payer_country", "SA");
        formData.append("payer_city", shipping_city);
        formData.append("payer_zip", "12221");

        formData.append("payer_email", customer_email);
        formData.append("payer_phone", customer_phone || "966500000000");

        formData.append("payer_ip", "127.0.0.1");

        formData.append(
          "term_url_3ds",
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhook/avapay`
        );

        formData.append("auth", "N");
        formData.append("recurring_init", "N");

        formData.append("hash", hash);

        const resPay = await fetch(
          "https://apidev.edfapay.com/payment/initiate",
          {
            method: "POST",
            body: formData,
          }
        );

        const payData = await resPay.json();

        if (!resPay.ok) {
          return Response.json(
            { error: "Payment failed", details: payData },
            { status: 500 }
          );
        }

        return Response.json({
          order: data,
          payment_url: payData.redirect_url,
        });

      } catch (err) {
  console.error("EDFA PAY ERROR:", err);

  return Response.json(
    { error: "Payment gateway error", details: err.message },
    { status: 500 }
  );
}
    }

  } catch (err) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}