'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/AppIcon';
// Adjust imports below if you have specific Order modals
import DeleteOrderModal from '@/components/Products/DeleteModal'; // using existing import from your code

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
  const [loadingAction, setLoadingAction] = useState(null);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Translations
  const translations = {
    en: {
      title: 'Orders', subtitle: 'Manage and monitor all orders in your store.', export: 'Export CSV', search: 'Search orders...', filterStatus: 'All Statuses', loading: 'Loading...',
      table: { order: 'Order', customer: 'Customer', date: 'Date', status: 'Status', total: 'Total', action: 'Actions' },
      status: { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next', page: 'page' },
      delete: { title: 'Delete Order', message: 'Are you sure you want to delete order', cancel: 'Cancel', confirm: 'Delete' },
      empty: 'No orders found.',
      itemsCount: (count) => count === 1 ? '1 Item' : `${count} Items`
    },
    ar: {
      title: 'الطلبات', subtitle: 'إدارة ومراقبة جميع الطلبات في متجرك.', export: 'تصدير CSV', search: 'البحث في الطلبات...', filterStatus: 'جميع الحالات', loading: 'جاري التحميل...',
      table: { order: 'الطلب', customer: 'العميل', date: 'التاريخ', status: 'الحالة', total: 'الإجمالي', action: 'إجراءات' },
      status: { pending: 'قيد الانتظار', processing: 'جاري التجهيز', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي', page: 'صفحة' },
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

  // Custom flat, clean status badges matching new design
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-orange-50 text-orange-600 border-orange-100/50';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100/50';
      case 'shipped': return 'bg-purple-50 text-purple-600 border-purple-100/50';
      case 'delivered': return 'bg-[#ecfdf3] text-[#21c45d] border-[#21c45d]/10';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100/50';
      default: return 'bg-gray-100 text-gray-500 border-gray-200/50';
    }
  };

  // Handlers
  const handlePageChange = (newPage, actionType) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLoadingAction(actionType);
      const params = new URLSearchParams(searchParams);
      params.set('page', newPage.toString());
      
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

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage > totalPages - 3) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    return (
      <div className="hidden md:flex items-center gap-1.5">
        {pages.map((page, idx) => {
          if (page === '...') {
            return <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>;
          }
          
          const isActive = page === currentPage;
          return (
            <button 
              key={page}
              onClick={() => handlePageChange(page, `page-${page}`)}
              disabled={isPending}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-semibold transition-colors ${
                isActive 
                  ? 'bg-white border border-[#21c45d] text-[#21c45d]' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div dir={dir} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out text-gray-800 pb-12 ">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{t.title}</h1>
          <p className="text-[15px] text-gray-500">{t.subtitle}</p>
        </div>
        <button className="inline-flex items-center justify-center cursor-pointer gap-2 bg-[#21c45d] text-white px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-[#1eb053] transition-all duration-300 active:scale-95 shadow-sm shadow-[#21c45d]/20">
          <Icon name="ArrowDownTrayIcon" size={18} strokeWidth={2.5} />
          {t.export}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all duration-300 group shadow-sm">
          <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 shrink-0 mr-3" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400 font-medium"
          />
        </div>
        <div className="sm:w-64 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all duration-300 relative cursor-pointer group shadow-sm">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-700 appearance-none cursor-pointer z-10"
          >
            <option value="all">{t.filterStatus}</option>
            {Object.keys(t.status).map(k => <option key={k} value={k}>{t.status[k]}</option>)}
          </select>
          <Icon name="ChevronDownIcon" size={16} className={`text-gray-400 absolute pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
        </div>
      </div>

      {/* ORDERS TABLE WITH LOADING OVERLAY */}
      <div className="relative bg-white border border-gray-100 rounded-[20px] shadow-sm flex flex-col pt-2">
        
        {/* Table Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 rounded-[20px]">
            <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-lg flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#21c45d]" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-widest">{t.loading}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className={`text-[13px] font-semibold text-gray-900 border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-6 py-4">{t.table.order}</th>
                <th className="px-6 py-4">{t.table.customer}</th>
                <th className="px-6 py-4">{t.table.date}</th>
                <th className="px-6 py-4">{t.table.status}</th>
                <th className="px-6 py-4">{t.table.total}</th>
                <th className="px-6 py-4 text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const itemCount = order.items?.length || 0;
                  const firstImage = order.items?.[0]?.image;

                  return (
                    <tr key={order.id} className="bg-white hover:bg-gray-50/50 transition-colors duration-200 group">
                      
                      {/* Image + Order ID Column */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 flex items-center justify-center">
                            {firstImage ? (
                              <Image src={firstImage} alt="Product" fill className="object-cover mix-blend-multiply" sizes="48px" />
                            ) : (
                              <Icon name="PhotoIcon" size={20} className="text-gray-300" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 leading-tight truncate max-w-[220px] text-[14px] mb-0.5">
                              #{order.order_number?.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[12px] text-gray-400 font-medium truncate max-w-[220px]">
                              {t.itemsCount(itemCount)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-[14px] font-medium text-gray-600">{order.customer_first_name || 'Guest'} {order.customer_last_name || ''}</td>
                      <td className="px-6 py-5 text-[14px] font-medium text-gray-500">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium tracking-wide border ${getStatusBadge(order.status)}`}>
                          {t.status[order.status?.toLowerCase()] || order.status || t.status.pending}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[14px] font-semibold text-gray-800">{formatCurrency(order.total)}</td>
                      
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                          <Link 
                            href={`/${lang}/orders/${order.order_number || order.id}`}
                            className="p-2 text-gray-400 cursor-pointer bg-white border border-gray-200 hover:text-[#21c45d] hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 outline-none flex items-center justify-center"
                          >
                            <Icon name="EyeIcon" size={16} />
                          </Link>
                          <button 
                            onClick={() => { setOrderToDelete(order); setIsDeleteModalOpen(true); }}
                            className="p-2 text-gray-400 cursor-pointer bg-white border border-gray-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all duration-200 outline-none flex items-center justify-center"
                          >
                            <Icon name="TrashIcon" size={16} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-gray-500 bg-white font-medium text-[15px]">{t.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (Only shown if totalPages > 1) */}
        {totalPages > 1 && (
          <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-b-[20px]">
            <p className="text-[13px] text-gray-500 font-medium">
              {t.pagination.showing} <span className="font-semibold text-gray-900">{startItem}</span> {t.pagination.to} <span className="font-semibold text-gray-900">{endItem}</span> {t.pagination.of} <span className="font-semibold text-gray-900">{total}</span> {t.pagination.results}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1, 'prev')}
                disabled={currentPage <= 1 || isPending}
                className="px-3 py-2 text-[13px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-1.5"
              >
                <Icon name="ChevronLeftIcon" size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
                {t.pagination.prev}
              </button>
              
              {renderPaginationButtons()}

              <button 
                onClick={() => handlePageChange(currentPage + 1, 'next')}
                disabled={currentPage >= totalPages || totalPages === 0 || isPending}
                className="px-3 py-2 text-[13px] font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-1.5"
              >
                {t.pagination.next}
                <Icon name="ChevronRightIcon" size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
              </button>

              {/* Limit Selector Mockup */}
              <div className="hidden sm:flex relative items-center ml-2">
                 <select className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-[13px] font-medium text-gray-600 focus:outline-none focus:border-[#21c45d] cursor-pointer">
                   <option value="16">10 / {t.pagination.page}</option>
                   <option value="32">20 / {t.pagination.page}</option>
                   <option value="64">50 / {t.pagination.page}</option>
                 </select>
                 <Icon name="ChevronDownIcon" size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL (Inline styling updated to match modern design) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 opacity-100">
            
            {/* Loading Overlay */}
            {isDeleting && (
              <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                  <Icon name="ArrowPathIcon" size={18} className="animate-spin text-red-500" />
                  <span className="text-[13px] font-bold uppercase tracking-widest text-gray-900">Deleting...</span>
                </div>
              </div>
            )}

            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.delete.title}</h2>
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                disabled={isDeleting}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200 outline-none cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Icon name="XMarkIcon" size={20} strokeWidth={2.5}/>
              </button>
            </div>

            <div className="px-6 py-8 bg-white relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5 border-[6px] border-red-50/50">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-red-500" /> 
              </div>
              <p className="text-gray-900 font-semibold mb-2 text-[15px]">
                {t.delete.message} <span className="font-bold text-red-500">#{orderToDelete?.order_number?.substring(0, 8).toUpperCase()}</span>?
              </p>
              <p className="text-[13px] text-gray-500 leading-relaxed max-w-[90%]">
                This action cannot be undone. The order details will be permanently removed.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 z-20">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-6 py-2.5 min-h-[42px] text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {t.delete.cancel}
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-6 py-2.5 min-h-[42px] text-[13px] font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 shadow-sm shadow-red-500/20"
              >
                <Icon name="TrashIcon" size={14} /> {t.delete.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}