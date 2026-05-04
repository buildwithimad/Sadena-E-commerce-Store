import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail({
  to,
  orderNumber,
  token,
  lang = "en",
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4028";
  const orderLink = `${baseUrl}/${lang}/order/${orderNumber}?token=${token}`;
  
  // Absolute URL for the logo so email clients can load it
  const logoUrl = `${baseUrl}/logo.png`;

  
  // RTL/LTR dynamic styling
  const dir = lang === "ar" ? "rtl" : "ltr";
  const align = lang === "ar" ? "right" : "left";
  const year = new Date().getFullYear();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${dir}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${lang === "ar" ? "تأكيد الطلب" : "Order Confirmation"}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 20px 10px;">
        <tr>
          <td align="center">
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
              
              <tr>
                <td align="center" style="padding: 32px 20px; border-bottom: 1px solid #f3f4f6; background-color: #ffffff;">
                  <a href="${baseUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="${logoUrl}" alt="${lang === "ar" ? "سادينا" : "SADENA"}" width="140" style="display: block; margin: 0 auto; max-width: 100%; height: auto; border: 0;" />
                  </a>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px; text-align: ${align};">
                  
                  <h2 style="margin-top: 0; margin-bottom: 16px; font-size: 20px; color: #111827;">
                    ${lang === "ar" ? "تم تأكيد طلبك بنجاح!" : "Order Placed Successfully!"}
                  </h2>
                  
                  <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4b5563;">
                    ${lang === "ar" 
                      ? "شكراً لتسوقك معنا. نحن نقوم الآن بتجهيز طلبك وسنعلمك فور شحنه." 
                      : "Thank you for shopping with us. We are getting your order ready to be shipped. We will notify you when it has been sent."}
                  </p>

                  <div style="background-color: #f3f4f6; border-radius: 6px; padding: 24px; margin-bottom: 32px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: bold;">
                      ${lang === "ar" ? "رقم الطلب" : "Order Number"}
                    </p>
                    <p style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">
                      #${orderNumber}
                    </p>
                  </div>

                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center">
                        <a href="${orderLink}" style="display: inline-block; padding: 16px 36px; background-color: #111827; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px;">
                          ${lang === "ar" ? "عرض تفاصيل الطلب" : "View Order Details"}
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 40px 0 8px; font-size: 14px; color: #6b7280;">
                    ${lang === "ar" ? "أو استخدم هذا الرابط للتتبع في أي وقت:" : "Or use this link to track your order anytime:"}
                  </p>
                  <p style="margin: 0; font-size: 14px; word-break: break-all;">
                    <a href="${orderLink}" style="color: #5c8b5d; text-decoration: underline;">
                      ${orderLink}
                    </a>
                  </p>

                </td>
              </tr>

              <tr>
                <td align="center" style="padding: 24px 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                    &copy; ${year} ${lang === "ar" ? "سادينا. جميع الحقوق محفوظة." : "Sadena Store. All rights reserved."}
                  </p>
                </td>
              </tr>

            </table>
            </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const res = await resend.emails.send({
    from: "Sadena Store <onboarding@resend.dev>", // Remember to change this to your verified domain before going live!
    to,
    subject: lang === "ar" 
      ? `تم تأكيد طلبك #${orderNumber}` 
      : `Order Confirmed #${orderNumber}`,
    html: htmlContent,
  });

  return res;
}