'use client';

import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const defaultFormState = { 
  name: '', name_ar: '', sku: '', price: '', discount_price: '', stock: '', category_id: '',
  short_description: '', short_description_ar: '', description: '', description_ar: '',
  benefits: '', benefits_ar: '', usage: '', usage_ar: '', ingredients: '', ingredients_ar: '', tags: '',
  is_featured: false, is_best_seller: false, is_on_sale: false, images: ['', '', '', ''],
  stockData: []
};

export default function ProductModal({ 
  isOpen, onClose, onSubmit, product = null, categories = [], warehouses = [], lang = 'en', isLoading = false 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isEdit = !!product;

  // --- Animation States ---
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  // --- Form States ---
  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(defaultFormState);
  const [imagePreviews, setImagePreviews] = useState(['', '', '', '']);
  
  const fileInputRef0 = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRef3 = useRef(null);
  const fileInputRefs = [fileInputRef0, fileInputRef1, fileInputRef2, fileInputRef3];

  // Smooth Mount/Unmount Logic
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      // Slight delay for staging (backdrop first, then modal)
      requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 10);
      });
      
      if (product) {
        setFormData({
          ...defaultFormState,
          ...product,
          stockData: product.product_stock || [],
          benefits: product.benefits?.join('\n') || '',
          benefits_ar: product.benefits_ar?.join('\n') || '',
          usage: product.usage?.join('\n') || '',
          usage_ar: product.usage_ar?.join('\n') || '',
          ingredients: product.ingredients?.join('\n') || '',
          ingredients_ar: product.ingredients_ar?.join('\n') || '',
          tags: product.tags?.join(', ') || '',
        });
        setImagePreviews(product.images ? [...product.images, '', '', '', ''].slice(0, 4) : ['', '', '', '']);
      } else {
        setFormData(defaultFormState);
        setImagePreviews(['', '', '', '']);
      }
      setErrors({});
      setActiveTab('general');
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRender(false), 400); // Extended for premium out-animation
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!render) return null;

  const t = {
    en: {
      title: isEdit ? 'Edit Product' : 'Add New Product',
      tabs: { general: 'General', arabic: 'Arabic Content', details: 'Details & Lists', media: 'Media & Settings' },
      fields: {
        name: 'Product Name', name_ar: 'Name (Arabic)',
        sku: 'SKU', category: 'Category', selectCat: 'Select Category...',
        price: 'Price (SAR)', discount: 'Discount Price', stock: 'Stock', totalStock: 'Total Stock',
        warehouseAlloc: 'Warehouse Stock Allocation',
        shortDesc: 'Short Description', shortDesc_ar: 'Short Description (Arabic)',
        desc: 'Full Description', desc_ar: 'Full Description (Arabic)',
        benefits: 'Benefits (One per line)', benefits_ar: 'Benefits Arabic',
        usage: 'Usage Instructions', usage_ar: 'Usage Arabic',
        ingredients: 'Ingredients', ingredients_ar: 'Ingredients Arabic',
        tags: 'Tags (Comma separated)', flags: 'Product Badges',
        featured: 'Featured', bestSeller: 'Best Seller', onSale: 'On Sale', images: 'Product Images'
      },
      placeholders: {
        name: 'e.g., Premium Ajwa Dates', name_ar: 'مثال: تمر عجوة فاخر',
        sku: 'e.g., DATES-AJW-500G', price: '0.00', discount: '0.00',
        shortDesc: 'Briefly describe the product...', shortDesc_ar: 'وصف موجز للمنتج...',
        desc: 'Provide full details, features, and specs...', desc_ar: 'قدم تفاصيل كاملة، مميزات، ومواصفات...',
        benefits: 'e.g., Rich in antioxidants\nBoosts energy', benefits_ar: 'مثال: غني بمضادات الأكسدة\nيعزز الطاقة',
        usage: 'e.g., Consume 3-5 dates daily.', usage_ar: 'مثال: تناول ٣-٥ تمرات يومياً.',
        ingredients: 'e.g., 100% Natural Dates', ingredients_ar: 'مثال: تمر طبيعي ١٠٠٪',
        tags: 'e.g., organic, fresh, premium'
      },
      validation: { reqName: 'Required', reqPrice: 'Required', invalidDiscount: 'Must be < price' },
      cancel: 'Cancel', save: 'Save Changes', create: 'Create Product'
    },
    ar: {
      title: isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد',
      tabs: { general: 'عام', arabic: 'المحتوى العربي', details: 'التفاصيل', media: 'الصور والإعدادات' },
      fields: {
        name: 'اسم المنتج', name_ar: 'الاسم (عربي)',
        sku: 'الرمز', category: 'القسم', selectCat: 'اختر القسم...',
        price: 'السعر', discount: 'سعر التخفيض', stock: 'المخزون', totalStock: 'إجمالي المخزون',
        warehouseAlloc: 'توزيع المخزون في المستودعات',
        shortDesc: 'وصف قصير', shortDesc_ar: 'وصف قصير (عربي)',
        desc: 'الوصف الكامل', desc_ar: 'الوصف الكامل (عربي)',
        benefits: 'الفوائد (سطر لكل عنصر)', benefits_ar: 'الفوائد عربي',
        usage: 'طريقة الاستخدام', usage_ar: 'الاستخدام عربي',
        ingredients: 'المكونات', ingredients_ar: 'المكونات عربي',
        tags: 'كلمات دلالية', flags: 'شارات المنتج',
        featured: 'مميز', bestSeller: 'الأكثر مبيعاً', onSale: 'تخفيض', images: 'الصور'
      },
      placeholders: {
        name: 'e.g., Premium Ajwa Dates', name_ar: 'مثال: تمر عجوة فاخر',
        sku: 'e.g., DATES-AJW-500G', price: '0.00', discount: '0.00',
        shortDesc: 'Briefly describe the product...', shortDesc_ar: 'وصف موجز للمنتج...',
        desc: 'Provide full details, features, and specs...', desc_ar: 'قدم تفاصيل كاملة، مميزات، ومواصفات...',
        benefits: 'e.g., Rich in antioxidants\nBoosts energy', benefits_ar: 'مثال: غني بمضادات الأكسدة\nيعزز الطاقة',
        usage: 'e.g., Consume 3-5 dates daily.', usage_ar: 'مثال: تناول ٣-٥ تمرات يومياً.',
        ingredients: 'e.g., 100% Natural Dates', ingredients_ar: 'مثال: تمر طبيعي ١٠٠٪',
        tags: 'مثال: عضوي، طازج، فاخر'
      },
      validation: { reqName: 'مطلوب', reqPrice: 'مطلوب', invalidDiscount: 'يجب أن يكون أقل من السعر' },
      cancel: 'إلغاء', save: 'حفظ', create: 'إنشاء'
    }
  }[lang];

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = t.validation.reqName;
    if (!formData.price) newErrors.price = t.validation.reqPrice;
    if (formData.discount_price && Number(formData.discount_price) >= Number(formData.price)) {
      newErrors.discount_price = t.validation.invalidDiscount;
    }
    setErrors(newErrors);
    if (newErrors.name || newErrors.price || newErrors.discount_price) setActiveTab('general');
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const cleanArray = (str) => str ? str.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const cleanTags = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    const payload = {
      ...formData,
      price: Number(formData.price),
      discount_price: formData.discount_price ? Number(formData.discount_price) : null,
      stock: Number(formData.stock) || 0,
      images: imagePreviews.filter(Boolean),
      benefits: cleanArray(formData.benefits),
      benefits_ar: cleanArray(formData.benefits_ar),
      usage: cleanArray(formData.usage),
      usage_ar: cleanArray(formData.usage_ar),
      ingredients: cleanArray(formData.ingredients),
      ingredients_ar: cleanArray(formData.ingredients_ar),
      tags: cleanTags(formData.tags),
    };
    onSubmit(payload);
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

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newPreviews = [...imagePreviews];
      newPreviews[index] = url;
      setImagePreviews(newPreviews);
    }
  };

  // Premium Form Control Classes
  const inputClass = (err) => `w-full bg-gray-50/50 border ${err ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-gray-300 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10'} rounded-xl px-4 py-3 min-h-[44px] text-sm sm:text-base text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:outline-none transition-all duration-300 shadow-sm shadow-black/[0.02]`;
  const labelClass = "block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
  
  const currentTotalStock = formData.stockData?.length > 0 
    ? formData.stockData.reduce((sum, item) => sum + (Number(item.stock) || 0), 0)
    : Number(formData.stock) || 0;

  const tabsArray = ['general', 'arabic', 'details', 'media'];
  const activeTabIndex = tabsArray.indexOf(activeTab);

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 perspective-1000">
      
      {/* Animated Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/20 backdrop-blur-md transition-opacity duration-500 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={!isLoading ? onClose : undefined} 
      />

      {/* Animated Modal Container - Fullscreen on mobile, floating on desktop */}
      <div 
        className={`relative bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:max-w-4xl flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl ring-1 ring-black/5 transform origin-bottom sm:origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 sm:scale-95 translate-y-full sm:translate-y-8'
        }`}
      >
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
            <Icon name="ArrowPathIcon" size={40} className="animate-spin text-green-600 drop-shadow-md" />
            <p className="mt-4 text-xs sm:text-sm font-bold text-gray-700 tracking-widest uppercase animate-pulse">Processing...</p>
          </div>
        )}

        {/* Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white z-20">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{t.title}</h2>
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors outline-none cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>

        {/* Stepper Experience */}
        <div className="relative bg-gray-50/50 border-b border-gray-100 shrink-0 z-10">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-[2px] bg-gray-100 w-full">
             <div 
               className="h-full bg-green-500 transition-all duration-500 ease-out" 
               style={{ width: `${((activeTabIndex + 1) / tabsArray.length) * 100}%` }} 
             />
          </div>
          
          <div className="flex items-center px-4 sm:px-8 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {tabsArray.map((tab, idx) => {
              const isActive = activeTab === tab;
              const isPast = idx < activeTabIndex;
              return (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`flex items-center gap-2.5 py-4 pr-8 snap-start transition-all duration-300 outline-none cursor-pointer group whitespace-nowrap ${
                    isActive ? 'text-green-700' : isPast ? 'text-gray-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold transition-all duration-300 ${
                    isActive ? 'bg-green-100 text-green-700 ring-4 ring-green-50' : 
                    isPast ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                    {t.tabs[tab]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white relative">
          
          {/* Subtle scroll shadows */}
          <div className="sticky top-0 inset-x-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
          
          <div className="px-4 sm:px-8 py-2 sm:py-6 min-h-full">
            {/* Smooth Tab Transition Wrapper */}
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out pb-4">
              
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>{t.fields.name} *</label>
                    <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder={t.placeholders.name} className={inputClass(errors.name)} dir="ltr" />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.category}</label>
                    <div className="relative cursor-pointer group">
                      <select value={formData.category_id || ''} onChange={(e) => setFormData({...formData, category_id: e.target.value})} className={`${inputClass()} appearance-none cursor-pointer relative z-10 bg-transparent pr-10`}>
                        <option value="" disabled>{t.fields.selectCat}</option>
                        {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.label}</option>))}
                      </select>
                      <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-4' : 'right-4'} flex items-center pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors z-0`}>
                        <Icon name="ChevronDownIcon" size={16} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.sku}</label>
                    <input type="text" value={formData.sku || ''} onChange={(e) => setFormData({...formData, sku: e.target.value})} placeholder={t.placeholders.sku} className={inputClass()} dir="ltr"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t.fields.price} *</label>
                      <input type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder={t.placeholders.price} className={inputClass(errors.price)} dir="ltr"/>
                    </div>
                    <div>
                      <label className={labelClass}>{t.fields.discount}</label>
                      <input type="number" value={formData.discount_price || ''} onChange={(e) => setFormData({...formData, discount_price: e.target.value})} placeholder={t.placeholders.discount} className={inputClass(errors.discount_price)} dir="ltr"/>
                    </div>
                  </div>

                  {/* WAREHOUSE STOCK ALLOCATION */}
                  <div className="sm:col-span-2 bg-gray-50/50 border border-gray-100 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-5">
                      <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 m-0">{t.fields.warehouseAlloc}</label>
                      <span className="text-[10px] sm:text-xs font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 transition-all duration-300">
                        {t.fields.totalStock}: {currentTotalStock}
                      </span>
                    </div>
                    
                    {warehouses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {warehouses.map((w) => {
                          const whStock = formData.stockData?.find(s => s.warehouse_id === w.id)?.stock || '';
                          return (
                            <div key={w.id} className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl hover:shadow-sm transition-all duration-200">
                              <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate mr-2">
                                {lang === 'ar' ? w.name_ar || w.name : w.name}
                              </span>
                              <input 
                                type="number" 
                                min="0"
                                value={whStock} 
                                onChange={(e) => handleWarehouseStockChange(w.id, e.target.value)} 
                                className="w-20 sm:w-24 bg-gray-50/50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center font-bold focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 hover:border-gray-300 placeholder:text-gray-400 placeholder:font-normal outline-none transition-all cursor-text min-h-[40px]" 
                                placeholder="0"
                                dir="ltr"
                              />
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <input type="number" value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: e.target.value})} className={inputClass()} placeholder="0" dir="ltr"/>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>{t.fields.shortDesc}</label>
                    <textarea rows="2" value={formData.short_description || ''} onChange={(e) => setFormData({...formData, short_description: e.target.value})} placeholder={t.placeholders.shortDesc} className={`${inputClass()} resize-none`} dir="ltr"/>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>{t.fields.desc}</label>
                    <textarea rows="4" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder={t.placeholders.desc} className={`${inputClass()} resize-none`} dir="ltr"/>
                  </div>
                </div>
              )}

              {activeTab === 'arabic' && (
                <div className="grid grid-cols-1 gap-5 sm:gap-6" dir="rtl">
                  <div>
                    <label className={labelClass}>{t.fields.name_ar}</label>
                    <input type="text" value={formData.name_ar || ''} onChange={(e) => setFormData({...formData, name_ar: e.target.value})} placeholder={t.placeholders.name_ar} className={inputClass()} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.shortDesc_ar}</label>
                    <textarea rows="2" value={formData.short_description_ar || ''} onChange={(e) => setFormData({...formData, short_description_ar: e.target.value})} placeholder={t.placeholders.shortDesc_ar} className={`${inputClass()} resize-none`} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.fields.desc_ar}</label>
                    <textarea rows="4" value={formData.description_ar || ''} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} placeholder={t.placeholders.desc_ar} className={`${inputClass()} resize-none`} />
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div><label className={labelClass}>{t.fields.benefits}</label><textarea rows="4" value={formData.benefits || ''} onChange={(e) => setFormData({...formData, benefits: e.target.value})} placeholder={t.placeholders.benefits} className={`${inputClass()} resize-none`} dir="ltr"/></div>
                  <div dir="rtl"><label className={labelClass}>{t.fields.benefits_ar}</label><textarea rows="4" value={formData.benefits_ar || ''} onChange={(e) => setFormData({...formData, benefits_ar: e.target.value})} placeholder={t.placeholders.benefits_ar} className={`${inputClass()} resize-none`} /></div>
                  <div><label className={labelClass}>{t.fields.ingredients}</label><textarea rows="4" value={formData.ingredients || ''} onChange={(e) => setFormData({...formData, ingredients: e.target.value})} placeholder={t.placeholders.ingredients} className={`${inputClass()} resize-none`} dir="ltr"/></div>
                  <div dir="rtl"><label className={labelClass}>{t.fields.ingredients_ar}</label><textarea rows="4" value={formData.ingredients_ar || ''} onChange={(e) => setFormData({...formData, ingredients_ar: e.target.value})} placeholder={t.placeholders.ingredients_ar} className={`${inputClass()} resize-none`} /></div>
                  <div><label className={labelClass}>{t.fields.usage}</label><textarea rows="4" value={formData.usage || ''} onChange={(e) => setFormData({...formData, usage: e.target.value})} placeholder={t.placeholders.usage} className={`${inputClass()} resize-none`} dir="ltr"/></div>
                  <div dir="rtl"><label className={labelClass}>{t.fields.usage_ar}</label><textarea rows="4" value={formData.usage_ar || ''} onChange={(e) => setFormData({...formData, usage_ar: e.target.value})} placeholder={t.placeholders.usage_ar} className={`${inputClass()} resize-none`} /></div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-8">
                  <div>
                    <label className={labelClass}>{t.fields.images}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} onClick={() => fileInputRefs[idx].current.click()} className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center cursor-pointer hover:bg-green-50/30 hover:border-green-300 transition-all duration-300 group overflow-hidden">
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRefs[idx]} onChange={(e) => handleImageChange(idx, e)} />
                          {src ? (
                            <>
                              <img src={src} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                              <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                <Icon name="ArrowPathIcon" size={24} className="text-gray-900 scale-75 group-hover:scale-100 transition-transform duration-300" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-green-500 transition-colors duration-300">
                              <Icon name="PhotoIcon" size={28} className="mb-2" />
                              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">+ Add</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div><label className={labelClass}>{t.fields.tags}</label><input type="text" value={formData.tags || ''} onChange={(e) => setFormData({...formData, tags: e.target.value})} placeholder={t.placeholders.tags} className={inputClass()} dir="ltr" /></div>
                  <div>
                    <label className={labelClass}>{t.fields.flags}</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {[{ key: 'is_featured', label: t.fields.featured }, { key: 'is_best_seller', label: t.fields.bestSeller }, { key: 'is_on_sale', label: t.fields.onSale }].map((flag) => (
                        <label key={flag.key} className="flex items-center gap-3 p-4 bg-gray-50/50 border border-gray-100 rounded-xl cursor-pointer hover:bg-white hover:shadow-sm hover:border-gray-200 transition-all flex-1 group">
                          <div className="relative flex items-center">
                            <input type="checkbox" checked={formData[flag.key] || false} onChange={(e) => setFormData({...formData, [flag.key]: e.target.checked})} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all duration-300 peer-checked:bg-green-500 group-active:scale-95"></div>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-700">{flag.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="sticky bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-100 flex items-center justify-between sm:justify-end gap-3 shrink-0 bg-white z-20">
          
          {/* Mobile Step Indicators (Left aligned on mobile footer) */}
          <div className="flex sm:hidden items-center gap-1">
             {tabsArray.map((_, idx) => (
               <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeTabIndex ? 'w-4 bg-green-500' : idx < activeTabIndex ? 'w-1.5 bg-green-200' : 'w-1.5 bg-gray-200'}`} />
             ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              disabled={isLoading} 
              className="px-5 sm:px-6 py-2.5 sm:py-3 min-h-[44px] text-xs font-bold tracking-widest uppercase text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {t.cancel}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 min-h-[44px] text-xs font-bold tracking-widest uppercase text-white bg-green-600 border border-transparent rounded-xl hover:bg-green-700 shadow-sm shadow-green-600/20 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {isLoading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
              {isEdit ? t.save : t.create}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}