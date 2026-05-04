'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';

export default function OrdersClient({ lang = 'en', orders = [], total = 0, currentPage = 1, totalPages = 1, limit = 10 }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Loading & Transition State
  const [isPending, startTransition] = useTransition();
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Translations
  const translations = {
    en: {
      title: 'Orders', export: 'Export CSV', search: 'Search orders...', filterStatus: 'All Statuses', loading: 'Loading...',
      table: { order: 'Order', customer: 'Customer', date: 'Date', status: 'Status', total: 'Total', action: 'Action' },
      status: { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next' },
      delete: { title: 'Delete Order', message: 'Are you sure you want to delete order', cancel: 'Cancel', confirm: 'Delete' },
      empty: 'No orders found.',
      itemsCount: (count) => count === 1 ? '1 Item' : `${count} Items`
    },
    ar: {
      title: 'الطلبات', export: 'تصدير CSV', search: 'البحث في الطلبات...', filterStatus: 'جميع الحالات', loading: 'جاري التحميل...',
      table: { order: 'الطلب', customer: 'العميل', date: 'التاريخ', status: 'الحالة', total: 'الإجمالي', action: 'إجراء' },
      status: { pending: 'قيد الانتظار', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي' },
      delete: { title: 'حذف الطلب', message: 'هل أنت متأكد أنك تريد حذف الطلب', cancel: 'إلغاء', confirm: 'حذف' },
      empty: 'لم يتم العثور على طلبات.',
      itemsCount: (count) => count === 1 ? 'عنصر واحد' : `${count} عناصر`
    }
  };

  const t = translations[lang] || translations.en;

  // Formatting
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const formatCurrency = (val) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(val || 0);
  const formatDate = (dateString) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));

  // Custom flat, clean status badges
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-[#fffcf0] text-[#b38a22] border-[#fcedc2]';
      case 'processing': return 'bg-[#f0f6f0] text-[#4a6b50] border-[#d9e6d9]';
      case 'shipped': return 'bg-[#f0f8ff] text-[#3b6b9e] border-[#d9ebff]';
      case 'delivered': return 'bg-[#f0fdf4] text-[#2d4d33] border-[#bbf7d0]';
      case 'cancelled': return 'bg-[#fff5f5] text-[#c95252] border-[#ffe0e0]';
      default: return 'bg-[#fcfdfc] text-[#6b8e70] border-[#e6eee6]';
    }
  };

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      
      // Wrap router push in transition to show loading state
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/orders/${orderToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      alert('Error deleting order');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering
  const filteredOrders = orders.filter(o => {
    const searchString = `${o.order_number} ${o.customer_first_name} ${o.customer_last_name}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 text-[#0a1f10]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{t.title}</h1>
        <button className="inline-flex items-center justify-center gap-2 bg-white border border-[#e6eee6] text-[#4a6b50] px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-md hover:bg-[#f0f6f0] hover:text-[#0a1f10] transition-colors duration-200 active:scale-95">
          <Icon name="ArrowDownTrayIcon" size={14} />
          {t.export}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-white border border-[#e6eee6] rounded-md px-3 py-2.5 hover:bg-[#fcfdfc] focus-within:bg-white focus-within:border-[#5c8b5d] focus-within:ring-1 focus-within:ring-[#5c8b5d] transition-all duration-200">
          <Icon name="MagnifyingGlassIcon" size={16} className="text-[#88a88f] shrink-0" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm px-3 w-full text-[#0a1f10] placeholder:text-[#88a88f]"
          />
        </div>
        <div className="sm:w-48 flex items-center bg-white border border-[#e6eee6] rounded-md px-3 py-2.5 hover:bg-[#fcfdfc] focus-within:bg-white focus-within:border-[#5c8b5d] focus-within:ring-1 focus-within:ring-[#5c8b5d] transition-all duration-200 relative cursor-pointer group">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-[#0a1f10] appearance-none cursor-pointer z-10"
          >
            <option value="all">{t.filterStatus}</option>
            {Object.keys(t.status).map(k => <option key={k} value={k}>{t.status[k]}</option>)}
          </select>
          <Icon name="ChevronDownIcon" size={14} className={`text-[#88a88f] absolute pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
        </div>
      </div>

      {/* ORDERS TABLE WITH LOADING OVERLAY */}
      <div className="relative bg-white border border-[#e6eee6] rounded-md overflow-hidden flex flex-col">
        
        {/* Table Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300">
            <div className="bg-white px-5 py-3 rounded-md border border-[#e6eee6] shadow-sm flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#5c8b5d]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#4a6b50]">{t.loading}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className={`text-[10px] uppercase tracking-widest text-[#6b8e70] bg-[#fcfdfc] border-b border-[#e6eee6] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-5 py-4 font-semibold">{t.table.order}</th>
                <th className="px-5 py-4 font-semibold">{t.table.customer}</th>
                <th className="px-5 py-4 font-semibold">{t.table.date}</th>
                <th className="px-5 py-4 font-semibold">{t.table.status}</th>
                <th className="px-5 py-4 font-semibold">{t.table.total}</th>
                <th className="px-5 py-4 font-semibold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-[#e6eee6] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const itemCount = order.items?.length || 0;
                  const firstImage = order.items?.[0]?.image;

                  return (
                    <tr key={order.id} className="bg-white hover:bg-[#fbfcfb] transition-colors duration-200 group">
                      
                      {/* Image + Order ID Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#f0f6f0] shrink-0 border border-[#e6eee6]">
                            {firstImage ? (
                              <Image src={firstImage} alt="Product" fill className="object-cover" sizes="40px" />
                            ) : (
                              <Icon name="PhotoIcon" size={16} className="absolute inset-0 m-auto text-[#9cbd9f]" />
                            )}
                          </div>
                          <div>
                            <span className="block font-mono font-medium text-[#0a1f10] group-hover:text-[#5c8b5d] transition-colors">
                              #{order.order_number?.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="block text-[11px] text-[#6b8e70] mt-0.5">
                              {t.itemsCount(itemCount)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-[#0a1f10]">{order.customer_first_name || 'Guest'} {order.customer_last_name || ''}</td>
                      <td className="px-5 py-4 text-[#6b8e70]">{formatDate(order.created_at)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                          {t.status[order.status?.toLowerCase()] || order.status || t.status.pending}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#0a1f10]">{formatCurrency(order.total)}</td>
                      
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                          <Link 
                            href={`/${lang}/orders/${order.order_number || order.id}`}
                            className="p-1.5 text-[#88a88f] bg-white border border-[#e6eee6] hover:text-[#5c8b5d] hover:bg-[#f0f6f0] hover:border-[#d9e6d9] rounded-md transition-all duration-200 outline-none"
                          >
                            <Icon name="EyeIcon" size={14} />
                          </Link>
                          <button 
                            onClick={() => { setOrderToDelete(order); setIsDeleteModalOpen(true); }}
                            className="p-1.5 text-[#88a88f] bg-white border border-[#e6eee6] hover:text-[#c95252] hover:bg-[#fff5f5] hover:border-[#ffe0e0] rounded-md transition-all duration-200 outline-none"
                          >
                            <Icon name="TrashIcon" size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-[#6b8e70] bg-white font-medium">{t.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-5 py-3 border-t border-[#e6eee6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfdfc]">
          <p className="text-[11px] text-[#6b8e70] font-medium uppercase tracking-widest">
            {t.pagination.showing} <span className="font-bold text-[#0a1f10]">{startItem}</span> {t.pagination.to} <span className="font-bold text-[#0a1f10]">{endItem}</span> {t.pagination.of} <span className="font-bold text-[#0a1f10]">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1 || isPending}
              className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#4a6b50] bg-white border border-[#e6eee6] rounded-md hover:bg-[#f0f6f0] hover:text-[#0a1f10] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t.pagination.prev}
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0 || isPending}
              className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#4a6b50] bg-white border border-[#e6eee6] rounded-md hover:bg-[#f0f6f0] hover:text-[#0a1f10] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t.pagination.next}
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a1f10]/20 backdrop-blur-[2px]" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-xl border border-[#e6eee6] w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-[#0a1f10] mb-2">{t.delete.title}</h3>
            <p className="text-sm text-[#6b8e70] mb-6 leading-relaxed">
              {t.delete.message} <span className="font-mono font-bold text-[#0a1f10]">#{orderToDelete?.order_number?.substring(0, 8).toUpperCase()}</span>?
            </p>
            <div className="flex justify-end gap-2.5">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-[#4a6b50] bg-white border border-[#e6eee6] rounded-md hover:bg-[#f0f6f0] transition-colors duration-200 disabled:opacity-50"
              >
                {t.delete.cancel}
              </button>
              <button 
                onClick={handleDelete} disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold tracking-widest uppercase text-white bg-[#d9534f] rounded-md hover:bg-[#c9302c] transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
                {t.delete.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}