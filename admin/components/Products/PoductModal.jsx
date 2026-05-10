'use client';

import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { uploadImages } from '@/lib/uploadImage';

const defaultFormState = { 
  name: '', name_ar: '', description: '', description_ar: '', 
  images: [null, null, null, null, null], image: '',
  sku: '', category_id: '', is_published: 'true', tags: '',
  price: '', discount_price: '', stock: '', stockData: [],
  short_description: '', short_description_ar: '',
  is_featured: false, is_best_seller: false, is_on_sale: false,
  // ✅ NEW FIELDS
  is_weekly_offer: false, badge: '', badge_ar: '', position: '',
  offer_expires_at: '', meta_title: '', meta_description: ''
};

export default function ProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product = null, 
  categories = [],
  warehouses = [],
  lang = 'en', 
  isLoading = false,
  bucketName = 'products' 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isEdit = !!product;

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(defaultFormState);
  
  // Image States for exactly 5 slots (1 Big, 4 Small)
  const [imageFiles, setImageFiles] = useState([null, null, null, null, null]);
  const [uploadSlot, setUploadSlot] = useState(null);
  
  // Animation States
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  const fileInputRef = useRef(null);
  const dragDropInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));

      if (product) {
        // Map existing images to the 5-slot array
        const initImages = [...(product.images || [])];
        while (initImages.length < 5) initImages.push(null);

        setFormData({ 
          ...defaultFormState, 
          ...product,
          images: initImages.slice(0, 5),
          is_published: product.is_published !== undefined ? String(product.is_published) : 'true',
          stockData: product.stockData || [],
          // Format date for datetime-local input
          offer_expires_at: product.offer_expires_at ? new Date(product.offer_expires_at).toISOString().slice(0, 16) : ''
        });
      } else {
        setFormData({ ...defaultFormState, images: [null, null, null, null, null] });
      }
      setImageFiles([null, null, null, null, null]);
      setUploadSlot(null);
      setErrors({});
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product]);

  if (!render) return null;

  const t = {
    en: {
      title: isEdit ? 'Edit Product' : 'Add Product',
      subtitle: 'Fill in the details to configure the product',
      fields: {
        name: 'PRODUCT NAME (EN)', name_ar: 'PRODUCT NAME (AR)', sku: 'SKU',
        category: 'CATEGORY', status: 'STATUS', tags: 'TAGS',
        price: 'PRICE (SAR)', discount: 'DISCOUNT PRICE (SAR)', stock: 'STOCK QUANTITY',
        shortDesc: 'SHORT DESCRIPTION (EN)', shortDesc_ar: 'SHORT DESCRIPTION (AR)',
        desc: 'FULL DESCRIPTION (EN)', desc_ar: 'FULL DESCRIPTION (AR)',
        images: 'Product Images', imagesSub: 'Add product images from different angles',
        featured: 'Featured', featuredSub: 'Display on homepage',
        bestSeller: 'Best Seller', bestSellerSub: 'Mark as best selling product',
        onSale: 'On Sale', onSaleSub: 'Show product on sale',
        // ✅ NEW TRANSLATIONS
        badge: 'BADGE (EN)', badge_ar: 'BADGE (AR)', position: 'DISPLAY ORDER',
        offerExpires: 'OFFER EXPIRES AT', weeklyOffer: 'Weekly Offer', weeklyOfferSub: 'Highlight as offer of the week',
        metaTitle: 'META TITLE', metaDesc: 'META DESCRIPTION'
      },
      placeholders: {
        name: 'e.g. Organic Aloe Vera Gel', name_ar: 'مثال: جل الألوفيرا العضوي', sku: 'e.g. ALOE-VERA-001',
        tags: 'e.g. aloe, gel, organic', shortDesc: 'Enter short description in English...', shortDesc_ar: 'أدخل وصفًا قصيرًا باللغة العربية...',
        desc: 'Enter full description in English...', desc_ar: 'أدخل وصفًا تفصيليًا باللغة العربية...',
        category: 'Select category'
      },
      validation: { reqName: 'Name is required' },
      cancel: 'Cancel', save: isEdit ? 'Save Changes' : 'Add Product', uploading: 'Saving...',
      warehouseAlloc: 'Warehouse Allocations',
      table: { warehouse: 'Warehouse', stock: 'Stock' },
      sections: { overview: 'Basic Information', pricing: 'Pricing & Inventory', seo: 'SEO & Metadata', content: 'Descriptions', flags: 'Features / Flags' }
    },
    ar: {
      title: isEdit ? 'تعديل المنتج' : 'إضافة منتج',
      subtitle: 'أدخل التفاصيل لتهيئة المنتج',
      fields: {
        name: 'اسم المنتج (إنجليزي)', name_ar: 'اسم المنتج (عربي)', sku: 'رمز المنتج',
        category: 'القسم', status: 'الحالة', tags: 'الوسوم',
        price: 'السعر (ر.س)', discount: 'سعر التخفيض (ر.س)', stock: 'كمية المخزون',
        shortDesc: 'وصف قصير (إنجليزي)', shortDesc_ar: 'وصف قصير (عربي)',
        desc: 'وصف كامل (إنجليزي)', desc_ar: 'وصف كامل (عربي)',
        images: 'صور المنتج', imagesSub: 'أضف صور للمنتج من زوايا مختلفة',
        featured: 'مميز', featuredSub: 'عرض في الصفحة الرئيسية',
        bestSeller: 'الأكثر مبيعاً', bestSellerSub: 'تحديد كمنتج أكثر مبيعاً',
        onSale: 'تخفيض', onSaleSub: 'عرض المنتج في التخفيضات',
        // ✅ NEW TRANSLATIONS
        badge: 'نص الشارة (إنجليزي)', badge_ar: 'نص الشارة (عربي)', position: 'ترتيب العرض',
        offerExpires: 'تاريخ انتهاء العرض', weeklyOffer: 'عرض الأسبوع', weeklyOfferSub: 'تمييز كعرض الأسبوع',
        metaTitle: 'عنوان الميتا', metaDesc: 'وصف الميتا'
      },
      placeholders: {
        name: 'e.g. Organic Aloe Vera Gel', name_ar: 'مثال: جل الألوفيرا العضوي', sku: 'e.g. ALOE-VERA-001',
        tags: 'e.g. aloe, gel, organic', shortDesc: 'Enter short description in English...', shortDesc_ar: 'أدخل وصفًا قصيرًا باللغة العربية...',
        desc: 'Enter full description in English...', desc_ar: 'أدخل وصفًا تفصيليًا باللغة العربية...',
        category: 'اختر القسم'
      },
      validation: { reqName: 'الاسم مطلوب' },
      cancel: 'إلغاء', save: isEdit ? 'حفظ التغييرات' : 'إضافة المنتج', uploading: 'جاري الحفظ...',
      warehouseAlloc: 'توزيع المستودعات',
      table: { warehouse: 'المستودع', stock: 'المخزون' },
      sections: { overview: 'المعلومات الأساسية', pricing: 'التسعير والمخزون', seo: 'تحسين محركات البحث', content: 'الوصف', flags: 'المميزات' }
    }
  }[lang];

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = t.validation.reqName;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setFormData(prev => {
      const newImages = [...(prev.images || [null, null, null, null, null])];
      const newFiles = [...imageFiles];
      
      if (uploadSlot !== null) {
        newImages[uploadSlot] = URL.createObjectURL(files[0]);
        newFiles[uploadSlot] = files[0];
      } else {
        let fileIdx = 0;
        for (let i = 0; i < 5 && fileIdx < files.length; i++) {
          if (!newImages[i]) {
            newImages[i] = URL.createObjectURL(files[fileIdx]);
            newFiles[i] = files[fileIdx];
            fileIdx++;
          }
        }
      }
      
      setImageFiles(newFiles);
      setUploadSlot(null);
      return { ...prev, images: newImages };
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (dragDropInputRef.current) dragDropInputRef.current.value = '';
  };

  const removeImage = (idx) => {
    setFormData(prev => {
      const newImages = [...(prev.images || [null, null, null, null, null])];
      newImages[idx] = null;
      return { ...prev, images: newImages };
    });

    setImageFiles(prev => {
      const newFiles = [...prev];
      newFiles[idx] = null;
      return newFiles;
    });
  };

  const handleWarehouseStockChange = (warehouseId, qty) => {
    const newStockData = [...(formData.stockData || [])];
    const index = newStockData.findIndex(item => item.warehouse_id === warehouseId);
    
    if (index >= 0) {
      newStockData[index].stock = Number(qty) || 0;
    } else {
      newStockData.push({ warehouse_id: warehouseId, stock: Number(qty) || 0 });
    }
    
    const total = newStockData.reduce((sum, item) => sum + (Number(item.stock) || 0), 0);
    setFormData({ ...formData, stockData: newStockData, stock: total });
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let finalImages = [...(formData.images || [null, null, null, null, null])];
    const filesToUpload = imageFiles.filter(f => f !== null);

    if (filesToUpload.length > 0) {
      const uploadedUrls = await uploadImages(filesToUpload, bucketName);
      let urlIdx = 0;
      finalImages = finalImages.map((img, idx) => {
        if (imageFiles[idx] !== null) {
          return uploadedUrls[urlIdx++] || null;
        }
        return img;
      });
    }

    const cleanImages = finalImages.filter(url => url && !url.startsWith('blob:'));
    onSubmit({ ...formData, images: cleanImages, image: cleanImages[0] || '' });
  };

  // Supabase Style Classes
  const inputClass = (err) => `w-full bg-white border ${err ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border-zinc-300 hover:border-zinc-400 focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d]'} rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none transition-all shadow-sm placeholder:text-zinc-400`;
  const labelClass = "block text-[11px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide";
  const sectionTitleClass = "text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2";

  const safeImages = formData.images || [null, null, null, null, null];

  return (
    <div dir={dir} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      {/* Hidden inputs for uploading */}
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
      <input type="file" accept="image/*" multiple className="hidden" ref={dragDropInputRef} onChange={handleImageUpload} />

      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={!isLoading ? onClose : undefined} 
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-lg w-full max-w-[1000px] flex flex-col shadow-2xl transform transition-all duration-300 ease-out max-h-[95vh] ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-lg animate-in fade-in duration-200">
            <div className="bg-white px-5 py-3 rounded-md border border-zinc-200 shadow-sm flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#21c45d]" />
              <span className="text-sm font-medium text-zinc-900">{t.uploading}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center border border-zinc-200">
              <Icon name="CubeIcon" size={20} />
            </div>
            <div>
              <h2 className="text-base font-medium text-zinc-900 leading-tight">{t.title}</h2>
              <p className="text-xs text-zinc-500 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-zinc-400 bg-white border border-transparent hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-all outline-none disabled:opacity-50 cursor-pointer">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>

        {/* Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto no-scrollbar bg-zinc-50/30">
          
          {/* LEFT SIDE (FORM) - 7 cols */}
          <div className="lg:col-span-7 p-6 space-y-8 lg:border-r border-zinc-200">
            
            {/* 1. Basic Info */}
            <section>
              <h3 className={sectionTitleClass}><Icon name="BookmarkIcon" size={16} className="text-zinc-400" /> {t.sections.overview}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>{t.fields.name}</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={t.placeholders.name} className={inputClass(errors.name)} dir="ltr" />
                  {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t.fields.name_ar}</label>
                  <input type="text" value={formData.name_ar || ''} onChange={e => setFormData({...formData, name_ar: e.target.value})} placeholder={t.placeholders.name_ar} className={inputClass()} dir="rtl" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="sm:col-span-1">
                  <label className={labelClass}>{t.fields.sku}</label>
                  <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder={t.placeholders.sku} className={inputClass()} dir="ltr" />
                </div>
                <div className="sm:col-span-2">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="relative">
                       <label className={labelClass}>{t.fields.category}</label>
                       <select value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})} className={`${inputClass()} appearance-none pr-8 cursor-pointer`}>
                         <option value="" disabled>{t.placeholders.category}</option>
                         {categories?.map((cat) => (
                           <option key={cat.id} value={cat.id}>{lang === 'ar' ? cat.name_ar || cat.label_ar : cat.name || cat.label}</option>
                         ))}
                       </select>
                       <Icon name="ChevronDownIcon" size={14} className={`absolute top-[30px] text-zinc-400 pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
                     </div>
                     <div className="relative">
                       <label className={labelClass}>{t.fields.status}</label>
                       <select value={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.value})} className={`${inputClass()} appearance-none pr-8 cursor-pointer`}>
                         <option value="true">Published</option>
                         <option value="false">Draft</option>
                       </select>
                       <Icon name="ChevronDownIcon" size={14} className={`absolute top-[30px] text-zinc-400 pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
                     </div>
                   </div>
                </div>
              </div>

              {/* ✅ NEW: Badge & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={labelClass}>{t.fields.badge}</label>
                  <input type="text" value={formData.badge || ''} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="e.g. New" className={inputClass()} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.badge_ar}</label>
                  <input type="text" value={formData.badge_ar || ''} onChange={e => setFormData({...formData, badge_ar: e.target.value})} placeholder="مثال: جديد" className={inputClass()} dir="rtl" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.position}</label>
                  <input type="number" min="0" value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} placeholder="0" className={inputClass()} dir="ltr" />
                </div>
              </div>

              <div>
                 <label className={labelClass}>{t.fields.tags}</label>
                 <input type="text" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder={t.placeholders.tags} className={inputClass()} dir="ltr" />
                 <p className="text-[10px] text-zinc-500 mt-1">Separate tags with commas</p>
              </div>
            </section>

            <hr className="border-zinc-200" />

            {/* 2. Pricing & Inventory */}
            <section>
              <h3 className={sectionTitleClass}><Icon name="TagIcon" size={16} className="text-zinc-400" /> {t.sections.pricing}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>{t.fields.price}</label>
                  <div className="relative">
                    <span className={`absolute top-1/2 -translate-y-1/2 text-zinc-500 text-sm ${dir === 'rtl' ? 'right-3' : 'left-3'}`}>SAR</span>
                    <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className={`${inputClass()} ${dir === 'rtl' ? 'pr-12' : 'pl-12'}`} dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t.fields.discount}</label>
                  <div className="relative">
                    <span className={`absolute top-1/2 -translate-y-1/2 text-zinc-500 text-sm ${dir === 'rtl' ? 'right-3' : 'left-3'}`}>SAR</span>
                    <input type="number" value={formData.discount_price || ''} onChange={e => setFormData({...formData, discount_price: e.target.value})} placeholder="0.00" className={`${inputClass()} ${dir === 'rtl' ? 'pr-12' : 'pl-12'}`} dir="ltr" />
                  </div>
                </div>
              </div>

              {/* ✅ NEW: Offer Expiry & General Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t.fields.offerExpires}</label>
                  <input type="datetime-local" value={formData.offer_expires_at || ''} onChange={e => setFormData({...formData, offer_expires_at: e.target.value})} className={inputClass()} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.stock}</label>
                  <input type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" className={inputClass()} dir="ltr" disabled={warehouses.length > 0} />
                </div>
              </div>

              {warehouses.length > 0 && (
                <div className="mt-4 border border-zinc-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-50 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest border-b border-zinc-200">
                      <tr>
                        <th className="px-4 py-2">{t.table.warehouse}</th>
                        <th className="px-4 py-2 w-32 text-center">{t.table.stock}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {warehouses.map((w) => {
                        const whStock = formData.stockData?.find(s => s.warehouse_id === w.id)?.stock || '';
                        return (
                          <tr key={w.id} className="hover:bg-zinc-50">
                            <td className="px-4 py-2 font-medium text-zinc-700">
                              {lang === 'ar' ? w.name_ar || w.name : w.name}
                            </td>
                            <td className="px-4 py-2">
                              <input 
                                type="number" min="0" value={whStock} 
                                onChange={(e) => handleWarehouseStockChange(w.id, e.target.value)} 
                                className="w-full bg-white border border-zinc-300 rounded px-2 py-1 text-sm text-zinc-900 focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d] outline-none text-center" 
                                placeholder="0" dir="ltr"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <hr className="border-zinc-200" />

            {/* 3. Descriptions */}
            <section>
              <h3 className={sectionTitleClass}><Icon name="DocumentTextIcon" size={16} className="text-zinc-400" /> {t.sections.content}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>{t.fields.shortDesc}</label>
                  <textarea rows="2" value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder={t.placeholders.shortDesc} className={`${inputClass()} resize-none`} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.shortDesc_ar}</label>
                  <textarea rows="2" value={formData.short_description_ar || ''} onChange={e => setFormData({...formData, short_description_ar: e.target.value})} placeholder={t.placeholders.shortDesc_ar} className={`${inputClass()} resize-none`} dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t.fields.desc}</label>
                  <textarea rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder={t.placeholders.desc} className={`${inputClass()} resize-none`} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.desc_ar}</label>
                  <textarea rows="4" value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} placeholder={t.placeholders.desc_ar} className={`${inputClass()} resize-none`} dir="rtl" />
                </div>
              </div>
            </section>

            {/* ✅ NEW: 4. SEO & Metadata */}
            <hr className="border-zinc-200" />
            <section>
              <h3 className={sectionTitleClass}><Icon name="GlobeAltIcon" size={16} className="text-zinc-400" /> {t.sections.seo}</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>{t.fields.metaTitle}</label>
                  <input type="text" value={formData.meta_title || ''} onChange={e => setFormData({...formData, meta_title: e.target.value})} className={inputClass()} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.metaDesc}</label>
                  <textarea rows="2" value={formData.meta_description || ''} onChange={e => setFormData({...formData, meta_description: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
                </div>
              </div>
            </section>

            <hr className="border-zinc-200" />

            {/* 5. Features / Flags */}
            <section>
              <h3 className={sectionTitleClass}><Icon name="Squares2X2Icon" size={16} className="text-zinc-400" /> {t.sections.flags}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Checkbox item helper */}
                {[
                  { id: 'is_featured', title: t.fields.featured, sub: t.fields.featuredSub },
                  { id: 'is_best_seller', title: t.fields.bestSeller, sub: t.fields.bestSellerSub },
                  { id: 'is_on_sale', title: t.fields.onSale, sub: t.fields.onSaleSub },
                  { id: 'is_weekly_offer', title: t.fields.weeklyOffer, sub: t.fields.weeklyOfferSub }, // ✅ ADDED
                ].map(flag => (
                  <div key={flag.id} className="flex justify-between items-center bg-white p-3 rounded-md border border-zinc-200 shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{flag.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{flag.sub}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3 shrink-0">
                      <input type="checkbox" checked={formData[flag.id] || false} onChange={e => setFormData({...formData, [flag.id]: e.target.checked})} className="sr-only peer" />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#21c45d] peer-checked:border-[#21c45d]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT SIDE (IMAGES) - 5 cols */}
          <div className="lg:col-span-5 p-6 flex flex-col bg-white border-l border-zinc-200">
            <div className="mb-5">
              <h3 className={sectionTitleClass}><Icon name="PhotoIcon" size={16} className="text-zinc-400" /> {t.fields.images}</h3>
              <p className="text-xs text-zinc-500">{t.fields.imagesSub}</p>
            </div>

            {/* BIG Preview / Slot 0 */}
            <div 
              onClick={() => { if(!safeImages[0]) { setUploadSlot(0); fileInputRef.current?.click(); } }}
              className={`relative aspect-square w-full rounded-lg overflow-hidden flex flex-col items-center justify-center mb-4 group shadow-sm transition-all ${safeImages[0] ? 'border border-zinc-200 bg-zinc-50 cursor-default' : 'bg-zinc-50 border border-dashed border-zinc-300 hover:bg-zinc-100 cursor-pointer'}`}
            >
              {safeImages[0] ? (
                <>
                  <img src={safeImages[0]} className="w-full h-full object-cover mix-blend-multiply" alt="Preview" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(0); }}
                    className="absolute top-2 right-2 bg-white/90 text-zinc-500 hover:text-red-500 hover:bg-red-50 border border-zinc-200 rounded p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                  >
                    <Icon name="TrashIcon" size={14} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="relative mb-3">
                    <Icon name="PhotoIcon" size={48} className="text-zinc-300" />
                    <div className="absolute -bottom-1 -right-1 bg-[#21c45d] text-white rounded-full p-0.5 border-2 border-white shadow-sm">
                      <Icon name="PlusIcon" size={12} strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-zinc-700">Main Image</p>
                  <p className="text-xs text-zinc-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>

            {/* Thumbnails Row (Slots 1 to 4) */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4].map((idx) => {
                const img = safeImages[idx];
                return (
                  <div 
                    key={idx} 
                    onClick={() => { if(!img) { setUploadSlot(idx); fileInputRef.current?.click(); } }}
                    className={`relative aspect-square rounded-md border transition-all overflow-hidden flex items-center justify-center group ${img ? 'border-zinc-200 bg-zinc-50 shadow-sm cursor-default' : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 cursor-pointer border-dashed'}`}
                  >
                    {img ? (
                       <div className="w-full h-full relative">
                           <img src={img} className="w-full h-full object-cover mix-blend-multiply p-0.5" alt={`thumb-${idx}`} />
                           <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                              className="absolute top-1 right-1 bg-white border border-zinc-200 text-zinc-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded w-5 h-5 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                           >
                              <Icon name="XMarkIcon" size={10} strokeWidth={2.5} />
                           </button>
                       </div>
                    ) : (
                       <Icon name="PlusIcon" size={16} className="text-zinc-300 group-hover:text-[#21c45d] transition-colors" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom Drag & Drop Area */}
            <div 
              className="border border-dashed border-zinc-300 bg-zinc-50 rounded-md p-6 flex flex-col items-center justify-center hover:border-[#21c45d] hover:bg-[#ecfdf3]/30 transition-colors cursor-pointer group mt-auto"
              onClick={() => { setUploadSlot(null); dragDropInputRef.current?.click(); }}
            >
              <Icon name="ArrowUpTrayIcon" size={24} className="text-zinc-400 group-hover:text-[#21c45d] transition-colors mb-2" />
              <p className="text-sm text-zinc-700 font-medium">Bulk Upload</p>
              <p className="text-xs text-zinc-500 mt-1">Select multiple files</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 flex items-center justify-end bg-zinc-50 rounded-b-lg gap-3 shrink-0">
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors disabled:opacity-50 cursor-pointer shadow-sm outline-none"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#21c45d] border border-[#21c45d] rounded-md hover:bg-[#1eb053] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm outline-none"
          >
            {isLoading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
            {!isLoading && <Icon name="PlusIcon" size={16} />}
            {t.save}
          </button>
        </div>

      </div>
    </div>
  );
}