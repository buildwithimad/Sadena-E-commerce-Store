"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/AppIcon";
import { formatPriceSAR } from "@/data/products";

export default function OrderClient({ order, lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Format Date
  const orderDate = new Date(order.created_at).toLocaleDateString(
    lang === 'ar' ? 'ar-SA' : 'en-US', 
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // Timeline Configuration
  const steps = [
    { id: 'placed', icon: 'ClipboardDocumentCheckIcon', labelEn: 'Order Placed', labelAr: 'تم الطلب' },
    { id: 'processing', icon: 'CogIcon', labelEn: 'Processing', labelAr: 'قيد التجهيز' },
    { id: 'shipped', icon: 'TruckIcon', labelEn: 'Shipped', labelAr: 'تم الشحن' },
    { id: 'delivered', icon: 'CheckBadgeIcon', labelEn: 'Delivered', labelAr: 'تم التوصيل' }
  ];

  // Logic to determine active step
  const orderStatus = order.status?.toLowerCase() || 'placed';
  const currentIndex = steps.findIndex(s => s.id === orderStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-20">
      
      {/* HEADER BANNER */}
      <div className="bg-[var(--secondary)] py-8 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--foreground)] tracking-tight">
              {lang === 'ar' ? `طلب #${order.order_number}` : `Order #${order.order_number}`}
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1.5 flex items-center gap-2">
              <Icon name="CalendarIcon" size={16} />
              {lang === 'ar' ? 'تاريخ الطلب:' : 'Placed on'} {orderDate}
            </p>
          </div>
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[var(--primary)] hover:text-black transition-colors"
          >
            <Icon name="ArrowLeftIcon" size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            {lang === 'ar' ? 'العودة للتسوق' : 'Back to Shop'}
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* TRACKING TIMELINE */}
        <div className="bg-white border border-[var(--border)] rounded-xl p-6 sm:p-10 mb-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-8 text-center sm:text-start">
            {lang === 'ar' ? 'حالة الطلب' : 'Order Status'}
          </h2>
          
          <div className="relative flex justify-between items-center max-w-3xl mx-auto">
            {/* Background Line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full" />
            
            {/* Active Progress Line */}
            <div 
              className="absolute top-6 left-0 h-1 bg-green-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%`, right: dir === 'rtl' ? 0 : 'auto', left: dir === 'rtl' ? 'auto' : 0 }}
            />

            {steps.map((step, index) => {
              const isCompleted = index <= activeIndex;
              const isCurrent = index === activeIndex;

              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-500 ${
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}
                  >
                    <Icon name={step.icon} size={20} variant={isCompleted ? 'solid' : 'outline'} />
                  </div>
                  <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest mt-4 text-center ${
                    isCompleted ? 'text-[var(--foreground)]' : 'text-gray-400'
                  }`}>
                    {lang === 'ar' ? step.labelAr : step.labelEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: ITEMS */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-[var(--border)] bg-gray-50/50">
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  {lang === 'ar' ? 'المنتجات المطلوبة' : 'Items Ordered'}
                </h2>
              </div>
              
              <ul className="divide-y divide-[var(--border)]">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="p-6 flex items-center gap-4 sm:gap-6 hover:bg-gray-50/50 transition-colors">
                    <div className="relative w-20 h-24 bg-[var(--secondary)] rounded-md overflow-hidden shrink-0 border border-gray-100">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <Icon name="PhotoIcon" size={24} className="absolute inset-0 m-auto text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[var(--foreground)] truncate">{item.name}</h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1 tracking-widest">
                        {lang === 'ar' ? 'الكمية:' : 'QTY:'} <span className="font-bold text-gray-900">{item.quantity}</span>
                      </p>
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <p className="text-sm font-bold text-[var(--foreground)]">
                        {formatPriceSAR(item.price * item.quantity, lang)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatPriceSAR(item.price, lang)} {lang === 'ar' ? 'للقطعة' : 'each'}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: SUMMARY & DETAILS */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Payment Summary */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-[var(--foreground)] mb-5">
                {lang === 'ar' ? 'ملخص الدفع' : 'Payment Summary'}
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>{lang === 'ar' ? 'المجموع الجزئي' : 'Subtotal'}</span>
                  <span className="font-medium text-[var(--foreground)]">{formatPriceSAR(order.subtotal, lang)}</span>
                </div>
                <div className="flex justify-between text-[var(--muted-foreground)]">
                  <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {order.shipping === 0 ? (lang === 'ar' ? 'مجاني' : 'FREE') : formatPriceSAR(order.shipping, lang)}
                  </span>
                </div>
                <div className="border-t border-[var(--border)] mt-3 pt-3 flex justify-between items-center">
                  <span className="font-bold text-[var(--foreground)]">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-xl font-display font-bold text-green-600">
                    {formatPriceSAR(order.total, lang)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-[var(--foreground)] mb-5 flex items-center gap-2">
                <Icon name="UserCircleIcon" size={18} className="text-gray-400" />
                {lang === 'ar' ? 'معلومات العميل' : 'Customer Info'}
              </h2>
              <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <p className="font-semibold text-[var(--foreground)]">
                  {order.customer_first_name} {order.customer_last_name}
                </p>
                <p className="flex items-center gap-2">
                  <Icon name="EnvelopeIcon" size={14} /> {order.customer_email}
                </p>
                {order.customer_phone && (
                  <p className="flex items-center gap-2" dir="ltr">
                    <Icon name="PhoneIcon" size={14} /> {order.customer_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-[var(--foreground)] mb-5 flex items-center gap-2">
                <Icon name="MapPinIcon" size={18} className="text-gray-400" />
                {lang === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
              </h2>
              <div className="space-y-1 text-sm text-[var(--muted-foreground)] leading-relaxed">
                <p>{order.shipping_street}</p>
                <p>{order.shipping_city}, {order.shipping_country}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}