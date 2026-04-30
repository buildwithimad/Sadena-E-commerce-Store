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
      title: 'Products', add: 'Add Product', search: 'Search products by name or SKU...', filterCategory: 'All Categories',
      table: { product: 'Product', sku: 'SKU', category: 'Category', price: 'Price', stock: 'Stock', status: 'Status', action: 'Action' },
      status: { active: 'Active', draft: 'Draft', out_of_stock: 'Out of Stock' },
      stockState: { inStock: 'In Stock', lowStock: 'Low Stock', out: 'Out of Stock' },
      pagination: { showing: 'Showing', to: 'to', of: 'of', results: 'results', prev: 'Previous', next: 'Next' }
    },
    ar: {
      title: 'المنتجات', add: 'إضافة منتج', search: 'البحث عن منتج بالاسم أو الرمز...', filterCategory: 'جميع الأقسام',
      table: { product: 'المنتج', sku: 'رمز المنتج', category: 'القسم', price: 'السعر', stock: 'المخزون', status: 'الحالة', action: 'إجراء' },
      status: { active: 'نشط', draft: 'مسودة', out_of_stock: 'نفذت الكمية' },
      stockState: { inStock: 'متوفر', lowStock: 'مخزون منخفض', out: 'غير متوفر' },
      pagination: { showing: 'عرض', to: 'إلى', of: 'من', results: 'نتائج', prev: 'السابق', next: 'التالي' }
    }
  };

  const t = translations[lang] || translations.en;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'draft': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'out_of_stock': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStockIndicator = (stock) => {
    if (stock === 0) return { text: t.stockState.out, color: 'text-rose-500' };
    if (stock < 20) return { text: `${stock} - ${t.stockState.lowStock}`, color: 'text-amber-500' };
    return { text: `${stock} - ${t.stockState.inStock}`, color: 'text-gray-500' };
  };

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          {t.title}
          {isPending && loadingAction === 'refresh' && (
            <Icon name="ArrowPathIcon" size={18} className="text-gray-400 animate-spin" />
          )}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center cursor-pointer gap-2 bg-green-600 text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95 shadow-sm shadow-green-600/20"
        >
          <Icon name="PlusIcon" size={16} strokeWidth={2.5} />
          {t.add}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-200">
          <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder={t.search}
            className="bg-transparent border-none outline-none text-sm px-3 w-full text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <div className="sm:w-56 flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-200 relative cursor-pointer group">
          <select className="w-full bg-transparent border-none outline-none text-sm text-gray-700 appearance-none cursor-pointer z-10">
            <option value="all">{t.filterCategory}</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <Icon name="ChevronDownIcon" size={16} className={`text-gray-400 group-hover:text-gray-600 transition-colors absolute pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className={`text-[11px] uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-6 py-4 font-bold">{t.table.product}</th>
                <th className="px-6 py-4 font-bold">{t.table.sku}</th>
                <th className="px-6 py-4 font-bold">{t.table.category}</th>
                <th className="px-6 py-4 font-bold">{t.table.price}</th>
                <th className="px-6 py-4 font-bold">{t.table.stock}</th>
                <th className="px-6 py-4 font-bold">{t.table.status}</th>
                <th className="px-6 py-4 font-bold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {products.map((product) => {
                const stockInfo = getStockIndicator(product.stock);

                return (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-all duration-200 group cursor-pointer bg-white ${isPending && loadingAction === `view-${product.id}` ? 'opacity-50 pointer-events-none' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden ${product.images?.[0] ? 'bg-transparent' : 'bg-gray-50'}`}>
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
                            <Icon name="PhotoIcon" size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs font-medium text-gray-500">{product.sku}</td>
                    <td className="px-6 py-4 font-medium text-gray-600">{product.category_name || product.category}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${stockInfo.color}`}>
                        {stockInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(product.status)}`}>
                        {t.status[product.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                        
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLoadingAction(`view-${product.slug}`);
                            startTransition(() => {
                              router.push(`/${lang}/products/${product.slug}`);
                            });
                          }}
                          className="p-2 text-gray-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 outline-none flex items-center justify-center"
                        >
                          {isPending && loadingAction === `view-${product.slug}` ? (
                            <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                          ) : (
                            <Icon name="EyeIcon" size={18} />
                          )}
                        </button>
                        
                        <button className="p-2 text-gray-400 cursor-pointer hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 outline-none">
                          <Icon name="PencilSquareIcon" size={18} />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setProductToDelete(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-gray-400 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 outline-none"
                        >
                          <Icon name="TrashIcon" size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* DYNAMIC PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <p className="text-xs text-gray-500 font-medium">
            {t.pagination.showing} <span className="font-semibold text-gray-900">{startItem}</span> {t.pagination.to} <span className="font-semibold text-gray-900">{endItem}</span> {t.pagination.of} <span className="font-semibold text-gray-900">{total}</span> {t.pagination.results}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1, 'prev')}
              disabled={currentPage <= 1 || isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isPending && loadingAction === 'prev' && <Icon name="ArrowPathIcon" size={14} className="animate-spin text-gray-400" />}
              {t.pagination.prev}
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1, 'next')}
              disabled={currentPage >= totalPages || totalPages === 0 || isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isPending && loadingAction === 'next' && <Icon name="ArrowPathIcon" size={14} className="animate-spin text-gray-400" />}
              {t.pagination.next}
            </button>
          </div>
        </div>

      </div>

      {/* CREATE / EDIT MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
        warehouses={warehouses}
        lang={lang}
        isLoading={isLoading}
      />

      {/* 🔥 DELETE CONFIRMATION MODAL 🔥 */}
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