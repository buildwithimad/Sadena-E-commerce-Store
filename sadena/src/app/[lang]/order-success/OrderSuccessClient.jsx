"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";

export default function OrderSuccessClient({ orderNumber, token }) {
  const router = useRouter();
  const { lang = 'en' } = useParams();
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderLink = `/${lang}/order/${orderNumber}${token ? `?token=${token}` : ''}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.origin + orderLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewOrder = () => {
    router.push(orderLink);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 pt-20">
      
      <div className="bg-white border border-[var(--border)] rounded-md p-6 sm:p-10 w-full max-w-md  text-center animate-in zoom-in-95 fade-in duration-500">
        
        {/* SUCCESS ICON (Scaled down for elegance) */}
        <div className="w-16 h-16 mx-auto bg-green-50/80 rounded-full flex items-center justify-center mb-5 shadow-sm border border-green-100">
          <Icon name="CheckBadgeIcon" size={32} className="text-green-500" variant="solid" />
        </div>

        {/* TITLE */}
        <h1 className="text-xl sm:text-2xl font-display font-bold text-[var(--foreground)] tracking-tight mb-2">
          {lang === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!'}
        </h1>

        <p className="text-sm text-[var(--muted-foreground)] mb-6 leading-relaxed px-2">
          {lang === 'ar' 
            ? 'شكراً لتسوقك معنا. تم استلام طلبك بنجاح وسنقوم بمعالجته قريباً.' 
            : 'Thank you for your purchase. Your order has been received and is being processed.'}
        </p>

        {/* ORDER NUMBER (Subtle Box) */}
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">
            {lang === 'ar' ? 'رقم الطلب' : 'Order Number'}
          </p>
          <p className="text-lg font-display font-bold text-[var(--foreground)] tracking-wider">
            #{orderNumber}
          </p>
        </div>

        {/* ACTION BUTTONS (Slimmer & tighter) */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleViewOrder}
            className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] text-white py-3.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:bg-[#1a4a31] active:scale-95 shadow-sm"
          >
            <Icon name="EyeIcon" size={16} variant="outline" />
            {lang === 'ar' ? 'عرض تفاصيل الطلب' : 'View Order Details'}
          </button>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 border py-3.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 ${
              copied 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-white border-[var(--border)] text-[var(--foreground)] hover:bg-gray-50'
            }`}
          >
            {copied ? (
              <>
                <Icon name="CheckIcon" size={16} />
                {lang === 'ar' ? 'تم النسخ!' : 'Link Copied!'}
              </>
            ) : (
              <>
                <Icon name="LinkIcon" size={16} variant="outline" />
                {lang === 'ar' ? 'نسخ رابط الطلب' : 'Copy Tracking Link'}
              </>
            )}
          </button>
        </div>

        {/* INFO FOOTER */}
        <p className="text-[10px] text-[var(--muted-foreground)] mt-5 font-medium">
          {lang === 'ar' 
            ? 'احتفظ بهذا الرابط لتتبع حالة طلبك في أي وقت.' 
            : 'Save this link to track your order status anytime.'}
        </p>

      </div>
    </div>
  );
}