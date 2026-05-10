"use client";

import { useState, useRef } from "react";
import Icon from '@/components/ui/AppIcon';
import { uploadImages } from '@/lib/uploadImage'; 

export default function BannerModal({ editing, onClose, onSave, showToast }) {
  const isEdit = !!editing;
  const [isLoading, setIsLoading] = useState(false);
  
  // Smooth Closing State
  const [isClosing, setIsClosing] = useState(false);

  // Wrapper for onClose to handle animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  // File Upload State
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editing?.image || "");

  const [form, setForm] = useState({
    section: editing?.section || "hero",
    image: editing?.image || "", 
    title: editing?.title || "",
    title_ar: editing?.title_ar || "",
    subtitle: editing?.subtitle || "",
    subtitle_ar: editing?.subtitle_ar || "",
    position: editing?.position || 0,
    is_active: editing?.is_active ?? true,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!imagePreview) return showToast("A banner image is required", "error");
    
    setIsLoading(true);
    showToast("Saving banner...", "loading");

    try {
      let finalImageUrl = form.image;

      if (imageFile) {
        const urls = await uploadImages([imageFile], 'banners'); 
        if (!urls || urls.length === 0) throw new Error("Failed to upload image.");
        finalImageUrl = urls[0];
      }

      const url = isEdit ? `/api/banners/${editing.id}` : `/api/banners`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image: finalImageUrl }),
      });

      const data = await res.json();

      if (data.success || data.data) {
        const savedBanner = data.data || data; 
        onSave(savedBanner, isEdit);
        showToast("Banner saved successfully", "success");
        handleClose(); 
      } else {
        throw new Error(data.error || "Failed to save banner");
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
      setIsLoading(false); 
    }
  }

  const inputClass = "w-full bg-white border border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#21c45d]/20 focus:border-[#21c45d] transition-all placeholder:text-zinc-400";
  const labelClass = "block text-[13px] font-medium text-zinc-700 mb-1.5";

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm transition-all ${isClosing ? 'animate-out fade-out duration-300 ease-in' : 'animate-in fade-in duration-300 ease-out'}`}>
      <div className="absolute inset-0" onClick={() => !isLoading && handleClose()} />

      <div className={`relative w-full max-w-2xl bg-white border border-zinc-200 rounded-lg flex flex-col shadow-xl transition-all ${isClosing ? 'animate-out zoom-out-95 fade-out duration-300 ease-in' : 'animate-in zoom-in-95 fade-in duration-300 ease-out'}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0 rounded-t-lg">
          <h2 className="text-base font-medium text-zinc-900">
            {isEdit ? "Edit Banner" : "Create a new Banner"}
          </h2>
          <button onClick={handleClose} disabled={isLoading} className="text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors outline-none">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="p-6 space-y-6 overflow-y-auto">

            {/* File Upload Area */}
            <div>
              <label className={labelClass}>Banner Image</label>
              <div 
                className="mt-1 relative flex justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 h-40 hover:bg-zinc-100 transition-colors cursor-pointer overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-zinc-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium flex items-center gap-2">
                        <Icon name="PhotoIcon" size={16} /> Replace image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <Icon name="ArrowUpTrayIcon" size={24} className="text-zinc-400 mb-2" />
                    <span className="text-sm font-medium text-[#21c45d]">Upload a file</span>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
              </div>
            </div>

            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Title (EN)</label>
                <input type="text" placeholder="e.g. Summer Sale" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>Title (AR)</label>
                <input type="text" placeholder="مثال: تخفيضات الصيف" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className={inputClass} dir="rtl" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Subtitle (EN)</label>
                <input type="text" placeholder="Optional text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className={labelClass}>Subtitle (AR)</label>
                <input type="text" placeholder="نص اختياري" value={form.subtitle_ar} onChange={(e) => setForm({ ...form, subtitle_ar: e.target.value })} className={inputClass} dir="rtl" />
              </div>
            </div>

            {/* Config Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-zinc-100">
              <div>
                <label className={labelClass}>Section</label>
                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className={`${inputClass} cursor-pointer`}>
                  <option value="hero">Hero Slider</option>
                  <option value="new_arrivals">New Arrivals</option>
                  <option value="offers">Offers</option>
                  <option value="best_sellers">Best Sellers</option>
                  <option value="featured">Featured</option>
                  <option value="special">Special</option>
                  <option value="weekly">Weekly Offer</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Display Order</label>
                <input type="number" min="0" placeholder="0" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} className={inputClass} />
              </div>
            </div>

            {/* ACTIVE TOGGLE (Supabase Style) */}
            <div className="flex items-center justify-between pt-4">
              <div>
                <label className="text-sm font-medium text-zinc-900 block">Publish Banner</label>
                <span className="text-xs text-zinc-500">Make this banner visible on the store</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={form.is_active} 
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })} 
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#21c45d] peer-checked:border-[#21c45d]"></div>
              </label>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3 shrink-0 rounded-b-lg">
            <button 
              type="button" 
              onClick={handleClose} 
              disabled={isLoading} 
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="px-4 py-2 text-sm font-medium text-white bg-[#21c45d] border border-[#21c45d] rounded-md hover:bg-[#1eb053] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Banner'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}