'use client';

import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function DeleteProductModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  product, 
  lang = 'en',
  isLoading = false 
}) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // --- Animation States ---
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  // Smooth Mount/Unmount Logic
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      // Slight delay for staging (backdrop first, then modal)
      requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 10);
      });
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRender(false), 400); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render || !product) return null;

  const t = {
    en: {
      title: 'Delete Product',
      message: 'Are you sure you want to delete',
      warning: 'This action cannot be undone. This will permanently delete the product and remove its data from our servers.',
      cancel: 'Cancel',
      delete: 'Delete Product'
    },
    ar: {
      title: 'حذف المنتج',
      message: 'هل أنت متأكد أنك تريد حذف',
      warning: 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف المنتج نهائياً وإزالة بياناته من خوادمنا.',
      cancel: 'إلغاء',
      delete: 'حذف المنتج'
    }
  }[lang];

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 perspective-1000">
      
      {/* Animated Backdrop */}
      <div 
        className={`absolute inset-0 bg-gray-900/20 backdrop-blur-md transition-opacity duration-500 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={!isLoading ? onClose : undefined} 
      />

      {/* Animated Modal Container */}
      <div 
        className={`relative bg-white w-full max-w-md flex flex-col rounded-2xl shadow-2xl ring-1 ring-black/5 transform origin-bottom sm:origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 sm:scale-95 translate-y-full sm:translate-y-8'
        }`}
      >
        
        {/* Loading Overlay (Optional for extra polish) */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300 rounded-2xl" />
        )}

        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-20">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.title}</h2>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 outline-none cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="px-6 py-8 bg-white relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-rose-50/50 flex items-center justify-center mb-5 border border-rose-100 ring-4 ring-rose-50 shadow-sm shadow-rose-100/50">
            <Icon name="ExclamationTriangleIcon" size={24} className="text-rose-600" />
          </div>
          <p className="text-gray-900 font-medium mb-2 text-sm sm:text-base">
            {t.message} <span className="font-bold text-rose-600">"{product.name}"</span>?
          </p>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            {t.warning}
          </p>
        </div>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3 z-20">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-5 sm:px-6 py-2.5 min-h-[44px] text-xs font-bold tracking-widest uppercase text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm shadow-black/[0.02]"
          >
            {t.cancel}
          </button>
          <button 
            onClick={() => onConfirm(product.id)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 min-h-[44px] text-xs font-bold tracking-widest uppercase text-white bg-rose-600 border border-transparent rounded-xl hover:bg-rose-700 shadow-sm shadow-rose-600/20 transition-all duration-200 focus:outline-none cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
            ) : (
              <Icon name="TrashIcon" size={16} />
            )}
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}