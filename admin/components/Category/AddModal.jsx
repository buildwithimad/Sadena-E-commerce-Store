'use client';

import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { uploadImages } from '@/lib/uploadImage';

const defaultFormState = { 
  label: '', label_ar: '', description: '', description_ar: '', image: '' 
};

export default function CategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category = null, 
  lang = 'en', 
  isLoading = false,
  bucketName = 'categories' 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isEdit = !!category;

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(defaultFormState);
  
  // Image States
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null); 
  
  // Animation States
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));

      if (category) {
        setFormData({ ...defaultFormState, ...category });
        setImagePreview(category.image || '');
      } else {
        setFormData(defaultFormState);
        setImagePreview('');
      }
      setImageFile(null);
      setErrors({});
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, category]);

  if (!render) return null;

  const t = {
    en: {
      title: isEdit ? 'Edit Category' : 'New Category',
      fields: {
        name: 'Name (EN)', name_ar: 'Name (AR)',
        desc: 'Description (EN)', desc_ar: 'Description (AR)',
        image: 'Category Thumbnail', imageSub: 'Upload a square image (PNG, JPG)'
      },
      placeholders: {
        name: 'e.g., Electronics', name_ar: 'مثال: إلكترونيات',
        desc: 'Brief description...', desc_ar: 'وصف موجز...'
      },
      validation: { reqName: 'Name is required' },
      cancel: 'Cancel', save: 'Save Category', uploading: 'Saving...'
    },
    ar: {
      title: isEdit ? 'تعديل القسم' : 'قسم جديد',
      fields: {
        name: 'الاسم (إنجليزي)', name_ar: 'الاسم (عربي)',
        desc: 'الوصف (إنجليزي)', desc_ar: 'الوصف (عربي)',
        image: 'صورة القسم', imageSub: 'قم برفع صورة مربعة (PNG, JPG)'
      },
      placeholders: {
        name: 'e.g., Electronics', name_ar: 'مثال: إلكترونيات',
        desc: 'Brief description...', desc_ar: 'وصف موجز...'
      },
      validation: { reqName: 'الاسم مطلوب' },
      cancel: 'إلغاء', save: 'حفظ القسم', uploading: 'جاري الحفظ...'
    }
  }[lang];

  const validate = () => {
    const newErrors = {};
    if (!formData.label?.trim()) newErrors.label = t.validation.reqName;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let finalImageUrl = imagePreview;

    if (imageFile) {
      const uploadedUrls = await uploadImages([imageFile], bucketName);
      if (uploadedUrls && uploadedUrls.length > 0) {
        finalImageUrl = uploadedUrls[0];
      }
    }

    if (finalImageUrl && finalImageUrl.startsWith('blob:')) {
      finalImageUrl = ''; 
    }

    onSubmit({ ...formData, image: finalImageUrl });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImageFile(file);
    }
  };

  const inputClass = (err) => `w-full bg-[#fcfdfc] border ${err ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-[#e6eee6] hover:border-[#d9e6d9] focus:border-[#5c8b5d] focus:ring-[#5c8b5d]/10'} rounded-lg px-4 py-2.5 text-sm text-[#0a1f10] focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 placeholder:text-[#88a88f]`;
  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-[#6b8e70] mb-1.5";

  return (
    <div dir={dir} className="fixed inset-0 z-[100] flex items-center justify-center p-4 perspective-1000">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#0a1f10]/30 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={!isLoading ? onClose : undefined} 
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-2xl border border-[#e6eee6] w-full max-w-xl flex flex-col shadow-2xl transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        
        {/* Loading Overlay inside Modal */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl animate-in fade-in duration-200">
            <div className="bg-white px-5 py-3 rounded-lg border border-[#e6eee6] shadow-sm flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#5c8b5d]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0a1f10]">{t.uploading}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6eee6] flex items-center justify-between bg-[#fcfdfc] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#f0f6f0] text-[#5c8b5d] border border-[#d9e6d9] flex items-center justify-center">
              <Icon name={isEdit ? "PencilSquareIcon" : "FolderPlusIcon"} size={16} />
            </div>
            <h2 className="text-base font-bold text-[#0a1f10] tracking-tight">{t.title}</h2>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-[#88a88f] hover:text-[#0a1f10] hover:bg-[#e6eee6] rounded-md transition-colors outline-none disabled:opacity-50">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] no-scrollbar">
          
          {/* Image Uploader */}
          <div className="flex items-center gap-5 mb-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-20 h-20 rounded-xl border-2 border-dashed border-[#d9e6d9] bg-[#fcfdfc] flex items-center justify-center cursor-pointer hover:bg-[#f0f6f0] hover:border-[#5c8b5d] transition-all group overflow-hidden shrink-0 shadow-sm"
            >
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Icon name="PencilIcon" size={20} className="text-[#0a1f10]" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-[#88a88f] group-hover:text-[#5c8b5d] transition-colors">
                  <Icon name="PhotoIcon" size={24} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0a1f10] mb-1">{t.fields.image}</label>
              <p className="text-xs text-[#6b8e70] mb-3">{t.fields.imageSub}</p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold uppercase tracking-widest text-[#5c8b5d] bg-[#f0f6f0] hover:bg-[#e2f0e3] px-3 py-1.5 rounded-md transition-colors border border-[#d9e6d9]"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {/* English Column */}
            <div className="space-y-5">
              <div>
                <label className={labelClass}>{t.fields.name} *</label>
                <input type="text" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} placeholder={t.placeholders.name} className={inputClass(errors.label)} dir="ltr" />
                {errors.label && <p className="text-xs text-red-500 mt-1 font-medium">{errors.label}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.fields.desc}</label>
                <textarea rows="3" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder={t.placeholders.desc} className={`${inputClass()} resize-none`} dir="ltr" />
              </div>
            </div>

            {/* Arabic Column */}
            <div className="space-y-5" dir="rtl">
              <div>
                <label className={labelClass}>{t.fields.name_ar}</label>
                <input type="text" value={formData.label_ar || ''} onChange={e => setFormData({...formData, label_ar: e.target.value})} placeholder={t.placeholders.name_ar} className={inputClass()} />
              </div>
              <div>
                <label className={labelClass}>{t.fields.desc_ar}</label>
                <textarea rows="3" value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} placeholder={t.placeholders.desc_ar} className={`${inputClass()} resize-none`} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e6eee6] flex items-center justify-end bg-[#fcfdfc] rounded-b-2xl gap-3 shrink-0">
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="px-4 py-2 min-h-[40px] text-xs font-bold tracking-widest uppercase text-[#4a6b50] bg-white border border-[#e6eee6] rounded-md hover:bg-[#f0f6f0] transition-colors disabled:opacity-50"
          >
            {t.cancel}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            className="flex items-center justify-center gap-2 px-6 py-2 min-h-[40px] text-xs font-bold tracking-widest uppercase text-white bg-[#5c8b5d] rounded-md hover:bg-[#4a724b] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-[#5c8b5d]/20"
          >
            {isLoading && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
            {t.save}
          </button>
        </div>

      </div>
    </div>
  );
}