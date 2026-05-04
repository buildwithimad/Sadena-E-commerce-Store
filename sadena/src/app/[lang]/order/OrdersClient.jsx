"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";
import RevealOnScroll from "@/components/RevealOnScroll";
import { formatPriceSAR } from "@/data/products";

export default function OrdersClient({ lang }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const dir = lang === "ar" ? "rtl" : "ltr";
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/user-orders");
        if (!res.ok) return;
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to format status badges with flat colors
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'placed';
    switch (s) {
      case 'delivered':
        return { bg: 'bg-[#5c8b5d] text-white', labelEn: 'Delivered', labelAr: 'تم التوصيل', icon: 'CheckBadgeIcon' };
      case 'shipped':
        return { bg: 'bg-[#1a3b47] text-white', labelEn: 'Shipped', labelAr: 'تم الشحن', icon: 'TruckIcon' };
      case 'processing':
        return { bg: 'bg-[#d4a373] text-white', labelEn: 'Processing', labelAr: 'قيد التجهيز', icon: 'CogIcon' };
      case 'placed':
      default:
        return { bg: 'bg-black text-white', labelEn: 'Order Placed', labelAr: 'تم الطلب', icon: 'ClipboardDocumentCheckIcon' };
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div dir={dir} className="min-h-screen bg-[var(--background)] pt-32 pb-20 flex items-center justify-center">
        <Icon name="ArrowPathIcon" size={32} className="animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-16 mt-10">
      
      {/* BREADCRUMB - Clean and minimal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <nav className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          <Link href={`/${lang}`} className="hover:text-[var(--foreground)] transition-colors">
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)]">
            {lang === 'ar' ? 'طلباتي' : 'My Orders'}
          </span>
        </nav>
      </div>

      {/* HEADER: Brush Stroke Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20 flex flex-col items-center">
        <RevealOnScroll className="flex justify-center">
          <div className="relative inline-flex items-center justify-center px-12 py-4">
            <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
            <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
            <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />

            <h1 className="relative z-10 font-display text-3xl sm:text-4xl font-bold text-black tracking-tight">
              {lang === 'ar' ? 'طلباتي' : 'My Orders'}
            </h1>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={1}>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-6 text-center">
            {lang === 'ar'
              ? 'تتبع حالة طلباتك واستعرض مشترياتك السابقة.'
              : 'Track your order status and review your past purchases.'}
          </p>
        </RevealOnScroll>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* EMPTY STATE - Minimalist editorial style */}
        {!orders.length ? (
          <RevealOnScroll className="max-w-md mx-auto text-center py-20 px-4">
            <div className="w-24 h-24 mx-auto mb-8 bg-[var(--secondary)] rounded-full flex items-center justify-center">
              <Icon
                name="InboxIcon"
                size={32}
                variant="outline"
                className="text-[var(--muted-foreground)]"
              />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-[var(--foreground)] mb-4">
              {lang === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] mb-10 leading-relaxed">
              {lang === "ar" 
                ? "لم تقم بإجراء أي طلبات حتى الآن. اكتشف منتجاتنا الطبيعية وابدأ التسوق." 
                : "You haven't placed any orders yet. Discover our natural products and start shopping."}
            </p>
            <Link
              href={`/${lang}/products`}
              className="inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white px-10 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-500 hover:bg-[#1a4a31] hover:-translate-y-1"
            >
              {lang === "ar" ? "بدء التسوق" : "Start Shopping"}
              <Icon name="ArrowRightIcon" size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          </RevealOnScroll>
        ) : (
          
          /* FILLED STATE - Flat Editorial Cards */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[var(--muted-foreground)]">
                {lang === 'ar'
                  ? `${orders.length} طلبات`
                  : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {orders.map((order, i) => {
              const statusData = getStatusBadge(order.status);
              const orderDate = new Date(order.created_at).toLocaleDateString(
                lang === 'ar' ? 'ar-SA' : 'en-US', 
                { year: 'numeric', month: 'short', day: 'numeric' }
              );

              return (
                <RevealOnScroll key={order.id} delay={i + 1}>
                  <div className="group bg-transparent border border-[var(--border)] rounded-none p-6 sm:p-8 hover:bg-[var(--secondary)]/30 transition-colors duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-wide">
                          #{order.order_number}
                        </h3>
                        {/* Status Badge - Flat, sharp corners */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-none ${statusData.bg}`}>
                          <Icon name={statusData.icon} size={12} />
                          {lang === "ar" ? statusData.labelAr : statusData.labelEn}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-2">
                        <Icon name="CalendarIcon" size={14} variant="outline" />
                        {lang === "ar" ? "تاريخ الطلب:" : "Placed on"} {orderDate}
                      </p>
                    </div>

                    {/* Right: Price & Action */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-5 border-t border-[var(--border)] sm:border-0 pt-5 sm:pt-0 shrink-0">
                      <div className="text-left sm:text-right rtl:sm:text-left">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">
                          {lang === "ar" ? "الإجمالي" : "Total"}
                        </p>
                        <p className="text-xl font-bold text-[var(--foreground)]">
                          {formatPriceSAR(order.total, lang)}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push(`/${lang}/order/${order.order_number}`)}
                        className="inline-flex items-center justify-center gap-3 border border-[var(--foreground)] bg-transparent text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-white px-8 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-300 active:scale-95"
                      >
                        {lang === "ar" ? "عرض التفاصيل" : "View Details"}
                        <Icon name="ArrowRightIcon" size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}