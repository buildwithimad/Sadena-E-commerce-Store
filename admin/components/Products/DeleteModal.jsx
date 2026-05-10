'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function DeleteProductModal({ isOpen, onClose, onConfirm, product, lang = 'en', isLoading = false }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Animation States
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      // Small delay to allow the DOM to paint before triggering transition
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRender(false), 300); // 300ms for smooth exit
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render || !product) return null;

  const t = {
    en: { 
      title: 'Delete Product', 
      message: 'Are you sure you want to delete', 
      warning: 'This action cannot be undone. The product and all its variations will be permanently removed from your store.', 
      cancel: 'Cancel', 
      delete: 'Delete Product',
      deleting: 'Deleting...'
    },
    ar: { 
      title: 'حذف المنتج', 
      message: 'هل أنت متأكد أنك تريد حذف', 
      warning: 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف المنتج وجميع متغيراته نهائياً من متجرك.', 
      cancel: 'إلغاء', 
      delete: 'حذف المنتج',
      deleting: 'جاري الحذف...'
    }
  }[lang];

  return (
    <div dir={dir} className={`fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-[2px] transition-opacity duration-300 ease-out font-sans ${visible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backdrop click handler */}
      <div className="absolute inset-0" onClick={() => !isLoading && onClose()} />

      <div className={`relative w-full max-w-md bg-white border border-zinc-200 rounded-lg flex flex-col shadow-xl transform transition-all duration-300 ease-out ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-lg animate-in fade-in duration-200">
            <div className="bg-white px-5 py-3 rounded-md border border-zinc-200 shadow-sm flex items-center gap-3">
              <Icon name="ArrowPathIcon" size={18} className="animate-spin text-red-600" />
              <span className="text-sm font-medium text-zinc-900">{t.deleting}</span>
            </div>
          </div>
        )}

        <div className="p-5 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
            <Icon name="ExclamationTriangleIcon" size={20} className="text-red-600" />
          </div>
          <div className="pt-1">
            <h3 className="text-base font-medium text-zinc-900 leading-none mb-2">
              {t.title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">
              {t.message} <span className="font-medium text-zinc-900">"{product.name}"</span>? {t.warning}
            </p>
          </div>
        </div>

        <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3 rounded-b-lg">
          <button 
            onClick={onClose} 
            disabled={isLoading} 
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50 outline-none shadow-sm"
          >
            {t.cancel}
          </button>
          <button 
            onClick={() => onConfirm(product.id)} 
            disabled={isLoading} 
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 outline-none shadow-sm"
          >
            {isLoading ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : <Icon name="TrashIcon" size={16} />}
            {isLoading ? t.deleting : t.delete}
          </button>
        </div>

      </div>
    </div>
  );
}