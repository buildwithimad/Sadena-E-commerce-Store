'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

export default function OrderDetailsClient({ lang = 'en', order }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  const [status, setStatus] = useState(order?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const translations = {
    en: {
      back: 'Back to Orders', title: 'Order Details', save: 'Update Status',
      info: { customer: 'Customer Info', orderInfo: 'Order Info', shipping: 'Shipping Address', items: 'Items Ordered', summary: 'Payment Summary' },
      labels: { name: 'Name', date: 'Date', total: 'Total Amount', status: 'Current Status', subtotal: 'Subtotal', shippingFee: 'Shipping Fee' },
      statuses: { placed: 'Placed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      success: 'Status updated successfully',
      error: 'Failed to update status',
      qty: 'Qty'
    },
    ar: {
      back: 'العودة للطلبات', title: 'تفاصيل الطلب', save: 'تحديث الحالة',
      info: { customer: 'معلومات العميل', orderInfo: 'معلومات الطلب', shipping: 'عنوان الشحن', items: 'المنتجات المطلوبة', summary: 'ملخص الدفع' },
      labels: { name: 'الاسم', date: 'التاريخ', total: 'الإجمالي', status: 'الحالة الحالية', subtotal: 'المجموع الجزئي', shippingFee: 'رسوم الشحن' },
      statuses: { placed: 'وضعت', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      success: 'تم تحديث الحالة بنجاح',
      error: 'فشل تحديث الحالة',
      qty: 'الكمية'
    }
  };

  const t = translations[lang] || translations.en;

  const formatCurrency = (val) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(val || 0);
  const formatDate = (dateString) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      
      // Artificial delay for UX feel (optional, but makes the loading state visible)
      await new Promise(res => setTimeout(res, 600));

      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error();
      
      router.refresh();
    } catch (error) {
      alert(t.error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div dir={dir} className="min-h-screen bg-[#f8fbf8] pb-24 text-[#0a1f10] relative">
      
      {/* Global Loading Overlay to prevent interaction while saving */}
      {isUpdating && (
        <div className="fixed inset-0 z-50 bg-white/40 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300">
          <div className="bg-white px-6 py-4 rounded-md border border-[#e6eee6] shadow-sm flex items-center gap-3">
            <Icon name="ArrowPathIcon" size={20} className="animate-spin text-[#5c8b5d]" />
            <span className="text-sm font-medium text-[#4a6b50]">Updating...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#e6eee6] pt-8 pb-6 mb-8 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href={`/${lang}/orders`}
                className="text-[#6b8e70] hover:text-[#0a1f10] transition-colors p-1.5 rounded-md hover:bg-[#f0f6f0]"
              >
                <Icon name="ArrowLeftIcon" size={18} className={dir === 'rtl' ? 'rotate-180' : ''} />
              </Link>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                {t.title}
              </h1>
              <span className="bg-[#f0f6f0] text-[#4a6b50] px-2.5 py-1.5 rounded-md text-xs font-medium font-mono">
                {order.order_number || order.id.substring(0, 8)}
              </span>
            </div>
            <p className="text-sm text-[#6b8e70] flex items-center gap-1.5 sm:pl-10 rtl:sm:pr-10">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Items List */}
            <div className="bg-white border border-[#e6eee6] rounded-md overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e6eee6] bg-[#fcfdfc]">
                <h2 className="text-sm font-medium text-[#0a1f10]">
                  {t.info.items}
                </h2>
              </div>
              
              <ul className="divide-y divide-[#e6eee6]">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="p-6 flex items-center gap-5 hover:bg-[#fbfcfb] transition-colors duration-300">
                    <div className="relative w-16 h-16 bg-[#f0f6f0] rounded-md overflow-hidden shrink-0 border border-[#e6eee6]">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <Icon name="PhotoIcon" size={20} className="absolute inset-0 m-auto text-[#9cbd9f]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#0a1f10] truncate">{item.name}</h3>
                      <p className="text-xs text-[#6b8e70] mt-1.5">
                        {t.qty}: <span className="font-medium text-[#2d4d33]">{item.quantity}</span>
                      </p>
                    </div>

                    <div className="text-right rtl:text-left shrink-0">
                      <p className="text-sm font-medium text-[#0a1f10]">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-[#e6eee6] rounded-md p-6">
              <h2 className="text-sm font-medium text-[#0a1f10] mb-6">
                {t.info.summary}
              </h2>
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between text-[#4a6b50]">
                  <span>{t.labels.subtotal}</span>
                  <span className="font-medium text-[#0a1f10]">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4a6b50]">
                  <span>{t.labels.shippingFee}</span>
                  <span className="font-medium text-[#0a1f10]">{formatCurrency(order.shipping)}</span>
                </div>
                <div className="border-t border-[#e6eee6] mt-5 pt-5 flex justify-between items-center">
                  <span className="font-medium text-[#0a1f10]">{t.labels.total}</span>
                  <span className="text-xl font-semibold text-[#5c8b5d]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Status Update */}
            <div className="bg-white border border-[#e6eee6] rounded-md p-6">
              <h2 className="text-sm font-medium text-[#0a1f10] mb-5">
                {t.labels.status}
              </h2>
              
              <div className="space-y-4">
                <div className="relative">
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isUpdating}
                    className="w-full appearance-none bg-[#fcfdfc] border border-[#e6eee6] text-[#0a1f10] px-4 py-3 pr-10 rtl:pr-4 rtl:pl-10 text-sm font-medium rounded-md outline-none focus:border-[#5c8b5d] focus:ring-1 focus:ring-[#5c8b5d] focus:bg-white cursor-pointer transition-all disabled:opacity-60"
                  >
                    {Object.keys(t.statuses).map(k => <option key={k} value={k}>{t.statuses[k]}</option>)}
                  </select>
                  <Icon name="ChevronDownIcon" size={16} className={`absolute top-1/2 -translate-y-1/2 text-[#88a88f] pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
                </div>

                <button 
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || status === order.status}
                  className="w-full flex items-center justify-center gap-2 bg-[#5c8b5d] text-white px-4 py-3 text-sm font-medium rounded-md transition-all hover:bg-[#4a724b] active:scale-[0.98] disabled:opacity-50 disabled:bg-[#88a88f] disabled:pointer-events-none"
                >
                  {isUpdating ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : <Icon name="CheckIcon" size={16} />}
                  {t.save}
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white border border-[#e6eee6] rounded-md p-6">
              <h2 className="text-sm font-medium text-[#0a1f10] mb-5 flex items-center gap-2">
                <Icon name="UserCircleIcon" size={18} className="text-[#88a88f]" />
                {t.info.customer}
              </h2>
              <div className="space-y-3 text-sm text-[#4a6b50]">
                <p className="font-medium text-[#0a1f10]">
                  {order.customer_first_name || 'Guest'} {order.customer_last_name || ""}
                </p>
                {order.customer_email && (
                  <p className="flex items-center gap-3">
                    <Icon name="EnvelopeIcon" size={14} className="text-[#88a88f]" /> 
                    {order.customer_email}
                  </p>
                )}
                {order.customer_phone && (
                  <p className="flex items-center gap-3" dir="ltr">
                    <Icon name="PhoneIcon" size={14} className="text-[#88a88f]" /> 
                    {order.customer_phone}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[#e6eee6] rounded-md p-6">
              <h2 className="text-sm font-medium text-[#0a1f10] mb-5 flex items-center gap-2">
                <Icon name="MapPinIcon" size={18} className="text-[#88a88f]" />
                {t.info.shipping}
              </h2>
              <div className="text-sm text-[#4a6b50] leading-relaxed">
                {order.shipping_street ? (
                  <>
                    <p>{order.shipping_street}</p>
                    {order.shipping_apt && <p>{order.shipping_apt}</p>}
                    <p>{order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ''} {order.shipping_zip}</p>
                    <p className="mt-2 font-medium text-[#0a1f10]">{order.shipping_country}</p>
                  </>
                ) : (
                  <p className="text-[#88a88f] italic">No shipping data provided.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}