'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function ProductDetailsClient({ 
  product, 
  lang = 'en', 
  categories = [], 
  warehouses = [], 
  productStock = [] 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  
  // States
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Translations
  const translations = {
    en: {
      back: 'Products', edit: 'Edit Product', delete: 'Delete', cancel: 'Cancel', save: 'Save Changes',
      pricing: 'Pricing & Inventory', price: 'Price (SAR)', discount: 'Discount Price', stock: 'Stock',
      totalStock: 'Total Stock', warehouseAlloc: 'Warehouse Allocations',
      overview: 'Product Overview', sku: 'SKU', name: 'Name (EN)', name_ar: 'Name (AR)', 
      content: 'Content & Descriptions', shortDesc: 'Short Description (EN)', shortDesc_ar: 'Short Description (AR)',
      desc: 'Full Description (EN)', desc_ar: 'Full Description (AR)',
      selectCategory: 'Select Category...', category: 'Category', statusText: 'Status',
      specifications: 'Specifications', tags: 'Tags (Comma separated)',
      benefits: 'Benefits (EN)', benefits_ar: 'Benefits (AR)', 
      usage: 'How to Use (EN)', usage_ar: 'How to Use (AR)', 
      ingredients: 'Ingredients (EN)', ingredients_ar: 'Ingredients (AR)',
      flags: 'Visibility', is_featured: 'Featured', is_best_seller: 'Best Seller', is_on_sale: 'On Sale',
      noData: 'Not provided.',
      status: { published: 'Published', draft: 'Draft' },
      validation: { reqName: 'Required', reqPrice: 'Required', invalidDiscount: 'Must be < price' }
    },
    ar: {
      back: 'المنتجات', edit: 'تعديل المنتج', delete: 'حذف', cancel: 'إلغاء', save: 'حفظ التغييرات',
      pricing: 'التسعير والمخزون', price: 'السعر (ر.س)', discount: 'سعر التخفيض', stock: 'المخزون',
      totalStock: 'إجمالي المخزون', warehouseAlloc: 'توزيع المستودعات',
      overview: 'نظرة عامة', sku: 'رمز المنتج', name: 'الاسم (إنجليزي)', name_ar: 'الاسم (عربي)', 
      content: 'المحتوى والوصف', shortDesc: 'وصف قصير (إنجليزي)', shortDesc_ar: 'وصف قصير (عربي)',
      desc: 'وصف كامل (إنجليزي)', desc_ar: 'وصف كامل (عربي)',
      selectCategory: 'اختر القسم...', category: 'القسم', statusText: 'الحالة',
      specifications: 'المواصفات', tags: 'الوسوم (مفصول بفاصلة)',
      benefits: 'الفوائد (إنجليزي)', benefits_ar: 'الفوائد (عربي)', 
      usage: 'الاستخدام (إنجليزي)', usage_ar: 'الاستخدام (عربي)', 
      ingredients: 'المكونات (إنجليزي)', ingredients_ar: 'المكونات (عربي)',
      flags: 'الظهور', is_featured: 'مميز', is_best_seller: 'الأكثر مبيعاً', is_on_sale: 'تخفيض',
      noData: 'غير متوفر.',
      status: { published: 'منشور', draft: 'مسودة' },
      validation: { reqName: 'مطلوب', reqPrice: 'مطلوب', invalidDiscount: 'يجب أن يكون أقل من السعر' }
    }
  };

  const t = translations[lang] || translations.en;

  const getStatusBadge = (isPublished) => {
    if (isPublished) return 'bg-[#f0fdf4] text-[#2d4d33] border-[#bbf7d0]';
    return 'bg-[#fcfdfc] text-[#6b8e70] border-[#e6eee6]';
  };

  const inputClass = (err) => `w-full bg-[#fcfdfc] border ${err ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-[#e6eee6] focus:border-[#5c8b5d] focus:ring-[#5c8b5d]/10'} rounded-lg px-4 py-2.5 text-sm text-[#0a1f10] focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200`;
  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-[#6b8e70] mb-2";

  const currentTotalStock = isEditing 
    ? (formData.stockData?.length > 0 ? formData.stockData.reduce((sum, item) => sum + (Number(item.stock) || 0), 0) : Number(formData.stock) || 0)
    : (productStock?.length > 0 ? productStock.reduce((sum, item) => sum + (Number(item.stock) || 0), 0) : product.stock || 0);

  const handleEditClick = () => {
    setFormData({
      ...product,
      is_published: product.is_published || false,
      stockData: productStock || [], 
      benefits: product.benefits?.join('\n') || '',
      benefits_ar: product.benefits_ar?.join('\n') || '',
      usage: product.usage?.join('\n') || '',
      usage_ar: product.usage_ar?.join('\n') || '',
      ingredients: product.ingredients?.join('\n') || '',
      ingredients_ar: product.ingredients_ar?.join('\n') || '',
      tags: product.tags?.join(', ') || '',
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({});
    setErrors({});
  };

  const handleWarehouseStockChange = (warehouseId, qty) => {
    const newStockData = [...(formData.stockData || [])];
    const index = newStockData.findIndex(item => item.warehouse_id === warehouseId);
    
    if (index >= 0) {
      newStockData[index].stock = Number(qty) || 0;
    } else {
      newStockData.push({ warehouse_id: warehouseId, stock: Number(qty) || 0 });
    }
    setFormData({ ...formData, stockData: newStockData });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = t.validation.reqName;
    if (!formData.price) newErrors.price = t.validation.reqPrice;
    if (formData.discount_price && Number(formData.discount_price) >= Number(formData.price)) {
      newErrors.discount_price = t.validation.invalidDiscount;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validate()) return;
    try {
      setIsSaving(true);
      const cleanArray = (val) => (!val ? [] : Array.isArray(val) ? val : val.split('\n').map(s => s.trim()).filter(Boolean));
      const cleanTags = (val) => (!val ? [] : Array.isArray(val) ? val : val.split(',').map(s => s.trim()).filter(Boolean));

      const payload = {
        ...formData,
        category_id: typeof formData.category_id === 'object' ? formData.category_id.id : formData.category_id,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        stock: currentTotalStock,
        is_published: Boolean(formData.is_published),
        benefits: cleanArray(formData.benefits), benefits_ar: cleanArray(formData.benefits_ar),
        usage: cleanArray(formData.usage), usage_ar: cleanArray(formData.usage_ar),
        ingredients: cleanArray(formData.ingredients), ingredients_ar: cleanArray(formData.ingredients_ar),
        tags: cleanTags(formData.tags),
        images: Array.isArray(formData.images) ? formData.images : [],
        stockData: (formData.stockData || []).map((item) => ({
          warehouse_id: typeof item.warehouse_id === 'object' ? item.warehouse_id.id : item.warehouse_id,
          stock: Number(item.stock) || 0
        }))
      };

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Update failed');

      setIsEditing(false);
      if (result.data?.slug && result.data.slug !== product.slug) {
        router.replace(`/${lang}/products/${result.data.slug}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      alert(`Error updating product: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div dir={dir} className="bg-[#f8fbf8] min-h-screen text-[#0a1f10] pb-24">
      
      {/* STICKY HEADER */}
      <div className="bg-white border-b border-[#e6eee6] pt-8 pb-6 mb-8 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[#6b8e70]">
            <Link href={`/${lang}/products`} className="hover:text-[#0a1f10] transition-colors font-medium">
              {t.back}
            </Link>
            <span className="text-[#e6eee6]">/</span>
            <span className="text-[#0a1f10] font-semibold truncate max-w-[300px]">{product.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancelClick} disabled={isSaving} className="h-10 inline-flex items-center justify-center bg-white border border-[#e6eee6] text-[#4a6b50] px-5 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#f0f6f0] transition-all disabled:opacity-50">
                  {t.cancel}
                </button>
                <button onClick={handleSaveClick} disabled={isSaving} className="h-10 inline-flex items-center justify-center gap-2 bg-[#5c8b5d] text-white px-6 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#4a724b] transition-all disabled:opacity-50 active:scale-95">
                  {isSaving && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
                  {t.save}
                </button>
              </>
            ) : (
              <button onClick={handleEditClick} className="h-10 inline-flex items-center justify-center gap-2 bg-[#0a1f10] text-white px-6 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#1a3322] transition-all active:scale-95">
                <Icon name="PencilSquareIcon" size={14} />
                {t.edit}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* 1. OVERVIEW (Images + Core Info) */}
        <div className="bg-white rounded-2xl border border-[#e6eee6] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Image Gallery */}
            <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r rtl:lg:border-l rtl:lg:border-r-0 border-[#e6eee6] bg-[#fcfdfc]">
              <div className="aspect-square w-full bg-white rounded-xl border border-[#e6eee6] overflow-hidden flex items-center justify-center p-2 mb-4">
                {activeImage ? (
                  <img src={activeImage} alt={product.name} className="w-full h-full object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <Icon name="PhotoIcon" size={48} className="text-[#e6eee6]" />
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx} onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-[#5c8b5d]' : 'border-transparent hover:border-[#e6eee6]'}`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover rounded-md" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Details */}
            <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a1f10] mb-6 flex items-center gap-2">
                <Icon name="CubeIcon" size={18} className="text-[#88a88f]" />
                {t.overview}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className={labelClass}>{t.name} *</label>
                  {isEditing ? (
                    <div>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass(errors.name)} dir="ltr" />
                      {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                    </div>
                  ) : <p className="text-base font-semibold text-[#0a1f10]">{product.name}</p>}
                </div>
                
                <div>
                  <label className={labelClass}>{t.name_ar}</label>
                  {isEditing ? (
                    <input type="text" value={formData.name_ar || ''} onChange={e => setFormData({...formData, name_ar: e.target.value})} className={inputClass()} dir="rtl" />
                  ) : <p className="text-base font-semibold text-[#0a1f10]" dir="rtl">{product.name_ar || t.noData}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t.sku}</label>
                    {isEditing ? (
                      <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className={inputClass()} dir="ltr" />
                    ) : <p className="text-sm font-mono text-[#4a6b50]">{product.sku || '-'}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>{t.statusText}</label>
                    {isEditing ? (
                      <select 
                        value={formData.is_published ? 'true' : 'false'} 
                        onChange={(e) => setFormData({...formData, is_published: e.target.value === 'true'})} 
                        className={inputClass()}
                      >
                        <option value="true">{t.status.published}</option>
                        <option value="false">{t.status.draft}</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getStatusBadge(product.is_published)}`}>
                        {product.is_published ? t.status.published : t.status.draft}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t.category}</label>
                  {isEditing ? (
                    <select value={formData.category_id || ''} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className={inputClass()}>
                      <option value="" disabled>{t.selectCategory}</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{lang === 'ar' ? cat.name_ar || cat.label_ar : cat.name || cat.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-[#4a6b50]">{product.category_name || t.noData}</p>
                  )}
                </div>

                <div className="md:col-span-2 pt-4 border-t border-[#e6eee6]">
                  <label className={labelClass}>{t.flags}</label>
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-6 mt-3">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={formData.is_featured || false} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-4 h-4 text-[#5c8b5d] bg-[#fcfdfc] border-[#e6eee6] rounded focus:ring-[#5c8b5d]" />
                        <span className="text-sm font-medium text-[#4a6b50]">{t.is_featured}</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={formData.is_best_seller || false} onChange={e => setFormData({...formData, is_best_seller: e.target.checked})} className="w-4 h-4 text-[#5c8b5d] bg-[#fcfdfc] border-[#e6eee6] rounded focus:ring-[#5c8b5d]" />
                        <span className="text-sm font-medium text-[#4a6b50]">{t.is_best_seller}</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={formData.is_on_sale || false} onChange={e => setFormData({...formData, is_on_sale: e.target.checked})} className="w-4 h-4 text-[#5c8b5d] bg-[#fcfdfc] border-[#e6eee6] rounded focus:ring-[#5c8b5d]" />
                        <span className="text-sm font-medium text-[#4a6b50]">{t.is_on_sale}</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.is_featured && <span className="px-3 py-1 bg-[#f0f6f0] text-[#2d4d33] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#d9e6d9]">{t.is_featured}</span>}
                      {product.is_best_seller && <span className="px-3 py-1 bg-[#fffcf0] text-[#b38a22] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#fcedc2]">{t.is_best_seller}</span>}
                      {product.is_on_sale && <span className="px-3 py-1 bg-[#fff5f5] text-[#c95252] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#ffe0e0]">{t.is_on_sale}</span>}
                      {!product.is_featured && !product.is_best_seller && !product.is_on_sale && <span className="text-sm text-[#88a88f]">{t.noData}</span>}
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* 2. PRICING & INVENTORY */}
        <div className="bg-white rounded-2xl border border-[#e6eee6] p-6 sm:p-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a1f10] mb-6 flex items-center gap-2">
            <Icon name="BanknotesIcon" size={18} className="text-[#5c8b5d]" />
            {t.pricing}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <label className={labelClass}>{t.price} *</label>
              {isEditing ? (
                <>
                  <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className={inputClass(errors.price)} dir="ltr" />
                  {errors.price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.price}</p>}
                </>
              ) : (
                <p className={`text-2xl font-bold ${product.is_on_sale ? 'text-[#88a88f] line-through text-lg' : 'text-[#0a1f10]'}`}>{product.price}</p>
              )}
            </div>
            
            <div>
              <label className={labelClass}>{t.discount}</label>
              {isEditing ? (
                <>
                  <input type="number" value={formData.discount_price || ''} onChange={e => setFormData({...formData, discount_price: e.target.value})} className={inputClass(errors.discount_price)} dir="ltr" />
                  {errors.discount_price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.discount_price}</p>}
                </>
              ) : (
                product.is_on_sale && product.discount_price ? <p className="text-2xl font-bold text-[#5c8b5d]">{product.discount_price}</p> : <p className="text-sm text-[#88a88f] mt-2">-</p>
              )}
            </div>

            <div>
              <label className={labelClass}>{t.totalStock}</label>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2.5 h-2.5 rounded-full ${currentTotalStock > 10 ? 'bg-[#5c8b5d]' : currentTotalStock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                <p className="text-2xl font-bold text-[#0a1f10]">{currentTotalStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#fcfdfc] border border-[#e6eee6] p-6 rounded-xl">
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#6b8e70] block mb-4">
              {t.warehouseAlloc}
            </label>
            {warehouses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {warehouses.map((w) => {
                  const whStock = isEditing 
                    ? (formData.stockData?.find(s => s.warehouse_id === w.id)?.stock || '')
                    : (productStock?.find(s => s.warehouse_id === w.id)?.stock || 0);

                  return (
                    <div key={w.id} className="flex items-center justify-between bg-white border border-[#e6eee6] p-4 rounded-lg">
                      <span className="text-sm font-medium text-[#4a6b50] truncate mr-4">
                        {lang === 'ar' ? w.name_ar || w.name : w.name}
                      </span>
                      {isEditing ? (
                        <input 
                          type="number" min="0" value={whStock} 
                          onChange={(e) => handleWarehouseStockChange(w.id, e.target.value)} 
                          className="w-24 bg-[#fcfdfc] border border-[#e6eee6] rounded-md px-3 py-1.5 text-sm text-center font-bold text-[#0a1f10] focus:border-[#5c8b5d] focus:ring-1 focus:ring-[#5c8b5d] outline-none" 
                          placeholder="0" dir="ltr"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#0a1f10] bg-[#f0f6f0] px-3 py-1.5 rounded-md border border-[#e6eee6]">{whStock}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              isEditing ? <input type="number" value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: e.target.value})} className={inputClass()} placeholder="0" dir="ltr"/> : <p className="text-sm text-[#88a88f]">{t.noData}</p>
            )}
          </div>
        </div>

        {/* 3. CONTENT & DESCRIPTIONS */}
        <div className="bg-white rounded-2xl border border-[#e6eee6] p-6 sm:p-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a1f10] mb-6 flex items-center gap-2">
            <Icon name="DocumentTextIcon" size={18} className="text-blue-500" />
            {t.content}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className={labelClass}>{t.shortDesc}</label>
                {isEditing ? (
                  <textarea rows={3} value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                ) : <p className="text-sm text-[#4a6b50] leading-relaxed">{product.short_description || t.noData}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.desc}</label>
                {isEditing ? (
                  <textarea rows={6} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                ) : <p className="text-sm text-[#4a6b50] leading-relaxed">{product.description || t.noData}</p>}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className={labelClass}>{t.shortDesc_ar}</label>
                {isEditing ? (
                  <textarea rows={3} value={formData.short_description_ar || ''} onChange={e => setFormData({...formData, short_description_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                ) : <p className="text-sm text-[#4a6b50] leading-relaxed" dir="rtl">{product.short_description_ar || t.noData}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.desc_ar}</label>
                {isEditing ? (
                  <textarea rows={6} value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                ) : <p className="text-sm text-[#4a6b50] leading-relaxed" dir="rtl">{product.description_ar || t.noData}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* 4. SPECIFICATIONS (Benefits, Usage, Ingredients) */}
        <div className="bg-white rounded-2xl border border-[#e6eee6] p-6 sm:p-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#0a1f10] mb-6 flex items-center gap-2">
            <Icon name="SparklesIcon" size={18} className="text-amber-500" />
            {t.specifications}
          </h2>

          <div className="mb-8 pb-8 border-b border-[#e6eee6]">
            <label className={labelClass}>{t.tags}</label>
            {isEditing ? (
              <input type="text" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="organic, fresh, mint" className={inputClass()} dir="ltr" />
            ) : product.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#fcfdfc] border border-[#e6eee6] rounded-md text-[11px] font-bold text-[#4a6b50] uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            ) : <p className="text-sm text-[#88a88f]">{t.noData}</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10">
            {/* EN Column */}
            <div className="space-y-8">
              <div>
                <label className={labelClass}>{t.benefits}</label>
                {isEditing ? (
                  <textarea rows={4} value={formData.benefits || ''} onChange={e => setFormData({...formData, benefits: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                ) : product.benefits?.length > 0 ? (
                  <ul className="space-y-2 mt-2">
                    {product.benefits.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#4a6b50] font-medium"><Icon name="CheckCircleIcon" size={16} className="text-[#5c8b5d] shrink-0 mt-0.5" />{item}</li>)}
                  </ul>
                ) : <p className="text-sm text-[#88a88f]">{t.noData}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.usage}</label>
                {isEditing ? (
                  <textarea rows={4} value={formData.usage || ''} onChange={e => setFormData({...formData, usage: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                ) : product.usage?.length > 0 ? (
                  <ul className="space-y-2 mt-2">
                    {product.usage.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#4a6b50] font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#5c8b5d] shrink-0 mt-1.5" />{item}</li>)}
                  </ul>
                ) : <p className="text-sm text-[#88a88f]">{t.noData}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.ingredients}</label>
                {isEditing ? (
                  <textarea rows={4} value={formData.ingredients || ''} onChange={e => setFormData({...formData, ingredients: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                ) : product.ingredients?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.ingredients.map((item, i) => <span key={i} className="px-2.5 py-1 bg-[#f0f6f0] border border-[#e6eee6] rounded-md text-[11px] font-bold text-[#4a6b50]">{item}</span>)}
                  </div>
                ) : <p className="text-sm text-[#88a88f]">{t.noData}</p>}
              </div>
            </div>

            {/* AR Column */}
            <div className="space-y-8">
              <div>
                <label className={labelClass}>{t.benefits_ar}</label>
                {isEditing ? (
                  <textarea rows={4} value={formData.benefits_ar || ''} onChange={e => setFormData({...formData, benefits_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                ) : product.benefits_ar?.length > 0 ? (
                  <ul className="space-y-2 mt-2" dir="rtl">
                    {product.benefits_ar.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#4a6b50] font-medium"><Icon name="CheckCircleIcon" size={16} className="text-[#5c8b5d] shrink-0 mt-0.5" />{item}</li>)}
                  </ul>
                ) : <p className="text-sm text-[#88a88f]" dir="rtl">{t.noData}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.usage_ar}</label>
                {isEditing ? (
                  <textarea rows={4} value={formData.usage_ar || ''} onChange={e => setFormData({...formData, usage_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                ) : product.usage_ar?.length > 0 ? (
                  <ul className="space-y-2 mt-2" dir="rtl">
                    {product.usage_ar.map((item, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#4a6b50] font-medium"><div className="w-1.5 h-1.5 rounded-full bg-[#5c8b5d] shrink-0 mt-1.5" />{item}</li>)}
                  </ul>
                ) : <p className="text-sm text-[#88a88f]" dir="rtl">{t.noData}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.ingredients_ar}</label>
                {isEditing ? (
                  <textarea rows={4} value={formData.ingredients_ar || ''} onChange={e => setFormData({...formData, ingredients_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                ) : product.ingredients_ar?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2" dir="rtl">
                    {product.ingredients_ar.map((item, i) => <span key={i} className="px-2.5 py-1 bg-[#f0f6f0] border border-[#e6eee6] rounded-md text-[11px] font-bold text-[#4a6b50]">{item}</span>)}
                  </div>
                ) : <p className="text-sm text-[#88a88f]" dir="rtl">{t.noData}</p>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}