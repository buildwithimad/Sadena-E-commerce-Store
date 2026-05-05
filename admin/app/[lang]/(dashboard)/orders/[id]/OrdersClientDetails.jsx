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
      info: { customer: 'Customer Information', orderInfo: 'Order Info', shipping: 'Shipping Address', items: 'Items Ordered', summary: 'Payment Summary', notes: 'Order Notes' },
      labels: { name: 'Name', email: 'Email', phone: 'Phone', street: 'Street', apt: 'Apartment, suite, etc.', city: 'City, State, Zip Code', country: 'Country', date: 'Date', total: 'Total Amount', status: 'Current Status', subtotal: 'Subtotal', shippingFee: 'Shipping Fee' },
      statuses: { placed: 'Placed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      success: 'Status updated successfully',
      error: 'Failed to update status',
      qty: 'Qty',
      edit: 'Edit'
    },
    ar: {
      back: 'العودة للطلبات', title: 'تفاصيل الطلب', save: 'تحديث الحالة',
      info: { customer: 'معلومات العميل', orderInfo: 'معلومات الطلب', shipping: 'عنوان الشحن', items: 'المنتجات المطلوبة', summary: 'ملخص الدفع', notes: 'ملاحظات الطلب' },
      labels: { name: 'الاسم', email: 'البريد الإلكتروني', phone: 'الهاتف', street: 'الشارع', apt: 'الشقة، الجناح، إلخ', city: 'المدينة، المنطقة، الرمز البريدي', country: 'الدولة', date: 'التاريخ', total: 'الإجمالي', status: 'الحالة الحالية', subtotal: 'المجموع الجزئي', shippingFee: 'رسوم الشحن' },
      statuses: { placed: 'وضعت', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      success: 'تم تحديث الحالة بنجاح',
      error: 'فشل تحديث الحالة',
      qty: 'الكمية',
      edit: 'تعديل'
    }
  };

  const t = translations[lang] || translations.en;

  const formatCurrency = (val) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(val || 0);
  const formatDate = (dateString) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));

  const getStatusBadge = (statusStr) => {
    switch (statusStr?.toLowerCase()) {
      case 'processing': return 'bg-blue-50 text-blue-500';
      case 'delivered': return 'bg-[#ecfdf3] text-[#21c45d]';
      case 'cancelled': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
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
    <div dir={dir} className="min-h-screen bg-[#f9fafb] text-gray-800">
      
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <Link href={`/${lang}/orders`} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-100 px-3 py-1.5 rounded-xl w-fit">
              <Icon name="ArrowLeftIcon" size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
              {t.back}
            </Link>
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t.title}</h1>
              <span className="bg-[#ecfdf3] text-[#21c45d] px-3 py-1 rounded-lg text-sm font-semibold tracking-wide">
                #{order.order_number || order.id.substring(0, 8)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Icon name="CalendarIcon" size={16} className="text-gray-400" />
              {formatDate(order.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{t.labels.status}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getStatusBadge(order.status)}`}>
                {t.statuses[order.status?.toLowerCase()] || order.status}
              </span>
            </div>
            <div className="h-10 w-px bg-gray-100 mx-2" />
            <div className="flex items-center gap-3">
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isUpdating}
                className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#21c45d]/20 focus:border-[#21c45d] transition-all cursor-pointer min-w-[140px]"
              >
                {Object.keys(t.statuses).map(k => <option key={k} value={k}>{t.statuses[k]}</option>)}
              </select>
              <button 
                onClick={handleUpdateStatus}
                disabled={isUpdating || status === order.status}
                className="flex items-center gap-2 bg-[#21c45d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1eb053] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                {isUpdating ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : <Icon name="CheckCircleIcon" size={18} variant="solid" />}
                {t.save}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Items & Summary */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Items Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2">
              <Icon name="ShoppingBagIcon" size={18} className="text-[#21c45d]" />
              <h2 className="text-[15px] font-bold text-gray-800">{t.info.items}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">{lang === 'ar' ? 'المنتج' : 'Product'}</th>
                    <th className="px-6 py-3 text-center">{lang === 'ar' ? 'الكمية' : 'Quantity'}</th>
                    <th className="px-6 py-3 text-right rtl:text-left">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply" />
                            ) : (
                              <Icon name="PhotoIcon" size={24} className="absolute inset-0 m-auto text-gray-200" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[14px] font-bold text-gray-900 leading-tight">{item.name}</span>
                            <span className="text-xs text-gray-400 font-mono tracking-tight uppercase">SKU: {item.sku || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[14px] font-bold text-gray-900">{item.quantity}</span>
                          <span className="text-[10px] text-gray-400 font-medium">× {formatCurrency(item.price)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right rtl:text-left">
                        <span className="text-[14px] font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="CreditCardIcon" size={18} className="text-[#21c45d]" />
              <h2 className="text-[15px] font-bold text-gray-800">{t.info.summary}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{t.labels.subtotal}</span>
                <span className="text-gray-900 font-bold">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">{t.labels.shippingFee}</span>
                <span className="text-gray-900 font-bold">{formatCurrency(order.shipping)}</span>
              </div>
              <div className="border-t border-dashed border-gray-100 pt-5 mt-4 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">{t.labels.total}</span>
                <span className="text-2xl font-black text-[#21c45d]">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer, Shipping, Notes */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-green-50 text-[#21c45d]">
                <Icon name="UserIcon" size={18} variant="outline" />
              </div>
              <h2 className="text-[15px] font-bold text-gray-800">{t.info.customer}</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{t.labels.name}</label>
                <p className="text-[14px] font-bold text-gray-900">{order.customer_first_name || 'Guest'} {order.customer_last_name || ""}</p>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Icon name="EnvelopeIcon" size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className="min-w-0">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">{t.labels.email}</label>
                  <p className="text-[13px] font-medium text-gray-600 truncate">{order.customer_email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <Icon name="PhoneIcon" size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block">{t.labels.phone}</label>
                  <p className="text-[13px] font-medium text-gray-600" dir="ltr">{order.customer_phone || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-green-50 text-[#21c45d]">
                <Icon name="MapPinIcon" size={18} variant="outline" />
              </div>
              <h2 className="text-[15px] font-bold text-gray-800">{t.info.shipping}</h2>
            </div>
            <div className="space-y-4">
              {order.shipping_street ? (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{t.labels.street}</label>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{order.shipping_street}</p>
                  </div>
                  {order.shipping_apt && (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{t.labels.apt}</label>
                      <p className="text-[13px] font-medium text-gray-600">{order.shipping_apt}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{t.labels.city}</label>
                    <p className="text-[13px] font-medium text-gray-600">
                      {order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ''} {order.shipping_zip}
                    </p>
                  </div>
                  <div className="pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">{t.labels.country}</label>
                    <p className="text-[13px] font-bold text-gray-900">{order.shipping_country}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">No shipping address provided.</p>
              )}
            </div>
          </div>

          {/* Order Notes Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon name="DocumentTextIcon" size={18} className="text-[#21c45d]" />
                <h2 className="text-[15px] font-bold text-gray-800">{t.info.notes}</h2>
              </div>
              <button className="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
                <Icon name="PencilSquareIcon" size={14} />
                {t.edit}
              </button>
            </div>
            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {order.notes || "No additional notes provided for this order."}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}