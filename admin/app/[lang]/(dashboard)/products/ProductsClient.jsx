'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import ProductModal from '@/components/Products/PoductModal';
import DeleteProductModal from '@/components/Products/DeleteModal';

export default function ProductsClient({ 
  lang = 'en', 
  products = [], 
  categories = [], 
  warehouses = [],
  totalPages = 1, 
  currentPage = 1, 
  total = 0,
  limit = 16 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Transition state for Next.js routing
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState(null);

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Custom Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const closeToast = () => setToast(null);

  // Calculate the item numbers for the "Showing X to Y of Z" text
  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const handlePageChange = (newPage, actionType) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLoadingAction(actionType);
      startTransition(() => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
      });
    }
  };

  const handleCreateProduct = async (formData) => {
    try {
      setIsLoading(true);
      showToast("Saving product...", "loading");

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        showToast(result.error || 'Error creating product', 'error');
        return;
      }

      setIsModalOpen(false);
      showToast("Product saved successfully", "success");
      
      setLoadingAction('refresh');
      startTransition(() => {
        router.refresh();
      });

    } catch (err) {
      console.error(err);
      showToast('Something went wrong', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setIsDeleting(true);
      showToast("Deleting product...", "loading");

      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) {
        showToast(result.error || 'Error deleting product', 'error');
        return;
      }

      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      showToast("Product deleted successfully", "success");
      
      setLoadingAction('refresh');
      startTransition(() => {
        router.refresh();
      });

    } catch (err) {
      console.error(err);
      showToast('Something went wrong while deleting', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const translations = {
    en: {
      title: 'Products', subtitle: 'Manage and monitor all products in your store.', add: 'New Product', search: 'Search products by name or SKU...', filterCategory: 'All Categories', filterStatus: 'All Status', loading: 'Loading...',
      table: { product: 'Product', sku: 'SKU', category: 'Category', price: 'Price (SAR)', stock: 'Stock', status: 'Status', action: 'Actions' },
      status: { published: 'Published', draft: 'Draft' },
      stockState: { inStock: 'In Stock', lowStock: 'Low Stock', out: 'Out of Stock' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next', page: 'page' },
      delete: { title: 'Delete Product', message: 'Are you sure you want to delete', cancel: 'Cancel', confirm: 'Delete' },
      empty: 'No products found.'
    },
    ar: {
      title: 'المنتجات', subtitle: 'إدارة ومراقبة جميع المنتجات في متجرك.', add: 'منتج جديد', search: 'البحث عن منتج بالاسم أو الرمز...', filterCategory: 'جميع الأقسام', filterStatus: 'جميع الحالات', loading: 'جاري التحميل...',
      table: { product: 'المنتج', sku: 'رمز المنتج', category: 'القسم', price: 'السعر (ر.س)', stock: 'المخزون', status: 'الحالة', action: 'إجراءات' },
      status: { published: 'منشور', draft: 'مسودة' },
      stockState: { inStock: 'متوفر', lowStock: 'مخزون منخفض', out: 'غير متوفر' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي', page: 'صفحة' },
      delete: { title: 'حذف المنتج', message: 'هل أنت متأكد أنك تريد حذف', cancel: 'إلغاء', confirm: 'حذف' },
      empty: 'لم يتم العثور على منتجات.'
    }
  };

  const t = translations[lang] || translations.en;

  const getStockIndicator = (stock) => {
    if (stock === 0) return { text: t.stockState.out, dotColor: 'bg-red-500', textColor: 'text-red-600' };
    if (stock < 20) return { text: t.stockState.lowStock, dotColor: 'bg-amber-500', textColor: 'text-amber-600' };
    return { text: t.stockState.inStock, dotColor: 'bg-[#21c45d]', textColor: 'text-zinc-600' };
  };

  // Client-side filtering
  const filteredProducts = products.filter(p => {
    const searchString = `${p.name} ${p.name_ar} ${p.sku}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || String(p.is_published || false) === statusFilter;
    const matchesCategory = categoryFilter === 'all' || String(p.category_id) === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
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
      <div className="hidden md:flex items-center gap-1">
        {pages.map((page, idx) => {
          if (page === '...') {
            return <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-400">...</span>;
          }
          
          const isActive = page === currentPage;
          return (
            <button 
              key={page}
              onClick={() => handlePageChange(page, `page-${page}`)}
              disabled={isPending}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-zinc-100 text-zinc-900 border border-zinc-200' 
                  : 'bg-transparent text-zinc-600 hover:bg-zinc-50 border border-transparent hover:border-zinc-200'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    );
  };

  const inputClass = "w-full bg-white border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#21c45d]/20 focus:border-[#21c45d] transition-all placeholder:text-zinc-400 shadow-sm";

  return (
    <div dir={dir} className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20 text-zinc-900">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-zinc-900">{t.title}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#21c45d] text-white text-sm font-medium rounded-md hover:bg-[#1eb053] transition-all cursor-pointer shadow-sm flex items-center gap-2 justify-center"
        >
          <Icon name="PlusIcon" size={16} /> {t.add}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:w-auto">
          <div className="relative md:w-48">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="all">{t.filterCategory}</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <Icon name="ChevronDownIcon" size={14} className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
          </div>

          <div className="relative md:w-48">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="all">{t.filterStatus}</option>
              <option value="true">{t.status.published}</option>
              <option value="false">{t.status.draft}</option>
            </select>
            <Icon name="ChevronDownIcon" size={14} className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="relative bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300">
            <div className="bg-white px-4 py-2 rounded-md border border-zinc-200 shadow-sm flex items-center gap-2">
              <Icon name="ArrowPathIcon" size={16} className="animate-spin text-[#21c45d]" />
              <span className="text-xs font-medium text-zinc-700">{t.loading}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-medium">
                <th className="px-6 py-3 font-medium">{t.table.product}</th>
                <th className="px-6 py-3 font-medium">{t.table.sku}</th>
                <th className="px-6 py-3 font-medium">{t.table.category}</th>
                <th className="px-6 py-3 font-medium">{t.table.price}</th>
                <th className="px-6 py-3 font-medium">{t.table.stock}</th>
                <th className="px-6 py-3 font-medium">{t.table.status}</th>
                <th className="px-6 py-3 font-medium text-right w-24">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockInfo = getStockIndicator(product.stock);

                  return (
                    <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 border border-zinc-200 overflow-hidden bg-zinc-100`}>
                            {product.images?.[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                  e.currentTarget.classList.add('hidden');
                                }}
                              />
                            ) : (
                              <Icon name="PhotoIcon" size={18} className="text-zinc-400" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-zinc-900 truncate max-w-[200px]">
                              {lang === 'ar' ? product.name_ar || product.name : product.name}
                            </span>
                            <span className="text-xs text-zinc-500 truncate max-w-[200px]">
                              {product.short_description || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-zinc-600">{product.sku || '-'}</td>
                      <td className="px-6 py-3">
                         <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                           {product.category_name || product.category || 'Uncategorized'}
                         </span>
                      </td>
                      <td className="px-6 py-3 font-medium text-zinc-900">SAR {product.price}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${stockInfo.dotColor}`}></span>
                          <span className={`text-sm ${stockInfo.textColor}`}>
                            {product.stock || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${
                          product.is_published 
                            ? 'bg-emerald-50 text-[#21c45d] border-emerald-200' 
                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${product.is_published ? 'bg-[#21c45d]' : 'bg-zinc-400'}`}></span>
                          {product.is_published ? t.status.published : t.status.draft}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setLoadingAction(`view-${product.slug}`);
                              startTransition(() => {
                                router.push(`/${lang}/products/${product.slug}`);
                              });
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded cursor-pointer transition-colors"
                            title="Edit"
                          >
                            {isPending && loadingAction === `view-${product.slug}` ? (
                              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                            ) : (
                              <Icon name="PencilSquareIcon" size={16} />
                            )}
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setProductToDelete(product);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            title="Delete"
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
                  <td colSpan="7" className="px-6 py-12 text-center text-zinc-400 bg-white">
                    {t.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50">
          <p className="text-xs text-zinc-500 font-medium">
            {t.pagination.showing} <span className="font-semibold text-zinc-900">{startItem}</span> {t.pagination.to} <span className="font-semibold text-zinc-900">{endItem}</span> {t.pagination.of} <span className="font-semibold text-zinc-900">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1, 'prev')}
              disabled={currentPage <= 1 || isPending}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
            >
              <Icon name="ChevronLeftIcon" size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
              {t.pagination.prev}
            </button>
            
            {renderPaginationButtons()}

            <button 
              onClick={() => handlePageChange(currentPage + 1, 'next')}
              disabled={currentPage >= totalPages || totalPages === 0 || isPending}
              className="px-3 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
            >
              {t.pagination.next}
              <Icon name="ChevronRightIcon" size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 bg-zinc-900 text-white px-4 py-3 rounded-md shadow-lg border border-zinc-800 text-sm font-medium min-w-[250px]">
          {toast.type === "loading" && <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#21c45d]" />}
          {toast.type === "success" && <Icon name="CheckCircleIcon" size={18} className="text-[#21c45d]" />}
          {toast.type === "error" && <Icon name="ExclamationCircleIcon" size={18} className="text-red-400" />}
          <span className="flex-1">{toast.message}</span>
          {toast.type !== "loading" && (
            <button onClick={closeToast} className="text-zinc-400 hover:text-white cursor-pointer ml-2">
              <Icon name="XMarkIcon" size={16} />
            </button>
          )}
        </div>
      )}

      {/* CREATE MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
        warehouses={warehouses}
        lang={lang}
        isLoading={isLoading}
        bucketName="products"
      />

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteProduct}
        product={productToDelete}
        lang={lang}
        isLoading={isDeleting}
      />
    </div>
  );
}