'use client';

import { useEffect, useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

const defaultFormState = { 
  label: '', label_ar: '', description: '', description_ar: '', image: '' 
};

export default function CategoryModal({ 
  isOpen, onClose, onSubmit, category = null, lang = 'en', isLoading = false 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isEdit = !!category;

  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(defaultFormState);
  const [imagePreview, setImagePreview] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (category) {
        setFormData({ ...defaultFormState, ...category });
        setImagePreview(category.image || '');
      } else {
        setFormData(defaultFormState);
        setImagePreview('');
      }
      setErrors({});
      setActiveTab('general');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, category]);

  if (!isOpen) return null;

  const t = {
    en: {
      title: isEdit ? 'Edit Category' : 'Add New Category',
      tabs: { general: 'General', arabic: 'Arabic Content', media: 'Media' },
      fields: {
        name: 'Category Name (English)', name_ar: 'Name (Arabic)',
        desc: 'Description (English)', desc_ar: 'Description (Arabic)',
        image: 'Category Image'
      },
      validation: { reqName: 'Category Name is required' },
      cancel: 'Cancel', save: 'Save Changes', create: 'Create Category'
    },
    ar: {
      title: isEdit ? 'تعديل القسم' : 'إضافة قسم جديد',
      tabs: { general: 'عام', arabic: 'المحتوى العربي', media: 'الصورة' },
      fields: {
        name: 'اسم القسم (إنجليزي)', name_ar: 'الاسم (عربي)',
        desc: 'الوصف (إنجليزي)', desc_ar: 'الوصف (عربي)',
        image: 'صورة القسم'
      },
      validation: { reqName: 'اسم القسم مطلوب' },
      cancel: 'إلغاء', save: 'حفظ', create: 'إنشاء'
    }
  }[lang];

  const validate = () => {
    const newErrors = {};
    if (!formData.label?.trim()) newErrors.label = t.validation.reqName;
    setErrors(newErrors);
    if (newErrors.label) setActiveTab('general');
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...formData, image: imagePreview });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const inputClass = (err) => `w-full bg-gray-50/50 border ${err ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-green-500 focus:ring-green-500/10'} rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200`;
  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" onClick={!isLoading ? onClose : undefined} />

      <div className="relative bg-white rounded-3xl border border-gray-100 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/30 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEdit ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
              <Icon name={isEdit ? "PencilSquareIcon" : "PlusIcon"} size={16} />
            </div>
            <h2 className="text-base font-bold text-gray-900">{t.title}</h2>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none disabled:opacity-50">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-2 border-b border-gray-100 overflow-x-auto no-scrollbar shrink-0">
          {['general', 'arabic', 'media'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors outline-none ${activeTab === tab ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 no-scrollbar bg-white">
          
          {activeTab === 'general' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className={labelClass}>{t.fields.name} *</label>
                <input type="text" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} className={inputClass(errors.label)} dir="ltr" />
                {errors.label && <p className="text-xs text-red-500 mt-1 font-medium">{errors.label}</p>}
              </div>
              <div>
                <label className={labelClass}>{t.fields.desc}</label>
                <textarea rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className={`${inputClass()} resize-none`} dir="ltr" />
              </div>
            </div>
          )}

          {activeTab === 'arabic' && (
            <div className="space-y-5 animate-in fade-in duration-200" dir="rtl">
              <div>
                <label className={labelClass}>{t.fields.name_ar}</label>
                <input type="text" value={formData.label_ar || ''} onChange={e => setFormData({...formData, label_ar: e.target.value})} className={inputClass()} />
              </div>
              <div>
                <label className={labelClass}>{t.fields.desc_ar}</label>
                <textarea rows="4" value={formData.description_ar || ''} onChange={e => setFormData({...formData, description_ar: e.target.value})} className={`${inputClass()} resize-none`} />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <label className={labelClass}>{t.fields.image}</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="relative w-40 h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-green-400 transition-all group overflow-hidden"
                >
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                  {imagePreview ? (
                    <><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Icon name="ArrowPathIcon" size={24} className="text-white" /></div></>
                  ) : (<div className="flex flex-col items-center text-gray-400 group-hover:text-green-500 transition-colors"><Icon name="PhotoIcon" size={32} /><span className="text-[10px] font-bold mt-2 uppercase tracking-widest">+ Upload</span></div>)}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end shrink-0 bg-gray-50/50 rounded-b-3xl gap-2">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">{t.cancel}</button>
          <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 text-xs font-bold tracking-widest uppercase text-white bg-gray-900 rounded-lg hover:bg-black transition-all disabled:opacity-50 shadow-sm">{isLoading && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}{isEdit ? t.save : t.create}</button>
        </div>

      </div>
    </div>
  );
}