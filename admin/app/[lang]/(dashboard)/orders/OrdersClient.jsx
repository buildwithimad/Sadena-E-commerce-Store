'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function OrdersClient({ lang = 'en', orders = [], total = 0, currentPage = 1, totalPages = 1, limit = 10 }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Translations
  const translations = {
    en: {
      title: 'Orders', export: 'Export CSV', search: 'Search orders...', filterStatus: 'All Statuses',
      table: { orderId: 'Order ID', customer: 'Customer', date: 'Date', status: 'Status', total: 'Total', action: 'Action' },
      status: { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next' },
      delete: { title: 'Delete Order', message: 'Are you sure you want to delete order', cancel: 'Cancel', confirm: 'Delete' },
      empty: 'No orders found.'
    },
    ar: {
      title: 'الطلبات', export: 'تصدير CSV', search: 'البحث في الطلبات...', filterStatus: 'جميع الحالات',
      table: { orderId: 'رقم الطلب', customer: 'العميل', date: 'التاريخ', status: 'الحالة', total: 'الإجمالي', action: 'إجراء' },
      status: { pending: 'قيد الانتظار', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي' },
      delete: { title: 'حذف الطلب', message: 'هل أنت متأكد أنك تريد حذف الطلب', cancel: 'إلغاء', confirm: 'حذف' },
      empty: 'لم يتم العثور على طلبات.'
    }
  };

  const t = translations[lang] || translations.en;

  // Formatting
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const formatCurrency = (val) => new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { style: 'currency', currency: 'SAR' }).format(val || 0);
  const formatDate = (dateString) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString));

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
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
      router.refresh();
    } catch (err) {
      alert('Error deleting order');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering (if needed beyond API pagination)
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id?.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">{t.title}</h1>
        <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-95">
          <Icon name="ArrowDownTrayIcon" size={16} />
          {t.export}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-200">
          <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm px-3 w-full text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="sm:w-56 flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-200 relative cursor-pointer group">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-gray-700 appearance-none cursor-pointer z-10"
          >
            <option value="all">{t.filterStatus}</option>
            {Object.keys(t.status).map(k => <option key={k} value={k}>{t.status[k]}</option>)}
          </select>
          <Icon name="ChevronDownIcon" size={16} className={`text-gray-400 absolute pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className={`text-[11px] uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-6 py-4 font-bold">{t.table.orderId}</th>
                <th className="px-6 py-4 font-bold">{t.table.customer}</th>
                <th className="px-6 py-4 font-bold">{t.table.date}</th>
                <th className="px-6 py-4 font-bold">{t.table.status}</th>
                <th className="px-6 py-4 font-bold">{t.table.total}</th>
                <th className="px-6 py-4 font-bold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="bg-white hover:bg-gray-50 transition-all duration-200 group">
                    <td className="px-6 py-4 font-mono font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customer_name || 'Guest'}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                        {t.status[order.status?.toLowerCase()] || order.status || t.status.pending}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.total_amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                        <Link 
                          href={`/${lang}/orders/${order.id}`}
                          className="p-2 text-gray-400 bg-white border border-gray-200 hover:text-green-600 hover:bg-green-50 hover:border-green-200 rounded-lg transition-all duration-200 outline-none"
                        >
                          <Icon name="EyeIcon" size={16} />
                        </Link>
                        <button 
                          onClick={() => { setOrderToDelete(order); setIsDeleteModalOpen(true); }}
                          className="p-2 text-gray-400 bg-white border border-gray-200 hover:text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all duration-200 outline-none"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-white font-medium">{t.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">
            {t.pagination.showing} <span className="font-semibold text-gray-900">{startItem}</span> {t.pagination.to} <span className="font-semibold text-gray-900">{endItem}</span> {t.pagination.of} <span className="font-semibold text-gray-900">{total}</span> {t.pagination.results}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t.pagination.prev}
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0}
              className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t.pagination.next}
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-lg border border-gray-200 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{t.delete.title}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {t.delete.message} <span className="font-mono font-bold text-gray-900">#{orderToDelete?.id?.substring(0, 8).toUpperCase()}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                {t.delete.cancel}
              </button>
              <button 
                onClick={handleDelete} disabled={isDeleting}
                className="flex items-center gap-2 px-6 py-2 text-xs font-bold tracking-widest uppercase text-white bg-rose-600 border border-transparent rounded-lg hover:bg-rose-700 transition-all duration-200 disabled:opacity-50"
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