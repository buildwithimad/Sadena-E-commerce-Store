import OrderClient from "./OrderClient";
import Icon from "@/components/ui/AppIcon";
import Link from "next/link";
import { getOrder } from "@/service/orderService"; 

export default async function OrderPage({ params, searchParams }) {
  const { lang = 'en', orderNumber } = await params;
  const token = (await searchParams)?.token;

  // Delegate database logic to the service
  const { order, error } = await getOrder(orderNumber, token);

  // Show premium 404 / Unauthorized UI if it fails
  if (error || !order) {
    return <OrderNotFound lang={lang} />;
  }

  return <OrderClient order={order} lang={lang} />;
}

// Reusable Not Found component matching your design
function OrderNotFound({ lang }) {
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--background)] pt-32 pb-16 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="ExclamationTriangleIcon" size={32} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-3">
          {lang === 'ar' ? 'لم يتم العثور على الطلب' : 'Order Not Found'}
        </h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          {lang === 'ar' 
            ? 'عذراً، لا يمكننا العثور على تفاصيل هذا الطلب. تأكد من الرابط أو سجل الدخول.' 
            : 'Sorry, we couldn’t find the details for this order. Check your link or log in.'}
        </p>
        <Link
          href={`/${lang}/products`}
          className="inline-flex items-center justify-center bg-[var(--primary)] text-white px-8 py-3.5 text-sm font-bold tracking-widest uppercase rounded-md transition-all hover:bg-[var(--primary-dark)] shadow-sm"
        >
          {lang === 'ar' ? 'العودة للتسوق' : 'Return to Shop'}
        </Link>
      </div>
    </div>
  );
}