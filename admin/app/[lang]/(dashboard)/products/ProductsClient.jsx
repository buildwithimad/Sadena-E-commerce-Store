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

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || 'Error creating product');
        return;
      }

      setIsModalOpen(false);
      
      setLoadingAction('refresh');
      startTransition(() => {
        router.refresh();
      });

    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      setIsDeleting(true);

      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || 'Error deleting product');
        return;
      }

      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      
      setLoadingAction('refresh');
      startTransition(() => {
        router.refresh();
      });

    } catch (err) {
      console.error(err);
      alert('Something went wrong while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const translations = {
    en: {
      title: 'Products', subtitle: 'Manage and monitor all products in your store.', add: 'Add Product', search: 'Search products by name or SKU...', filterCategory: 'All Categories', filterStatus: 'All Status', loading: 'Loading...',
      table: { product: 'Product', sku: 'SKU', category: 'Category', price: 'Price (SAR)', stock: 'Stock', status: 'Status', action: 'Actions' },
      status: { published: 'Published', draft: 'Draft' },
      stockState: { inStock: 'In Stock', lowStock: 'Low Stock', out: 'Out of Stock' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next', page: 'page' },
      delete: { title: 'Delete Product', message: 'Are you sure you want to delete', cancel: 'Cancel', confirm: 'Delete' },
      empty: 'No products found.'
    },
    ar: {
      title: 'المنتجات', subtitle: 'إدارة ومراقبة جميع المنتجات في متجرك.', add: 'إضافة منتج', search: 'البحث عن منتج بالاسم أو الرمز...', filterCategory: 'جميع الأقسام', filterStatus: 'جميع الحالات', loading: 'جاري التحميل...',
      table: { product: 'المنتج', sku: 'رمز المنتج', category: 'القسم', price: 'السعر (ر.س)', stock: 'المخزون', status: 'الحالة', action: 'إجراءات' },
      status: { published: 'منشور', draft: 'مسودة' },
      stockState: { inStock: 'متوفر', lowStock: 'مخزون منخفض', out: 'غير متوفر' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي', page: 'صفحة' },
      delete: { title: 'حذف المنتج', message: 'هل أنت متأكد أنك تريد حذف', cancel: 'إلغاء', confirm: 'حذف' },
      empty: 'لم يتم العثور على منتجات.'
    }
  };

  const t = translations[lang] || translations.en;

  const getStatusBadge = (isPublished) => {
    if (isPublished) return 'bg-[#ecfdf3] text-[#21c45d]';
    return 'bg-gray-100 text-gray-500';
  };

  const getStockIndicator = (stock) => {
    if (stock === 0) return { text: t.stockState.out, dotColor: 'bg-red-500' };
    if (stock < 20) return { text: t.stockState.lowStock, dotColor: 'bg-orange-400' };
    return { text: t.stockState.inStock, dotColor: 'bg-[#21c45d]' };
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
    <div dir={dir} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out text-gray-800 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">
            {t.title}
          </h1>
          <p className="text-[15px] text-gray-500">
            {t.subtitle}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center cursor-pointer gap-2 bg-[#21c45d] text-white px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-[#1eb053] transition-all duration-300 active:scale-95 shadow-sm shadow-[#21c45d]/20"
        >
          <Icon name="PlusIcon" size={18} strokeWidth={2.5} />
          {t.add}
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
        
        <div className="flex flex-col sm:flex-row gap-4 md:w-[480px]">
          {/* Category Filter */}
          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all duration-300 relative cursor-pointer group shadow-sm">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-700 appearance-none cursor-pointer z-10"
            >
              <option value="all">{t.filterCategory}</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <Icon name="ChevronDownIcon" size={16} className={`text-gray-400 absolute pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
          </div>

          {/* Published / Draft Filter */}
          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all duration-300 relative cursor-pointer group shadow-sm">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-700 appearance-none cursor-pointer z-10"
            >
              <option value="all">{t.filterStatus}</option>
              <option value="true">{t.status.published}</option>
              <option value="false">{t.status.draft}</option>
            </select>
            <Icon name="ChevronDownIcon" size={16} className={`text-gray-400 absolute pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE WITH LOADING OVERLAY */}
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
                <th className="px-6 py-4">{t.table.product}</th>
                <th className="px-6 py-4">{t.table.sku}</th>
                <th className="px-6 py-4">{t.table.category}</th>
                <th className="px-6 py-4">{t.table.price}</th>
                <th className="px-6 py-4">{t.table.stock}</th>
                <th className="px-6 py-4">{t.table.status}</th>
                <th className="px-6 py-4 text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockInfo = getStockIndicator(product.stock);

                  return (
                    <tr key={product.id} className="bg-white hover:bg-gray-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden bg-gray-50`}>
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
                              <Icon name="PhotoIcon" size={20} className="text-gray-300" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-semibold text-gray-900 leading-tight truncate max-w-[220px] text-[14px] mb-0.5">
                              {lang === 'ar' ? product.name_ar || product.name : product.name}
                            </p>
                            <p className="text-[12px] text-gray-400 font-medium truncate max-w-[220px]">
                              {product.short_description || 'Product details not provided'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[14px] font-medium text-gray-600">{product.sku || '-'}</td>
                      <td className="px-6 py-5">
                         <span className="text-[12px] font-medium text-[#21c45d] bg-[#ecfdf3]/50 px-2.5 py-1 rounded-md border border-[#21c45d]/10 inline-block">
                           {product.category_name || product.category || 'Skincare'}
                         </span>
                      </td>
                      <td className="px-6 py-5 text-[14px] font-semibold text-gray-800">SAR {product.price}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 font-semibold text-gray-900 text-[13px] mb-0.5">
                            <span className={`w-2 h-2 rounded-full ${stockInfo.dotColor}`}></span>
                            {product.stock || 0}
                          </div>
                          <span className="text-[11px] font-medium text-gray-400 ml-3.5">
                            {stockInfo.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-md text-[12px] font-medium tracking-wide ${getStatusBadge(product.is_published)}`}>
                          {product.is_published ? t.status.published : t.status.draft}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLoadingAction(`view-${product.slug}`);
                              startTransition(() => {
                                router.push(`/${lang}/products/${product.slug}`);
                              });
                            }}
                            className="p-2 text-gray-400 cursor-pointer bg-white border border-gray-200 hover:text-[#21c45d] hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 outline-none flex items-center justify-center"
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
                              e.stopPropagation();
                              setProductToDelete(product);
                              setIsDeleteModalOpen(true);
                            }}
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
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-500 bg-white font-medium text-[15px]">{t.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC PAGINATION */}
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
                 <option value="16">16 / {t.pagination.page}</option>
                 <option value="32">32 / {t.pagination.page}</option>
                 <option value="64">64 / {t.pagination.page}</option>
               </select>
               <Icon name="ChevronDownIcon" size={14} className="absolute right-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

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