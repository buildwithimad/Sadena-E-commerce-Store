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
  productStock = [] // 🔥 New prop received from server
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  
  // States
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // ------------------------
  // 🌍 Internal Translations
  // ------------------------
  const translations = {
    en: {
      back: 'Products', edit: 'Edit', delete: 'Delete', cancel: 'Cancel', save: 'Save Changes',
      pricing: 'Pricing & Stock', price: 'Price (SAR)', discount: 'Discount Price', stock: 'Stock',
      totalStock: 'Total Stock', warehouseAlloc: 'Warehouse Stock Allocation',
      details: 'Product Details', sku: 'SKU', name: 'Product Name', description: 'Description',
      selectCategory: 'Select Category...',
      benefits: 'Benefits (One per line)', usage: 'How to Use (One per line)', ingredients: 'Ingredients (One per line)',
      noData: 'No data provided.',
      status: { active: 'Active', draft: 'Draft', out_of_stock: 'Out of Stock' },
      tags: { featured: 'Featured', bestseller: 'Best Seller', sale: 'On Sale' },
      validation: { reqName: 'Required', reqPrice: 'Required', invalidDiscount: 'Must be < price' }
    },
    ar: {
      back: 'المنتجات', edit: 'تعديل', delete: 'حذف', cancel: 'إلغاء', save: 'حفظ التغييرات',
      pricing: 'السعر والمخزون', price: 'السعر (ر.س)', discount: 'التخفيض', stock: 'المخزون',
      totalStock: 'إجمالي المخزون', warehouseAlloc: 'توزيع المخزون في المستودعات',
      details: 'تفاصيل المنتج', sku: 'رمز المنتج', name: 'اسم المنتج', description: 'الوصف',
      selectCategory: 'اختر القسم...',
      benefits: 'الفوائد (سطر لكل عنصر)', usage: 'طريقة الاستخدام (سطر لكل عنصر)', ingredients: 'المكونات (سطر لكل عنصر)',
      noData: 'لا توجد بيانات.',
      status: { active: 'نشط', draft: 'مسودة', out_of_stock: 'نفذت الكمية' },
      tags: { featured: 'مميز', bestseller: 'الأكثر مبيعاً', sale: 'تخفيض' },
      validation: { reqName: 'مطلوب', reqPrice: 'مطلوب', invalidDiscount: 'يجب أن يكون أقل من السعر' }
    }
  };

  const t = translations[lang] || translations.en;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'out_of_stock': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Modern input classes for edit mode
  const inputClass = (err) => `w-full bg-gray-50/50 border ${err ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/10'} rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200`;
  const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5";

  // 🔥 Calculate total stock accurately based on view/edit mode
  const currentTotalStock = isEditing 
    ? (formData.stockData?.length > 0 ? formData.stockData.reduce((sum, item) => sum + (Number(item.stock) || 0), 0) : Number(formData.stock) || 0)
    : (productStock?.length > 0 ? productStock.reduce((sum, item) => sum + (Number(item.stock) || 0), 0) : product.stock || 0);

  // --- Handlers ---
  const handleEditClick = () => {
    setFormData({
      ...product,
      stockData: productStock || [], // 🔥 Load existing warehouse stock from the new prop
      benefits: product.benefits?.join('\n') || '',
      usage: product.usage?.join('\n') || '',
      ingredients: product.ingredients?.join('\n') || '',
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({});
    setErrors({});
  };

  // 🔥 Update specific warehouse stock
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

  // 🔥 Validation
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

      const cleanArray = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return value.split('\n').map((s) => s.trim()).filter(Boolean);
      };

      const cleanTags = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        return value.split(',').map((s) => s.trim()).filter(Boolean);
      };

      const payload = {
        ...formData,
        category_id: typeof formData.category_id === 'object' ? formData.category_id.id : formData.category_id,
        price: Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        stock: currentTotalStock, // Always pass the calculated total
        benefits: cleanArray(formData.benefits),
        benefits_ar: cleanArray(formData.benefits_ar),
        usage: cleanArray(formData.usage),
        usage_ar: cleanArray(formData.usage_ar),
        ingredients: cleanArray(formData.ingredients),
        ingredients_ar: cleanArray(formData.ingredients_ar),
        tags: cleanTags(formData.tags),
        images: Array.isArray(formData.images) ? formData.images : [],
        stockData: (formData.stockData || []).map((item) => ({
          warehouse_id: typeof item.warehouse_id === 'object' ? item.warehouse_id.id : item.warehouse_id,
          stock: Number(item.stock) || 0
        }))
      };

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error('Server returned invalid response');
      }

      if (!res.ok) {
        const errorMessage = typeof result.error === 'string' ? result.error : result.error?.message || JSON.stringify(result.error);
        throw new Error(errorMessage);
      }

      setIsEditing(false);

      if (result.data?.slug && result.data.slug !== product.slug) {
        router.replace(`/${lang}/products/${result.data.slug}`);
      } else {
        router.refresh();
      }

    } catch (error) {
      console.error(error);
      alert(`Error updating product: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div dir={dir} className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12">
      
      {/* HEADER ACTIONS / BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
          <Link href={`/${lang}/products`} className="hover:text-gray-900 transition-colors font-medium">
            {t.back}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button onClick={handleCancelClick} disabled={isSaving} className="h-9 inline-flex items-center justify-center bg-white border border-gray-200 text-gray-600 px-5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50">
                {t.cancel}
              </button>
              <button onClick={handleSaveClick} disabled={isSaving} className="h-9 inline-flex items-center justify-center gap-2 bg-green-600 border border-green-600 text-white px-5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-sm shadow-green-600/20 disabled:opacity-50">
                {isSaving && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
                {t.save}
              </button>
            </>
          ) : (
            <>
              <button className="h-9 inline-flex items-center justify-center bg-white border border-rose-100 text-rose-600 px-4 rounded-xl hover:bg-rose-50 transition-all">
                <Icon name="TrashIcon" size={18} />
              </button>
              <button onClick={handleEditClick} className="h-9 inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-sm shadow-gray-900/10">
                <Icon name="PencilSquareIcon" size={14} />
                {t.edit}
              </button>
            </>
          )}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:col-span-5 space-y-3">
          <div className="aspect-square w-full bg-white rounded-3xl border border-gray-200 overflow-hidden flex items-center justify-center p-2">
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => { e.currentTarget.src = ""; e.currentTarget.classList.add('hidden'); }}
              />
            ) : (
              <Icon name="PhotoIcon" size={48} className="text-gray-200" />
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-green-500' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="lg:col-span-7 flex flex-col justify-start space-y-8">
          
          {/* Title & Meta */}
          <div className="space-y-5 bg-white p-6 rounded-3xl border border-gray-200">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* STATUS */}
              {isEditing ? (
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-green-500">
                  <option value="active">{t.status.active}</option>
                  <option value="draft">{t.status.draft}</option>
                  <option value="out_of_stock">{t.status.out_of_stock}</option>
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusBadge(product.status)}`}>
                  {t.status[product.status] || product.status}
                </span>
              )}
              
              {/* CATEGORY */}
              {isEditing ? (
                <select value={formData.category_id || ''} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className="bg-gray-50 border border-gray-200 text-xs font-bold rounded-lg px-2 py-1 outline-none focus:border-green-500">
                  <option value="" disabled>{t.selectCategory}</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-200">
                  {product.category_name || t.details}
                </span>
              )}
            </div>

            {isEditing ? (
              <div>
                <label className={labelClass}>{t.name} *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass(errors.name)} />
                {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
              </div>
            ) : (
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>
            )}
            
            {isEditing ? (
              <div>
                <label className={labelClass}>{t.sku}</label>
                <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} className={inputClass()} dir="ltr" />
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-gray-400">SKU</span>
                <span className="bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold text-xs">
                  {product.sku || '-'}
                </span>
              </div>
            )}

            {isEditing ? (
              <div>
                <label className={labelClass}>{t.description}</label>
                <textarea rows={3} value={formData.short_description || formData.description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} className={`${inputClass()} resize-none`} />
              </div>
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.short_description || product.description || t.noData}
              </p>
            )}
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-5 flex items-center gap-2">
              <Icon name="BanknotesIcon" size={18} className="text-green-500" />
              {t.pricing}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-2">
                <label className={labelClass}>{t.price} *</label>
                {isEditing ? (
                  <>
                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={inputClass(errors.price)} dir="ltr" />
                    {errors.price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.price}</p>}
                  </>
                ) : (
                  <p className={`text-2xl font-bold tracking-tight ${product.is_on_sale ? 'text-gray-400 line-through text-lg' : 'text-gray-900'}`}>
                    {product.price}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className={labelClass}>{t.discount}</label>
                {isEditing ? (
                  <>
                    <input type="number" value={formData.discount_price || ''} onChange={e => setFormData({...formData, discount_price: e.target.value})} className={inputClass(errors.discount_price)} dir="ltr" />
                    {errors.discount_price && <p className="text-xs text-red-500 mt-1 font-medium">{errors.discount_price}</p>}
                  </>
                ) : (
                  product.is_on_sale && product.discount_price ? (
                    <p className="text-2xl font-bold tracking-tight text-green-600">{product.discount_price}</p>
                  ) : <p className="text-sm text-gray-400 mt-2">-</p>
                )}
              </div>

              {!isEditing && (
                <div className="space-y-2">
                  <label className={labelClass}>{t.totalStock}</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${currentTotalStock > 10 ? 'bg-green-500' : currentTotalStock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <p className="text-2xl font-bold tracking-tight text-gray-900">{currentTotalStock}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 🔥 VIEW/EDIT MODE: WAREHOUSE ALLOCATION 🔥 */}
            <div className="bg-gray-50/50 border border-gray-200 p-5 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 m-0">
                  {t.warehouseAlloc}
                </label>
                {isEditing && (
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                    {t.totalStock}: {currentTotalStock}
                  </span>
                )}
              </div>
              
              {warehouses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {warehouses.map((w) => {
                    // 🔥 Check state in Edit Mode, check productStock prop in View Mode
                    const whStock = isEditing 
                      ? (formData.stockData?.find(s => s.warehouse_id === w.id)?.stock || '')
                      : (productStock?.find(s => s.warehouse_id === w.id)?.stock || 0);

                    return (
                      <div key={w.id} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl">
                        <span className="text-sm font-semibold text-gray-700 truncate mr-2">
                          {lang === 'ar' ? w.name_ar || w.name : w.name}
                        </span>
                        {isEditing ? (
                          <input 
                            type="number" 
                            min="0"
                            value={whStock} 
                            onChange={(e) => handleWarehouseStockChange(w.id, e.target.value)} 
                            className="w-24 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center font-bold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" 
                            placeholder="0"
                            dir="ltr"
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            {whStock}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                isEditing ? (
                  <input type="number" value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: e.target.value})} className={inputClass()} placeholder="0" dir="ltr"/>
                ) : (
                  <p className="text-sm text-gray-400">{t.noData}</p>
                )
              )}
            </div>
          </div>

          {/* Details Grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Benefits */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="SparklesIcon" size={16} className="text-amber-500" />
                {t.benefits}
              </h3>
              {isEditing ? (
                <textarea rows={5} value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} className={`${inputClass()} resize-none`} />
              ) : product.benefits?.length > 0 ? (
                <ul className="space-y-3">
                  {product.benefits.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                      <Icon name="CheckCircleIcon" size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">{t.noData}</p>
              )}
            </div>

            {/* Usage */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="InformationCircleIcon" size={16} className="text-blue-500" />
                {t.usage}
              </h3>
              {isEditing ? (
                <textarea rows={5} value={formData.usage} onChange={e => setFormData({...formData, usage: e.target.value})} className={`${inputClass()} resize-none`} />
              ) : product.usage?.length > 0 ? (
                <ul className="space-y-3">
                  {product.usage.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">{t.noData}</p>
              )}
            </div>
            
            {/* Ingredients */}
            <div className="sm:col-span-2 bg-white border border-gray-200 rounded-3xl p-6">
               <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                <Icon name="BeakerIcon" size={16} className="text-purple-500" />
                {t.ingredients}
              </h3>
              {isEditing ? (
                <textarea rows={4} value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className={`${inputClass()} resize-none`} />
              ) : product.ingredients?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">{t.noData}</p>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}