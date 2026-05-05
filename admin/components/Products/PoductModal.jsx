'use client';

import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { uploadImages } from '@/lib/uploadImage';

const defaultFormState = { 
  label: '', label_ar: '', description: '', description_ar: '', images: [null, null, null, null, null], image: '',
  sku: '', category_id: '', is_published: 'true', tags: '',
  price: '', discount_price: '', stock: '', stockData: [],
  short_description: '', short_description_ar: '',
  is_featured: false, is_best_seller: false, is_on_sale: false
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
          stockData: product.stockData || []
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
      subtitle: 'Fill in the details to add a new product to your store',
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
      },
      placeholders: {
        name: 'e.g. Organic Aloe Vera Gel', name_ar: 'مثال: جل الألوفيرا العضوي', sku: 'e.g. ALOE-VERA-001',
        tags: 'e.g. aloe, gel, organic', shortDesc: 'Enter short description in English...', shortDesc_ar: 'أدخل وصفًا قصيرًا باللغة العربية...',
        desc: 'Enter full description in English...', desc_ar: 'أدخل وصفًا تفصيليًا باللغة العربية...',
        category: 'Select category', status: 'Select status'
      },
      validation: { reqName: 'Name is required' },
      cancel: 'Cancel', save: isEdit ? 'Save Changes' : 'Add Product', uploading: 'Saving...',
      warehouseAlloc: 'Warehouse Allocations',
      table: { warehouse: 'Warehouse', stock: 'Stock Quantity' }
    },
    ar: {
      title: isEdit ? 'تعديل المنتج' : 'إضافة منتج',
      subtitle: 'أدخل التفاصيل لإضافة منتج جديد لمتجرك',
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
      },
      placeholders: {
        name: 'e.g. Organic Aloe Vera Gel', name_ar: 'مثال: جل الألوفيرا العضوي', sku: 'e.g. ALOE-VERA-001',
        tags: 'e.g. aloe, gel, organic', shortDesc: 'Enter short description in English...', shortDesc_ar: 'أدخل وصفًا قصيرًا باللغة العربية...',
        desc: 'Enter full description in English...', desc_ar: 'أدخل وصفًا تفصيليًا باللغة العربية...',
        category: 'اختر القسم', status: 'اختر الحالة'
      },
      validation: { reqName: 'الاسم مطلوب' },
      cancel: 'إلغاء', save: isEdit ? 'حفظ التغييرات' : 'إضافة المنتج', uploading: 'جاري الحفظ...',
      warehouseAlloc: 'توزيع المستودعات',
      table: { warehouse: 'المستودع', stock: 'كمية المخزون' }
    }
  }[lang];

  const validate = () => {
    const newErrors = {};
    if (!formData.label?.trim() && !formData.name?.trim()) newErrors.label = t.validation.reqName;
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
        // Targeted upload to a specific slot
        newImages[uploadSlot] = URL.createObjectURL(files[0]);
        newFiles[uploadSlot] = files[0];
      } else {
        // Bulk upload (fills first available empty slots)
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
    
    // Auto sync total stock sum
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

    // Filter out empty slots and blob URLs
    const cleanImages = finalImages.filter(url => url && !url.startsWith('blob:'));
    onSubmit({ ...formData, images: cleanImages, image: cleanImages[0] || '' });
  };

  const inputClass = (err) => `w-full bg-white border ${err ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border-gray-200 hover:border-gray-300 focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d]'} rounded-[10px] px-4 py-2.5 text-sm text-gray-900 focus:outline-none transition-all duration-300 placeholder:text-gray-400`;
  const labelClass = "block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2";

  // Safe access to images
  const safeImages = formData.images || [null, null, null, null, null];

  return (
    <div dir={dir} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 perspective-1000">
      
      {/* Hidden inputs for uploading */}
      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
      <input type="file" accept="image/*" multiple className="hidden" ref={dragDropInputRef} onChange={handleImageUpload} />

      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={!isLoading ? onClose : undefined} 
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-[#fbfcfb] rounded-2xl w-full max-w-[1000px] flex flex-col shadow-2xl transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-h-[95vh] ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        
        {/* Loading Overlay inside Modal */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-in fade-in duration-200">
            <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#21c45d]" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-900">{t.uploading}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white flex items-center justify-between shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf3] text-[#21c45d] flex items-center justify-center border border-[#dcfce7]">
              <Icon name="CubeIcon" size={20} variant="outline" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.title}</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-2 text-gray-400 bg-white border border-gray-100 hover:border-gray-200 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all outline-none disabled:opacity-50 shadow-sm cursor-pointer">
            <Icon name="XMarkIcon" size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto no-scrollbar">
          
          {/* LEFT SIDE (FORM) - 7 cols */}
          <div className="lg:col-span-7 p-6 lg:p-8 space-y-8 bg-white lg:border-r border-gray-100">
            
            {/* Top Grid: Name, SKU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.fields.name}</label>
                <input type="text" value={formData.label || formData.name || ''} onChange={e => setFormData({...formData, label: e.target.value, name: e.target.value})} placeholder={t.placeholders.name} className={inputClass(errors.label)} dir="ltr" />
                {errors.label && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.label}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.fields.name_ar}</label>
                <input type="text" value={formData.label_ar || formData.name_ar || ''} onChange={e => setFormData({...formData, label_ar: e.target.value, name_ar: e.target.value})} placeholder={t.placeholders.name_ar} className={inputClass()} dir="rtl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-1">
                <label className={labelClass}>{t.fields.sku}</label>
                <input type="text" value={formData.sku || ''} onChange={e => setFormData({...formData, sku: e.target.value})} placeholder={t.placeholders.sku} className={inputClass()} dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                 <div className="grid grid-cols-2 gap-5">
                   <div>
                     <label className={labelClass}>{t.fields.category}</label>
                     <div className="relative">
                       <select value={formData.category_id || ''} onChange={e => setFormData({...formData, category_id: e.target.value})} className={`${inputClass()} appearance-none pr-10 cursor-pointer`}>
                         <option value="" disabled>{t.placeholders.category}</option>
                         {categories?.map((cat) => (
                           <option key={cat.id} value={cat.id}>{lang === 'ar' ? cat.name_ar || cat.label_ar : cat.name || cat.label}</option>
                         ))}
                       </select>
                       <Icon name="ChevronDownIcon" size={16} className={`absolute top-3.5 text-gray-400 pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
                     </div>
                   </div>
                   <div>
                     <label className={labelClass}>{t.fields.status}</label>
                     <div className="relative">
                       <select value={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.value})} className={`${inputClass()} appearance-none pr-10 cursor-pointer`}>
                         <option value="true">Published</option>
                         <option value="false">Draft</option>
                       </select>
                       <Icon name="ChevronDownIcon" size={16} className={`absolute top-3.5 text-gray-400 pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
                     </div>
                   </div>
                 </div>
              </div>
            </div>
            
            <div>
               <label className={labelClass}>{t.fields.tags}</label>
               <input type="text" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder={t.placeholders.tags} className={inputClass()} dir="ltr" />
               <p className="text-[11px] text-gray-400 mt-2">Press enter to add multiple tags</p>
            </div>

            <hr className="border-gray-100" />

            {/* Pricing & Inventory */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Icon name="TagIcon" size={18} className="text-[#21c45d]" variant="outline" />
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelClass}>{t.fields.price}</label>
                  <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className={inputClass()} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.discount}</label>
                  <input type="number" value={formData.discount_price || ''} onChange={e => setFormData({...formData, discount_price: e.target.value})} placeholder="0.00" className={inputClass()} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.stock}</label>
                  <input type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" className={inputClass()} dir="ltr" disabled={warehouses.length > 0} />
                </div>
              </div>

              {/* Warehouse Allocations inline directly within Pricing block */}
              {warehouses.length > 0 && (
                <div className="mt-5 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3">{t.table.warehouse}</th>
                        <th className="px-4 py-3 w-32 text-center">{t.table.stock}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {warehouses.map((w) => {
                        const whStock = formData.stockData?.find(s => s.warehouse_id === w.id)?.stock || '';
                        return (
                          <tr key={w.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-700">
                              {lang === 'ar' ? w.name_ar || w.name : w.name}
                            </td>
                            <td className="px-4 py-2">
                              <input 
                                type="number" min="0" value={whStock} 
                                onChange={(e) => handleWarehouseStockChange(w.id, e.target.value)} 
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d] outline-none transition-all text-center" 
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
            </div>

            <hr className="border-gray-100" />

            {/* Descriptions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Icon name="DocumentTextIcon" size={18} className="text-[#21c45d]" variant="outline" />
                Descriptions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>{t.fields.shortDesc}</label>
                  <textarea rows="3" value={formData.short_description || ''} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder={t.placeholders.shortDesc} className={`${inputClass()} resize-none`} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.shortDesc_ar}</label>
                  <textarea rows="3" value={formData.short_description_ar || ''} onChange={e => setFormData({...formData, short_description_ar: e.target.value})} placeholder={t.placeholders.shortDesc_ar} className={`${inputClass()} resize-none`} dir="rtl" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>{t.fields.desc}</label>
                  <textarea rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder={t.placeholders.desc} className={`${inputClass()} resize-none`} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.fields.desc_ar}</label>
                  <textarea rows="4" value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} placeholder={t.placeholders.desc_ar} className={`${inputClass()} resize-none`} dir="rtl" />
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Features / Flags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Icon name="Squares2X2Icon" size={18} className="text-[#21c45d]" variant="outline" />
                Features / Flags
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{t.fields.featured}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{t.fields.featuredSub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" checked={formData.is_featured || false} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21c45d]"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{t.fields.bestSeller}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{t.fields.bestSellerSub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" checked={formData.is_best_seller || false} onChange={e => setFormData({...formData, is_best_seller: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21c45d]"></div>
                  </label>
                </div>
                <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{t.fields.onSale}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{t.fields.onSaleSub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" checked={formData.is_on_sale || false} onChange={e => setFormData({...formData, is_on_sale: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21c45d]"></div>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE (IMAGES) - 5 cols */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col bg-[#fcfdfc] border-l border-gray-100/50">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                <Icon name="PhotoIcon" size={18} className="text-[#21c45d]" variant="solid" />
                {t.fields.images}
              </h3>
              <p className="text-[12px] text-gray-500 ml-7">{t.fields.imagesSub}</p>
            </div>

            {/* BIG Preview / Slot 0 */}
            <div 
              onClick={() => { if(!safeImages[0]) { setUploadSlot(0); fileInputRef.current?.click(); } }}
              className={`relative aspect-square w-full rounded-[20px] overflow-hidden flex flex-col items-center justify-center mb-5 group shadow-sm transition-all ${safeImages[0] ? 'border border-gray-200 bg-white cursor-default' : 'bg-gray-50 border border-dashed border-gray-300 hover:bg-gray-100/50 cursor-pointer'}`}
            >
              {safeImages[0] ? (
                <>
                  <img src={safeImages[0]} className="w-full h-full object-cover mix-blend-multiply" alt="Preview" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(0); }}
                    className="absolute top-3 right-3 bg-white/90 text-gray-500 hover:text-red-500 hover:bg-red-50 border border-gray-200 rounded-lg w-8 h-8 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                  >
                    <Icon name="TrashIcon" size={16} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="relative mb-5">
                    <Icon name="PhotoIcon" size={64} className="text-gray-300" />
                    <div className="absolute -bottom-1 -right-2 bg-[#21c45d] text-white rounded-full p-1 border-[4px] border-white shadow-sm">
                      <Icon name="PlusIcon" size={14} strokeWidth={3} />
                    </div>
                  </div>
                  <p className="text-[16px] font-bold text-gray-800">Upload Main Image</p>
                  <p className="text-[12px] text-gray-500 mt-2 font-medium">PNG, JPG or WEBP</p>
                  <p className="text-[11px] text-gray-400 mt-1">Square or 1:1 ratio recommended</p>
                </div>
              )}
            </div>

            {/* Thumbnails Row (Slots 1 to 4) */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[1, 2, 3, 4].map((idx) => {
                const img = safeImages[idx];

                return (
                  <div 
                    key={idx} 
                    onClick={() => { if(!img) { setUploadSlot(idx); fileInputRef.current?.click(); } }}
                    className={`relative aspect-square rounded-xl border-2 transition-all overflow-hidden flex items-center justify-center group ${img ? 'border-gray-200 bg-white shadow-sm cursor-default' : 'border-gray-100 bg-gray-50 hover:border-gray-200 cursor-pointer border-dashed'}`}
                  >
                    {img ? (
                       <div className="w-full h-full rounded-lg overflow-hidden relative">
                           <img src={img} className="w-full h-full object-cover mix-blend-multiply p-0.5" alt={`thumb-${idx}`} />
                           <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                              className="absolute top-1 right-1 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-md w-6 h-6 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer"
                           >
                              <Icon name="XMarkIcon" size={12} strokeWidth={2.5} />
                           </button>
                       </div>
                    ) : (
                       <Icon name="PlusIcon" size={20} className="text-gray-300 group-hover:text-[#21c45d] transition-colors" />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Bottom Drag & Drop Area (Bulk Upload) */}
            <div 
              className="border border-dashed border-[#21c45d]/40 bg-[#ecfdf3]/30 rounded-[20px] p-8 flex flex-col items-center justify-center relative hover:bg-[#ecfdf3]/50 transition-colors cursor-pointer group shadow-sm mt-auto"
              onClick={() => { setUploadSlot(null); dragDropInputRef.current?.click(); }}
            >
              <Icon name="CloudArrowUpIcon" size={32} className="text-gray-400 group-hover:text-[#21c45d] transition-colors mb-3" />
              <p className="text-[14px] text-gray-800 font-semibold">Drag & Drop your images here</p>
              <p className="text-xs text-gray-500 mt-1">or <span className="text-[#21c45d] font-medium">click to browse</span></p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 lg:px-8 py-4 border-t border-gray-100 flex items-center justify-end bg-white rounded-b-2xl gap-4 shrink-0 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.02)] relative z-10">
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="px-6 py-2.5 min-h-[44px] text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 cursor-pointer outline-none shadow-sm"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="flex items-center justify-center gap-2 px-6 py-2.5 min-h-[44px] text-[13px] font-semibold text-white bg-[#21c45d] rounded-xl hover:bg-[#1eb053] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-[#21c45d]/20 cursor-pointer outline-none"
          >
            {isLoading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
            {!isLoading && <Icon name="PlusIcon" size={18} strokeWidth={2.5} />}
            {t.save}
          </button>
        </div>

      </div>
    </div>
  );
}