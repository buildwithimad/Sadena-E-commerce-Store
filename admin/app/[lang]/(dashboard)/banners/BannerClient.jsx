"use client";

import { useState } from "react";
import BannerModal from "./BannerModal";
import Icon from '@/components/ui/AppIcon';

export default function BannerClient({ initialBanners }) {
  const [banners, setBanners] = useState(initialBanners || []);
  
  // Banner Modal State
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosingDelete, setIsClosingDelete] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (type !== "loading") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const closeToast = () => setToast(null);

  // --- DELETE MODAL LOGIC ---
  const openDeleteModal = (banner) => {
    setBannerToDelete(banner);
    setIsClosingDelete(false);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsClosingDelete(true);
    setTimeout(() => {
      setDeleteModalOpen(false);
      setBannerToDelete(null);
    }, 300); 
  };

  async function confirmDelete() {
    if (!bannerToDelete) return;
    
    setIsDeleting(true);
    showToast("Deleting banner...", "loading");
    
    try {
      await fetch(`/api/banners/${bannerToDelete.id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      showToast("Banner deleted successfully", "success");
      closeDeleteModal();
    } catch (error) {
      showToast("Failed to delete banner", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  // Format section names for display
  const formatSection = (section) => {
    return section.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-20 text-zinc-900">

      {/* HEADER & TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-normal tracking-tight text-zinc-900">Banners</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage dynamic images and content for your homepage sections.</p>
        </div>

        <button 
          onClick={() => { setEditing(null); setOpen(true); }} 
          className="px-4 py-2 bg-[#21c45d] text-white text-sm font-medium rounded-md hover:bg-[#1eb053] transition-all cursor-pointer shadow-sm flex items-center gap-2 justify-center"
        >
          <Icon name="PlusIcon" size={16} /> New Banner
        </button>
      </div>

      {/* SUPABASE-STYLE TABLE */}
      <div className="bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 font-medium">
                <th className="px-6 py-3 font-medium">Image Preview</th>
                <th className="px-6 py-3 font-medium">Section</th>
                <th className="px-6 py-3 font-medium text-center">Position</th>
                <th className="px-6 py-3 font-medium text-center">Status</th>
                <th className="px-6 py-3 font-medium text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-sm">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-400">
                    No banners found. Click "New Banner" to create one.
                  </td>
                </tr>
              ) : (
                banners.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="w-24 h-12 rounded bg-zinc-100 overflow-hidden border border-zinc-200 relative flex items-center justify-center">
                        {b.image ? (
                          <img src={b.image} className="w-full h-full object-cover" alt="Banner preview" />
                        ) : (
                          <Icon name="PhotoIcon" size={16} className="text-zinc-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-zinc-700">{formatSection(b.section)}</td>
                    <td className="px-6 py-3 text-center text-zinc-500 font-mono text-xs">{b.position}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${
                        b.is_active ? 'bg-emerald-50 text-[#21c45d] border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${b.is_active ? 'bg-[#21c45d]' : 'bg-zinc-400'}`}></span>
                        {b.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditing(b); setOpen(true); }} className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded cursor-pointer transition-colors" title="Edit">
                          <Icon name="PencilSquareIcon" size={16} />
                        </button>
                        <button onClick={() => openDeleteModal(b)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors" title="Delete">
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 bg-zinc-900 text-white px-4 py-3 rounded-md shadow-lg border border-zinc-800 text-sm font-medium min-w-[250px]">
          {toast.type === "loading" && <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#21c45d]" />}
          {toast.type === "success" && <Icon name="CheckCircleIcon" size={18} className="text-[#21c45d]" />}
          {toast.type === "error" && <Icon name="ExclamationCircleIcon" size={18} className="text-red-400" />}
          <span className="flex-1">{toast.message}</span>
          {toast.type !== "loading" && (
            <button onClick={closeToast} className="text-zinc-400 hover:text-white cursor-pointer ml-2">
              <Icon name="XMarkIcon" size={16} />
            </button>
          )}
        </div>
      )}

      {/* BANNER EDIT/CREATE MODAL */}
      {open && (
        <BannerModal
          editing={editing}
          onClose={() => setOpen(false)}
          showToast={showToast}
          onSave={(banner, isEdit) => {
            if (isEdit) {
              setBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
            } else {
              setBanners((prev) => [banner, ...prev]);
            }
          }}
        />
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className={`fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-zinc-900/40 backdrop-blur-sm transition-all ${isClosingDelete ? 'animate-out fade-out duration-300 ease-in' : 'animate-in fade-in duration-300 ease-out'}`}>
          <div className="absolute inset-0" onClick={() => !isDeleting && closeDeleteModal()} />
          
          <div className={`relative w-full max-w-md bg-white border border-zinc-200 rounded-lg flex flex-col shadow-xl transition-all ${isClosingDelete ? 'animate-out zoom-out-95 fade-out duration-300 ease-in' : 'animate-in zoom-in-95 fade-in duration-300 ease-out'}`}>
            <div className="p-5 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-red-600" />
              </div>
              <div className="pt-1">
                <h3 className="text-base font-medium text-zinc-900">Delete Banner</h3>
                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">
                  Are you sure you want to delete this banner? This action cannot be undone and will immediately remove it from your store.
                </p>
              </div>
            </div>

            <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3 rounded-b-lg">
              <button 
                onClick={closeDeleteModal} 
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete} 
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}