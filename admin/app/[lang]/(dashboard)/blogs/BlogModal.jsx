'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Icon from '@/components/ui/AppIcon';
import { uploadImages } from '@/lib/uploadImage';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent Next.js SSR document errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const defaultFormState = {
  title: '', title_ar: '', excerpt: '', excerpt_ar: '',
  content: '', content_ar: '', is_published: false, image: ''
};

export default function BlogModal({ isOpen, onClose, onSuccess, blog = null, lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isEdit = !!blog;

  // Animation & mounting states
  const [render, setRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(defaultFormState);

  const t = {
    en: {
      addTitle: 'Create New Blog', editTitle: 'Edit Blog',
      cancel: 'Cancel', save: 'Save Blog',
      form: {
        title: 'Title (English)', titleAr: 'Title (Arabic)',
        excerpt: 'Excerpt (English)', excerptAr: 'Excerpt (Arabic)',
        content: 'Content (English)', contentAr: 'Content (Arabic)',
        image: 'Cover Image', isPublished: 'Publish immediately'
      }
    },
    ar: {
      addTitle: 'إنشاء مدونة جديدة', editTitle: 'تعديل المدونة',
      cancel: 'إلغاء', save: 'حفظ المدونة',
      form: {
        title: 'العنوان (إنجليزي)', titleAr: 'العنوان (عربي)',
        excerpt: 'المقتطف (إنجليزي)', excerptAr: 'المقتطف (عربي)',
        content: 'المحتوى (إنجليزي)', contentAr: 'المحتوى (عربي)',
        image: 'صورة الغلاف', isPublished: 'نشر فوراً'
      }
    }
  }[lang];

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
      
      if (blog) {
        setFormData({ ...defaultFormState, ...blog });
        setImagePreview(blog.image || '');
      } else {
        setFormData({ ...defaultFormState });
        setImagePreview('');
      }
      setImageFile(null);
      setApiError(null);

      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      
      const timer = setTimeout(() => {
        setRender(false);
        setFormData({ ...defaultFormState });
        setImagePreview('');
        setImageFile(null);
        setApiError(null);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, blog]);

  if (!render) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);

    try {
      let finalImageUrl = formData.image;
      if (imageFile) {
        const urls = await uploadImages([imageFile], 'blogs');
        finalImageUrl = urls[0];
      }

      const url = isEdit ? `/api/blogs/${blog.id}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: finalImageUrl })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      onSuccess(result.data, method);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 focus:border-[#21c45d] focus:ring-[#21c45d]/20 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  // Quill Editor Toolbar Settings
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div dir={dir} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} 
        onClick={() => !isLoading && onClose()} 
      />
      
      <div className={`relative w-full max-w-4xl max-h-[90vh] bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-xl transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
        
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? t.editTitle : t.addTitle}
          </h2>
          <button type="button" onClick={onClose} disabled={isLoading} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all outline-none">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {apiError && <div className="mx-6 mt-6 p-4 bg-red-50 text-red-600 text-sm font-medium border border-red-200 rounded-md">{apiError}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto p-6 space-y-6 quill-custom-container">
            
            {/* Image Upload */}
            <div>
              <label className={labelClass}>{t.form.image}</label>
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="text-center">
                  {imagePreview ? (
                      <img src={imagePreview} className="mx-auto h-32 object-contain rounded-md border border-gray-200" alt="Preview" />
                  ) : (
                    <Icon name="PhotoIcon" size={40} className="mx-auto text-gray-300" />
                  )}
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <span className="relative cursor-pointer rounded-md font-medium text-[#21c45d] hover:text-[#1eb053]">
                      <span>Upload a file</span>
                      <input ref={fileInputRef} type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Excerpt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>{t.form.title}</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>{t.form.titleAr}</label>
                <input type="text" value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} className={inputClass} dir="rtl" />
              </div>
              <div>
                <label className={labelClass}>{t.form.excerpt}</label>
                <textarea rows={2} value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className={`${inputClass} resize-none`} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>{t.form.excerptAr}</label>
                <textarea rows={2} value={formData.excerpt_ar} onChange={e => setFormData({...formData, excerpt_ar: e.target.value})} className={`${inputClass} resize-none`} dir="rtl" />
              </div>
            </div>

            {/* Real Content Editor (React Quill) */}
            {/* 👉 REMOVED h-48 and overflow-hidden to let Quill handle its own sizing properly */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col h-full">
                <label className={labelClass}>{t.form.content}</label>
                <div className="bg-white rounded-md border border-gray-200 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all">
                  <ReactQuill theme="snow" modules={quillModules} value={formData.content || ''} onChange={val => setFormData({...formData, content: val})} />
                </div>
              </div>
              <div className="flex flex-col h-full">
                <label className={labelClass}>{t.form.contentAr}</label>
                <div className="bg-white rounded-md border border-gray-200 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all" dir="rtl">
                  <ReactQuill theme="snow" modules={quillModules} value={formData.content_ar || ''} onChange={val => setFormData({...formData, content_ar: val})} />
                </div>
              </div>
            </div>

            {/* Toggle */}
            <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#21c45d]"></div>
              </div>
              <span className="text-sm font-medium text-gray-900">{t.form.isPublished}</span>
            </label>

          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all">{t.cancel}</button>
            <button type="submit" disabled={isLoading} className="px-5 py-2 text-sm font-medium text-white bg-[#21c45d] rounded-md hover:bg-[#1eb053] transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm">
              {isLoading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />} {t.save}
            </button>
          </div>
        </form>

      </div>
      
      {/* 👉 UPDATED CSS PATCH */}
      <style dangerouslySetInnerHTML={{__html: `
        .quill-custom-container .ql-toolbar { 
          border: none !important; 
          border-bottom: 1px solid #e5e7eb !important; 
          background: #f9fafb; 
          border-radius: 0.375rem 0.375rem 0 0;
          direction: ltr !important; /* Fixes arabic squished toolbar */
          display: flex;
          flex-wrap: wrap;
        }
        .quill-custom-container .ql-container { 
          border: none !important; 
          font-family: inherit; 
          font-size: 14px;
        }
        .quill-custom-container .ql-editor { 
          min-height: 200px; 
          max-height: 350px; /* Adds scrollbar inside the editor when text gets too long */
          overflow-y: auto;
        }
      `}} />
    </div>
  );
}