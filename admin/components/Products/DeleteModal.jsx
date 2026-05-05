// DeleteProductModal.jsx
'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function DeleteProductModal({ isOpen, onClose, onConfirm, product, lang = 'en', isLoading = false }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    } else {
      setVisible(false);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => setRender(false), 200); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render || !product) return null;

  const t = {
    en: { title: 'Delete Product', message: 'Are you sure you want to delete', warning: 'This action cannot be undone. The product and all its variations will be permanently removed from your store.', cancel: 'Cancel', delete: 'Delete' },
    ar: { title: 'حذف المنتج', message: 'هل أنت متأكد أنك تريد حذف', warning: 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف المنتج وجميع متغيراته نهائياً من متجرك.', cancel: 'إلغاء', delete: 'حذف' }
  }[lang];

  return (
    <div dir={dir} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden transform transition-all duration-200 ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-red-500" />
              <span className="text-[13px] font-bold uppercase tracking-widest text-gray-900">Deleting...</span>
            </div>
          </div>
        )}

        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.title}</h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none disabled:opacity-50"><Icon name="XMarkIcon" size={18} /></button>
        </div>
        <div className="px-6 py-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4 border-[6px] border-red-50/50"><Icon name="ExclamationTriangleIcon" size={24} className="text-red-500" /></div>
          <p className="text-gray-900 font-semibold mb-2 text-[15px]">{t.message} <span className="font-bold text-red-500">"{product.name}"</span>?</p>
          <p className="text-[13px] text-gray-500 leading-relaxed max-w-[90%]">{t.warning}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm">{t.cancel}</button>
          <button onClick={() => onConfirm(product.id)} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 shadow-sm shadow-red-500/20">
            <Icon name="TrashIcon" size={14} /> {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}