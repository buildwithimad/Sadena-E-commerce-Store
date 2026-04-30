'use client';

import { useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function DeleteCategoryModal({ isOpen, onClose, onConfirm, category, lang = 'en', isLoading = false }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !category) return null;

  const t = {
    en: { title: 'Delete Category', message: 'Are you sure you want to delete', warning: 'This action cannot be undone. Products attached to this category may lose their categorization.', cancel: 'Cancel', delete: 'Delete Category' },
    ar: { title: 'حذف القسم', message: 'هل أنت متأكد أنك تريد حذف', warning: 'لا يمكن التراجع عن هذا الإجراء. قد تفقد المنتجات المرتبطة بهذا القسم تصنيفها.', cancel: 'إلغاء', delete: 'حذف القسم' }
  }[lang];

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.title}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none disabled:opacity-50"><Icon name="XMarkIcon" size={18} /></button>
        </div>
        <div className="px-6 py-6">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4 border border-rose-100"><Icon name="ExclamationTriangleIcon" size={20} className="text-rose-600" /></div>
          <p className="text-gray-900 font-medium mb-1">{t.message} <span className="font-bold">"{category.label}"</span>?</p>
          <p className="text-sm text-gray-500 leading-relaxed">{t.warning}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">{t.cancel}</button>
          <button onClick={() => onConfirm(category.id)} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 text-xs font-bold tracking-widest uppercase text-white bg-rose-600 border border-rose-600 rounded-lg hover:bg-rose-700 transition-all disabled:opacity-50 shadow-sm">{isLoading ? <Icon name="ArrowPathIcon" size={14} className="animate-spin" /> : null} {t.delete}</button>
        </div>
      </div>
    </div>
  );
}