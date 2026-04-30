'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrderDetailsClient({ lang = 'en', order }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  const [status, setStatus] = useState(order?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const translations = {
    en: {
      back: 'Back to Orders', title: 'Order Details', save: 'Update Status',
      info: { customer: 'Customer Info', orderInfo: 'Order Info', name: 'Name', date: 'Date', total: 'Total Amount', status: 'Status' },
      statuses: { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      success: 'Status updated successfully',
      error: 'Failed to update status'
    },
    ar: {
      back: 'العودة للطلبات', title: 'تفاصيل الطلب', save: 'تحديث الحالة',
      info: { customer: 'معلومات العميل', orderInfo: 'معلومات الطلب', name: 'الاسم', date: 'التاريخ', total: 'الإجمالي', status: 'الحالة' },
      statuses: { pending: 'قيد الانتظار', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      success: 'تم تحديث الحالة بنجاح',
      error: 'فشل تحديث الحالة'
    }
  };

  const t = translations[lang] || translations.en;

  const formatCurrency = (val) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'SAR' }).format(val || 0);
  const formatDate = (dateString) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error();
      
      alert(t.success);
      router.refresh();
    } catch (error) {
      alert(t.error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-4xl pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${lang}/orders`}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <Icon name={dir === 'rtl' ? "ArrowRightIcon" : "ArrowLeftIcon"} size={20} />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              {t.title}
              <span className="text-gray-400 font-mono text-lg">#{order.id.substring(0, 8).toUpperCase()}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CUSTOMER INFO */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col hover:bg-gray-50 transition-all duration-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">{t.info.customer}</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
              <Icon name="UserIcon" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{t.info.name}</p>
              <p className="font-bold text-gray-900">{order.customer_name || 'Guest User'}</p>
            </div>
          </div>
          {order.customer_email && (
            <div className="mt-auto pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600 font-medium">
              <Icon name="EnvelopeIcon" size={16} className="text-gray-400" />
              {order.customer_email}
            </div>
          )}
        </div>

        {/* ORDER INFO & STATUS UPDATE */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col hover:bg-gray-50 transition-all duration-200">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">{t.info.orderInfo}</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">{t.info.date}</span>
              <span className="text-sm font-semibold text-gray-900">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">{t.info.total}</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          <div className="mt-auto">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t.info.status}</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-gray-900 px-4 py-2.5 pr-10 rtl:pr-4 rtl:pl-10 text-sm font-bold rounded-lg hover:bg-gray-50 transition-all duration-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 cursor-pointer"
                >
                  {Object.keys(t.statuses).map(k => <option key={k} value={k}>{t.statuses[k]}</option>)}
                </select>
                <Icon name="ChevronDownIcon" size={16} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
              </div>
              <button 
                onClick={handleUpdateStatus}
                disabled={isUpdating || status === order.status}
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-black transition-all duration-200 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400"
              >
                {isUpdating ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : t.save}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}