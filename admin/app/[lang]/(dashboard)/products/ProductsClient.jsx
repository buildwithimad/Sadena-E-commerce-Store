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
  const [loadingAction, setLoadingAction] = useState(null); // Tracks which button is loading

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'true' (Published), 'false' (Draft)

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
      title: 'Products', add: 'Add Product', search: 'Search products by name or SKU...', filterCategory: 'All Categories', filterStatus: 'All Statuses', loading: 'Loading...',
      table: { product: 'Product', sku: 'SKU', category: 'Category', price: 'Price', stock: 'Stock', status: 'Status', action: 'Action' },
      status: { published: 'Published', draft: 'Draft' },
      stockState: { inStock: 'In Stock', lowStock: 'Low Stock', out: 'Out of Stock' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next' },
      delete: { title: 'Delete Product', message: 'Are you sure you want to delete', cancel: 'Cancel', confirm: 'Delete' },
      empty: 'No products found.'
    },
    ar: {
      title: 'المنتجات', add: 'إضافة منتج', search: 'البحث عن منتج بالاسم أو الرمز...', filterCategory: 'جميع الأقسام', filterStatus: 'جميع الحالات', loading: 'جاري التحميل...',
      table: { product: 'المنتج', sku: 'رمز المنتج', category: 'القسم', price: 'السعر', stock: 'المخزون', status: 'الحالة', action: 'إجراء' },
      status: { published: 'منشور', draft: 'مسودة' },
      stockState: { inStock: 'متوفر', lowStock: 'مخزون منخفض', out: 'غير متوفر' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي' },
      delete: { title: 'حذف المنتج', message: 'هل أنت متأكد أنك تريد حذف', cancel: 'إلغاء', confirm: 'حذف' },
      empty: 'لم يتم العثور على منتجات.'
    }
  };

  const t = translations[lang] || translations.en;

  const getStatusBadge = (isPublished) => {
    if (isPublished) return 'bg-[#f0fdf4] text-[#2d4d33] border-[#bbf7d0]';
    return 'bg-[#fcfdfc] text-[#6b8e70] border-[#e6eee6]';
  };

  const getStockIndicator = (stock) => {
    if (stock === 0) return { text: t.stockState.out, color: 'text-[#c95252]' };
    if (stock < 20) return { text: `${stock} - ${t.stockState.lowStock}`, color: 'text-[#b38a22]' };
    return { text: `${stock} - ${t.stockState.inStock}`, color: 'text-[#4a6b50]' };
  };

  // Client-side filtering
  const filteredProducts = products.filter(p => {
    const searchString = `${p.name} ${p.name_ar} ${p.sku}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || String(p.is_published || false) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-[#0a1f10] pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold tracking-tight flex items-center gap-3">
          {t.title}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center cursor-pointer gap-2 bg-[#5c8b5d] text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-md hover:bg-[#4a724b] transition-colors duration-200 active:scale-95"
        >
          <Icon name="PlusIcon" size={14} strokeWidth={2.5} />
          {t.add}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3">
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
        
        <div className="flex flex-col sm:flex-row gap-3 md:w-[400px]">
          {/* Published / Draft Filter */}
          <div className="flex-1 flex items-center bg-white border border-[#e6eee6] rounded-md px-3 py-2.5 hover:bg-[#fcfdfc] focus-within:bg-white focus-within:border-[#5c8b5d] focus-within:ring-1 focus-within:ring-[#5c8b5d] transition-all duration-200 relative cursor-pointer group">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm text-[#0a1f10] appearance-none cursor-pointer z-10"
            >
              <option value="all">{t.filterStatus}</option>
              <option value="true">{t.status.published}</option>
              <option value="false">{t.status.draft}</option>
            </select>
            <Icon name="ChevronDownIcon" size={14} className={`text-[#88a88f] absolute pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
          </div>

          {/* Category Filter */}
          <div className="flex-1 flex items-center bg-white border border-[#e6eee6] rounded-md px-3 py-2.5 hover:bg-[#fcfdfc] focus-within:bg-white focus-within:border-[#5c8b5d] focus-within:ring-1 focus-within:ring-[#5c8b5d] transition-all duration-200 relative cursor-pointer group">
            <select className="w-full bg-transparent border-none outline-none text-sm text-[#0a1f10] appearance-none cursor-pointer z-10">
              <option value="all">{t.filterCategory}</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <Icon name="ChevronDownIcon" size={14} className={`text-[#88a88f] absolute pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
          </div>
        </div>
      </div>

      {/* PRODUCTS TABLE WITH LOADING OVERLAY */}
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
                <th className="px-5 py-4 font-semibold">{t.table.product}</th>
                <th className="px-5 py-4 font-semibold">{t.table.sku}</th>
                <th className="px-5 py-4 font-semibold">{t.table.category}</th>
                <th className="px-5 py-4 font-semibold">{t.table.price}</th>
                <th className="px-5 py-4 font-semibold">{t.table.stock}</th>
                <th className="px-5 py-4 font-semibold">{t.table.status}</th>
                <th className="px-5 py-4 font-semibold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-[#e6eee6] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stockInfo = getStockIndicator(product.stock);

                  return (
                    <tr key={product.id} className="bg-white hover:bg-[#fbfcfb] transition-colors duration-200 group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 border border-[#e6eee6] overflow-hidden ${product.images?.[0] ? 'bg-transparent' : 'bg-[#f0f6f0]'}`}>
                            {product.images?.[0] ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                  e.currentTarget.classList.add('hidden');
                                }}
                              />
                            ) : (
                              <Icon name="PhotoIcon" size={16} className="text-[#9cbd9f]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#0a1f10] group-hover:text-[#5c8b5d] transition-colors leading-tight truncate max-w-[200px]">
                              {lang === 'ar' ? product.name_ar || product.name : product.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] font-medium text-[#6b8e70]">{product.sku || '-'}</td>
                      <td className="px-5 py-4 font-medium text-[#6b8e70]">{product.category_name || product.category || '-'}</td>
                      <td className="px-5 py-4 font-semibold text-[#0a1f10]">{product.price} SAR</td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-bold ${stockInfo.color}`}>
                          {stockInfo.text}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(product.is_published)}`}>
                          {product.is_published ? t.status.published : t.status.draft}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
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
                            className="p-1.5 text-[#88a88f] bg-white border border-[#e6eee6] hover:text-[#5c8b5d] hover:bg-[#f0f6f0] hover:border-[#d9e6d9] rounded-md transition-all duration-200 outline-none flex items-center justify-center"
                          >
                            {isPending && loadingAction === `view-${product.slug}` ? (
                              <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
                            ) : (
                              <Icon name="PencilSquareIcon" size={14} />
                            )}
                          </button>
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setProductToDelete(product);
                              setIsDeleteModalOpen(true);
                            }}
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
                  <td colSpan="7" className="px-5 py-16 text-center text-[#6b8e70] bg-white font-medium">{t.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC PAGINATION */}
        <div className="px-5 py-3 border-t border-[#e6eee6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fcfdfc]">
          <p className="text-[11px] text-[#6b8e70] font-medium uppercase tracking-widest">
            {t.pagination.showing} <span className="font-bold text-[#0a1f10]">{startItem}</span> {t.pagination.to} <span className="font-bold text-[#0a1f10]">{endItem}</span> {t.pagination.of} <span className="font-bold text-[#0a1f10]">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1, 'prev')}
              disabled={currentPage <= 1 || isPending}
              className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#4a6b50] bg-white border border-[#e6eee6] rounded-md hover:bg-[#f0f6f0] hover:text-[#0a1f10] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t.pagination.prev}
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1, 'next')}
              disabled={currentPage >= totalPages || totalPages === 0 || isPending}
              className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#4a6b50] bg-white border border-[#e6eee6] rounded-md hover:bg-[#f0f6f0] hover:text-[#0a1f10] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {t.pagination.next}
            </button>
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