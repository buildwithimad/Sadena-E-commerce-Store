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
  
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const translations = {
    en: {
      back: 'Products', edit: 'Edit Product', delete: 'Delete', cancel: 'Cancel', save: 'Save Changes',
      pricing: 'Pricing & Inventory', price: 'Price (SAR)', discount: 'Discount Price (SAR)', stock: 'Stock',
      totalStock: 'Total Stock', warehouseAlloc: 'Warehouse Allocations',
      overview: 'Product Overview', sku: 'SKU', name: 'Product Name (EN)', name_ar: 'Product Name (AR)', 
      content: 'Content & Descriptions', shortDesc: 'Short Description (EN)', shortDesc_ar: 'Short Description (AR)',
      desc: 'Full Description (EN)', desc_ar: 'Full Description (AR)',
      selectCategory: 'Select Category...', category: 'Category', statusText: 'Status',
      specifications: 'Specifications', tags: 'Tags',
      benefits: 'Benefits (EN)', benefits_ar: 'Benefits (AR)', 
      usage: 'How to Use (EN)', usage_ar: 'How to Use (AR)', 
      ingredients: 'Ingredients (EN)', ingredients_ar: 'Ingredients (AR)',
      flags: 'Product Summary', is_featured: 'Featured', is_best_seller: 'Best Seller', is_on_sale: 'On Sale',
      imagesTitle: 'Product Images', addImage: 'Add Image',
      noData: 'Not provided.',
      status: { published: 'Published', draft: 'Draft' },
      validation: { reqName: 'Required', reqPrice: 'Required', invalidDiscount: 'Must be < price' },
      table: { warehouse: 'Warehouse', stock: 'Stock Quantity' },
      meta: { created: 'Created At', updated: 'Updated At' }
    },
    ar: {
      back: 'المنتجات', edit: 'تعديل المنتج', delete: 'حذف', cancel: 'إلغاء', save: 'حفظ التغييرات',
      pricing: 'التسعير والمخزون', price: 'السعر (ر.س)', discount: 'سعر التخفيض (ر.س)', stock: 'المخزون',
      totalStock: 'إجمالي المخزون', warehouseAlloc: 'توزيع المستودعات',
      overview: 'نظرة عامة على المنتج', sku: 'رمز المنتج', name: 'اسم المنتج (إنجليزي)', name_ar: 'اسم المنتج (عربي)', 
      content: 'المحتوى والوصف', shortDesc: 'وصف قصير (إنجليزي)', shortDesc_ar: 'وصف قصير (عربي)',
      desc: 'وصف كامل (إنجليزي)', desc_ar: 'وصف كامل (عربي)',
      selectCategory: 'اختر القسم...', category: 'القسم', statusText: 'الحالة',
      specifications: 'المواصفات', tags: 'الوسوم',
      benefits: 'الفوائد (إنجليزي)', benefits_ar: 'الفوائد (عربي)', 
      usage: 'الاستخدام (إنجليزي)', usage_ar: 'الاستخدام (عربي)', 
      ingredients: 'المكونات (إنجليزي)', ingredients_ar: 'المكونات (عربي)',
      flags: 'ملخص المنتج', is_featured: 'مميز', is_best_seller: 'الأكثر مبيعاً', is_on_sale: 'تخفيض',
      imagesTitle: 'صور المنتج', addImage: 'إضافة صورة',
      noData: 'غير متوفر.',
      status: { published: 'منشور', draft: 'مسودة' },
      validation: { reqName: 'مطلوب', reqPrice: 'مطلوب', invalidDiscount: 'يجب أن يكون أقل من السعر' },
      table: { warehouse: 'المستودع', stock: 'كمية المخزون' },
      meta: { created: 'تاريخ الإنشاء', updated: 'آخر تحديث' }
    }
  };

  const t = translations[lang] || translations.en;

  const getStatusBadge = (isPublished) => {
    if (isPublished) return 'text-[#21c45d]';
    return 'text-gray-500';
  };

  const inputClass = (err) => `w-full bg-white border ${err ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d]'} rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none transition-all duration-300`;
  const labelClass = "block text-xs font-medium text-gray-600 mb-2";

  const currentTotalStock = isEditing 
    ? (formData.stockData?.length > 0 ? formData.stockData.reduce((sum, item) => sum + (Number(item.stock) || 0), 0) : Number(formData.stock) || 0)
    : (productStock?.length > 0 ? productStock.reduce((sum, item) => sum + (Number(item.stock) || 0), 0) : product.stock || 0);

  const handleEditClick = () => {
    setFormData({
      ...product,
      is_published: product.is_published || false,
      images: product.images || [], 
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

  // Image Handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    const newImages = [...formData.images];
    newImages.splice(indexToRemove, 1);
    setFormData({ ...formData, images: newImages });
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
        images: formData.images || [], 
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
      
      if (payload.images.length > 0 && !payload.images[0].startsWith('data:image')) {
        setActiveImage(payload.images[0]);
      }

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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div dir={dir} className="bg-[#f9fafb] min-h-screen text-gray-900 pb-24">
      
      {/* STICKY HEADER */}
      <div className="bg-[#f9fafb] pt-6 pb-6 mb-2 sticky top-0 z-20 transition-all border-b border-gray-200/50">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Link href={`/${lang}/products`} className="hover:text-gray-900 transition-colors cursor-pointer">
                {t.back}
              </Link>
              <span className="text-gray-400">›</span>
              <span className="text-gray-500 cursor-default">Product Details</span>
            </div>
            
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-3 text-sm">
              <span className={`inline-flex items-center gap-1.5 font-medium ${getStatusBadge(product.is_published)}`}>
                <span className={`w-2 h-2 rounded-full ${product.is_published ? 'bg-[#21c45d]' : 'bg-gray-400'}`}></span>
                {product.is_published ? t.status.published : t.status.draft}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 font-medium">{t.sku}: {product.sku || '-'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {isEditing ? (
              <>
                <button onClick={handleCancelClick} disabled={isSaving} className="h-[42px] cursor-pointer inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-6 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50">
                  {t.cancel}
                </button>
                <button onClick={handleSaveClick} disabled={isSaving} className="h-[42px] cursor-pointer inline-flex items-center justify-center gap-2 bg-[#21c45d] text-white px-6 text-sm font-medium rounded-xl hover:bg-[#1eb053] transition-all duration-300 disabled:opacity-50 active:scale-95">
                  {isSaving && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
                  {t.save}
                </button>
              </>
            ) : (
              <>
                <button onClick={handleCancelClick} className="h-[42px] cursor-pointer inline-flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-6 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all duration-300">
                  {t.cancel}
                </button>
                <button onClick={handleEditClick} className="h-[42px] cursor-pointer inline-flex items-center justify-center gap-2 bg-[#21c45d] text-white px-6 text-sm font-medium rounded-xl hover:bg-[#1eb053] transition-all duration-300 active:scale-95">
                  {t.edit}
                </button>
                <button className="h-[42px] w-[42px] cursor-pointer inline-flex items-center justify-center bg-white border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300">
                   <Icon name="TrashIcon" size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        
        {/* LEFT COLUMN (70%) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. PRODUCT OVERVIEW CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Icon name="BookmarkIcon" size={18} className="text-[#21c45d]" variant="outline" />
              {t.overview}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>{t.name}</label>
                {isEditing ? (
                  <div>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass(errors.name)} dir="ltr" />
                    {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name}</p>}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center cursor-default">
                    {product.name}
                  </div>
                )}
              </div>
              
              <div>
                <label className={labelClass}>{t.name_ar}</label>
                {isEditing ? (
                  <input type="text" value={formData.name_ar || ''} onChange={e => setFormData({...formData, name_ar: e.target.value})} className={inputClass()} dir="rtl" />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center justify-end cursor-default" dir="rtl">
                    {product.name_ar || ''}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t.sku}</label>
                {isEditing ? (
                  <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className={inputClass()} dir="ltr" />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center cursor-default">
                    {product.sku || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t.category}</label>
                {isEditing ? (
                  <div className="relative">
                    <select value={formData.category_id || ''} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className={`${inputClass()} appearance-none pr-10 cursor-pointer`}>
                      <option value="" disabled>{t.selectCategory}</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>{lang === 'ar' ? cat.name_ar || cat.label_ar : cat.name || cat.label}</option>
                      ))}
                    </select>
                    <Icon name="ChevronDownIcon" size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center justify-between cursor-default">
                    {product.category_name || t.noData}
                    <Icon name="ChevronDownIcon" size={16} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t.statusText}</label>
                {isEditing ? (
                  <div className="relative">
                    <select 
                      value={formData.is_published ? 'true' : 'false'} 
                      onChange={(e) => setFormData({...formData, is_published: e.target.value === 'true'})} 
                      className={`${inputClass()} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="true">{t.status.published}</option>
                      <option value="false">{t.status.draft}</option>
                    </select>
                    <Icon name="ChevronDownIcon" size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center justify-between cursor-default">
                    {product.is_published ? t.status.published : t.status.draft}
                    <Icon name="ChevronDownIcon" size={16} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t.tags}</label>
                {isEditing ? (
                  <input type="text" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="organic, fresh, mint" className={inputClass()} dir="ltr" />
                ) : (
                   <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center cursor-default">
                    {product.tags?.join(', ') || ''}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. PRICING & INVENTORY CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Icon name="TagIcon" size={18} className="text-[#21c45d]" variant="outline" />
              {t.pricing}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className={labelClass}>{t.price}</label>
                {isEditing ? (
                  <>
                    <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} className={inputClass(errors.price)} dir="ltr" />
                    {errors.price && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.price}</p>}
                  </>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center cursor-default">
                    {product.price}
                  </div>
                )}
              </div>
              
              <div>
                <label className={labelClass}>{t.discount}</label>
                {isEditing ? (
                  <>
                    <input type="number" value={formData.discount_price || ''} onChange={e => setFormData({...formData, discount_price: e.target.value})} className={inputClass(errors.discount_price)} dir="ltr" />
                    {errors.discount_price && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.discount_price}</p>}
                  </>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center cursor-default">
                     {product.discount_price || ''}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>{t.totalStock}</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 min-h-[42px] flex items-center cursor-default">
                  {currentTotalStock}
                </div>
              </div>
            </div>

            {/* Warehouse Allocations Table */}
            <div>
              <label className="text-xs font-semibold text-gray-800 block mb-3">
                {t.warehouseAlloc}
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-xs font-medium text-gray-500 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">{t.table.warehouse}</th>
                      <th className="px-4 py-3">{t.table.stock}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {warehouses.length > 0 ? (
                      warehouses.map((w) => {
                        const whStock = isEditing 
                          ? (formData.stockData?.find(s => s.warehouse_id === w.id)?.stock || '')
                          : (productStock?.find(s => s.warehouse_id === w.id)?.stock || 0);

                        return (
                          <tr key={w.id} className="bg-white hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {lang === 'ar' ? w.name_ar || w.name : w.name}
                            </td>
                            <td className="px-4 py-3">
                              {isEditing ? (
                                <input 
                                  type="number" min="0" value={whStock} 
                                  onChange={(e) => handleWarehouseStockChange(w.id, e.target.value)} 
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d] outline-none transition-all" 
                                  placeholder="0" dir="ltr"
                                />
                              ) : (
                                <span className="text-gray-900">{whStock}</span>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="2" className="px-4 py-6 text-center text-gray-500 cursor-default">No warehouses configured.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 3. CONTENT & DESCRIPTIONS CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={18} className="text-[#21c45d]" variant="outline" />
              {t.content}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>{t.shortDesc}</label>
                  {isEditing ? (
                    <textarea rows={3} value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 min-h-[80px] cursor-default">
                      {product.short_description || ''}
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>{t.desc}</label>
                  {isEditing ? (
                    <textarea rows={5} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 min-h-[120px] cursor-default">
                      {product.description || ''}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>{t.shortDesc_ar}</label>
                  {isEditing ? (
                    <textarea rows={3} value={formData.short_description_ar || ''} onChange={e => setFormData({...formData, short_description_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 min-h-[80px] flex justify-end text-right cursor-default" dir="rtl">
                      {product.short_description_ar || ''}
                    </div>
                  )}
                </div>
                <div>
                  <label className={labelClass}>{t.desc_ar}</label>
                  {isEditing ? (
                    <textarea rows={5} value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} className={`${inputClass()} resize-none`} dir="rtl" />
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 min-h-[120px] flex justify-end text-right cursor-default" dir="rtl">
                      {product.description_ar || ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (30%) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* PRODUCT IMAGES CARD */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Icon name="PhotoIcon" size={18} className="text-[#21c45d]" variant="outline" />
              {t.imagesTitle}
            </h2>
            
            {isEditing ? (
               <div className="space-y-4">
                  <div className="aspect-square w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-2 cursor-pointer">
                    {activeImage ? (
                      <img src={activeImage} alt={product.name} className="w-full h-full object-cover rounded-lg mix-blend-multiply" />
                    ) : (
                      <Icon name="PhotoIcon" size={48} className="text-gray-300" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images?.map((img, idx) => (
                      <div key={idx} className={`relative aspect-square rounded-lg border overflow-hidden group bg-gray-50 cursor-pointer ${activeImage === img ? 'border-[#21c45d]' : 'border-gray-200'}`} onClick={() => setActiveImage(img)}>
                        <img src={img} className="w-full h-full object-cover mix-blend-multiply" alt={`Product ${idx}`} />
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded text-xs opacity-0 group-hover:opacity-100 transition-all hover:bg-white border border-gray-200 shadow-sm cursor-pointer"
                        >
                          <Icon name="TrashIcon" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="w-full py-4 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#21c45d] hover:border-[#21c45d] transition-all duration-300 cursor-pointer bg-white">
                    <Icon name="CloudArrowUpIcon" size={24} className="mb-1" />
                    <span className="text-sm font-medium">{t.addImage}</span>
                    <span className="text-[10px] text-gray-400 mt-1">JPG, PNG up to 5MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
               </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[4/3] w-full bg-[#f4f6f4] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-4 cursor-pointer">
                  {activeImage ? (
                    <img src={activeImage} alt={product.name} className="w-full h-full object-cover rounded-lg mix-blend-multiply" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <Icon name="PhotoIcon" size={48} className="text-gray-200" />
                  )}
                </div>
                {product.images?.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, idx) => (
                      <button 
                        key={idx} onClick={() => setActiveImage(img)}
                        className={`aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 bg-gray-50 ${activeImage === img ? 'border-[#21c45d]' : 'border-transparent hover:border-gray-200'}`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover mix-blend-multiply" />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Visual Add Image box even in view mode to match design perfectly */}
                <div className="w-full py-4 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                    <Icon name="CloudArrowUpIcon" size={20} className="mb-1" />
                    <span className="text-sm font-medium text-gray-600">{t.addImage}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG up to 5MB</span>
                </div>
              </div>
            )}
          </div>

          {/* PRODUCT SUMMARY CARD (FLAGS & META) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-6">
              {t.flags}
            </h2>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Icon name="StarIcon" size={18} variant="outline" className="text-gray-400" />
                  <span className="text-sm font-medium cursor-default">{t.is_featured}</span>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.is_featured || false} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="sr-only peer cursor-pointer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#21c45d]"></div>
                  </label>
                ) : (
                  <div className={`w-9 h-5 rounded-full relative cursor-default ${product.is_featured ? 'bg-[#21c45d]' : 'bg-gray-200'}`}>
                     <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${product.is_featured ? 'left-[18px]' : 'left-[2px]'}`}></div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Icon name="TrophyIcon" size={18} variant="outline" className="text-gray-400" />
                  <span className="text-sm font-medium cursor-default">{t.is_best_seller}</span>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.is_best_seller || false} onChange={e => setFormData({...formData, is_best_seller: e.target.checked})} className="sr-only peer cursor-pointer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#21c45d]"></div>
                  </label>
                ) : (
                   <div className={`w-9 h-5 rounded-full relative cursor-default ${product.is_best_seller ? 'bg-[#21c45d]' : 'bg-gray-200'}`}>
                     <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${product.is_best_seller ? 'left-[18px]' : 'left-[2px]'}`}></div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-600">
                  <Icon name="TagIcon" size={18} variant="outline" className="text-gray-400" />
                  <span className="text-sm font-medium cursor-default">{t.is_on_sale}</span>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.is_on_sale || false} onChange={e => setFormData({...formData, is_on_sale: e.target.checked})} className="sr-only peer cursor-pointer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#21c45d]"></div>
                  </label>
                ) : (
                   <div className={`w-9 h-5 rounded-full relative cursor-default ${product.is_on_sale ? 'bg-[#21c45d]' : 'bg-gray-200'}`}>
                     <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full transition-all ${product.is_on_sale ? 'left-[18px]' : 'left-[2px]'}`}></div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2 text-gray-500 cursor-default">
                     <Icon name="CalendarIcon" size={16} />
                     {t.meta.created}
                   </div>
                   <span className="font-medium text-gray-700 cursor-default">{formatDate(product.created_at)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <div className="flex items-center gap-2 text-gray-500 cursor-default">
                     <Icon name="ClockIcon" size={16} />
                     {t.meta.updated}
                   </div>
                   <span className="font-medium text-gray-700 cursor-default">{formatDate(product.updated_at)}</span>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}