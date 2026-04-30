'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function WarehouseClient({ lang = 'en', warehouses = [] }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  // --- States ---
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // null = Create, object = Edit/Delete
  
  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Translations ---
  const t = {
    en: { 
      title: 'Warehouses', add: 'New Warehouse', search: 'Search warehouses...', empty: 'No warehouses found.',
      table: { name: 'Warehouse Name', location: 'Location', action: 'Actions' },
      modal: {
        addTitle: 'Add New Warehouse', editTitle: 'Edit Warehouse',
        name: 'Warehouse Name', loc: 'Location',
        reqName: 'Name is required', cancel: 'Cancel', save: 'Save Changes', create: 'Create Warehouse'
      },
      delModal: {
        title: 'Delete Warehouse', message: 'Are you sure you want to delete', 
        warning: 'This action cannot be undone. Make sure no stock is exclusively tied to this warehouse before deleting.', 
        cancel: 'Cancel', delete: 'Delete'
      }
    },
    ar: { 
      title: 'المستودعات', add: 'مستودع جديد', search: 'البحث في المستودعات...', empty: 'لا توجد مستودعات.',
      table: { name: 'اسم المستودع', location: 'الموقع', action: 'إجراءات' },
      modal: {
        addTitle: 'إضافة مستودع جديد', editTitle: 'تعديل المستودع',
        name: 'اسم المستودع', loc: 'الموقع',
        reqName: 'الاسم مطلوب', cancel: 'إلغاء', save: 'حفظ', create: 'إنشاء'
      },
      delModal: {
        title: 'حذف المستودع', message: 'هل أنت متأكد أنك تريد حذف', 
        warning: 'لا يمكن التراجع عن هذا الإجراء. تأكد من عدم وجود مخزون مرتبط حصرياً بهذا المستودع قبل الحذف.', 
        cancel: 'إلغاء', delete: 'حذف'
      }
    }
  }[lang];

  // --- Filter ---
  const filteredWarehouses = warehouses.filter(w => 
    w.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---
  const openCreateModal = () => {
    setSelectedWarehouse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const openDeleteModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteModalOpen(true);
  };

  // --- RENDER ---
  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pb-12">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">{t.title}</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2.5 w-full sm:w-72 hover:bg-gray-50 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-200">
            <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 mr-2 rtl:ml-2 rtl:mr-0 shrink-0" />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400 font-medium" 
            />
          </div>

          <button 
            onClick={openCreateModal} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95 shadow-sm shadow-green-600/20"
          >
            <Icon name="PlusIcon" size={16} strokeWidth={2.5} />
            {t.add}
          </button>
        </div>
      </div>

      {/* MODERN E-COMMERCE TABLE */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className={`text-[11px] uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-6 py-4 font-bold w-1/2">{t.table.name}</th>
                <th className="px-6 py-4 font-bold w-1/3">{t.table.location}</th>
                <th className="px-6 py-4 font-bold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWarehouses.map((warehouse) => (
                <tr key={warehouse.id} className="hover:bg-gray-50 transition-all duration-200 group bg-white">
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 bg-gray-50">
                        <Icon name="BuildingStorefrontIcon" size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                          {warehouse.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                      <Icon name="MapPinIcon" size={16} className="text-gray-400" />
                      {warehouse.location || '-'}
                    </p>
                  </td>

                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => openEditModal(warehouse)} 
                        className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50 rounded-lg transition-all duration-200 outline-none"
                      >
                        <Icon name="PencilSquareIcon" size={16} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(warehouse)} 
                        className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all duration-200 outline-none"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWarehouses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border-t border-gray-200">
            <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-5">
              <Icon name="BuildingStorefrontIcon" size={28} className="text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{t.empty}</h3>
          </div>
        )}
      </div>

      {/* --- INLINE MODALS --- */}
      <WarehouseFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        warehouse={selectedWarehouse} 
        lang={lang} 
        t={t.modal}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        router={router}
      />

      <WarehouseDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        warehouse={selectedWarehouse} 
        lang={lang} 
        t={t.delModal}
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        router={router}
      />

    </div>
  );
}

// ==========================================
// 1. ADD / EDIT MODAL COMPONENT
// ==========================================
function WarehouseFormModal({ isOpen, onClose, warehouse, lang, t, isLoading, setIsLoading, router }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isEdit = !!warehouse;
  
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setFormData(warehouse || { name: '', location: '' });
      setError('');
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, warehouse]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      setError(t.reqName);
      return;
    }

    try {
      setIsLoading(true);
      const url = isEdit ? `/api/warehouses/${warehouse.id}` : '/api/warehouses';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to save warehouse');
      }

      onClose();
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (err) => `w-full bg-white border ${err ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:bg-gray-50 focus:border-green-500 focus:ring-green-500/10'} rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200`;
  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity" onClick={!isLoading ? onClose : undefined} />
      <div className="relative bg-white rounded-lg border border-gray-200 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEdit ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
              <Icon name={isEdit ? "PencilSquareIcon" : "BuildingStorefrontIcon"} size={16} />
            </div>
            <h2 className="text-base font-bold text-gray-900">{isEdit ? t.editTitle : t.addTitle}</h2>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none disabled:opacity-50">
            <Icon name="XMarkIcon" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className={labelClass}>{t.name} *</label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass(error)} />
            {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
          </div>
          <div>
            <label className={labelClass}>{t.loc}</label>
            <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className={inputClass()} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end bg-gray-50 rounded-b-lg gap-2">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50">{t.cancel}</button>
          <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 text-xs font-bold tracking-widest uppercase text-white bg-gray-900 rounded-lg hover:bg-black transition-all duration-200 disabled:opacity-50 shadow-sm">
            {isLoading && <Icon name="ArrowPathIcon" size={14} className="animate-spin" />}
            {isEdit ? t.save : t.create}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. DELETE MODAL COMPONENT
// ==========================================
function WarehouseDeleteModal({ isOpen, onClose, warehouse, lang, t, isDeleting, setIsDeleting, router }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !warehouse) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/warehouses/${warehouse.id}`, { method: 'DELETE', credentials: 'include' });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to delete warehouse');
      }

      onClose();
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={!isDeleting ? onClose : undefined} />
      <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.title}</h2>
          <button onClick={onClose} disabled={isDeleting} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors outline-none disabled:opacity-50">
            <Icon name="XMarkIcon" size={18} />
          </button>
        </div>
        <div className="px-6 py-6">
          <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center mb-4 border border-rose-100">
            <Icon name="ExclamationTriangleIcon" size={20} className="text-rose-600" />
          </div>
          <p className="text-gray-900 font-medium mb-1">{t.message} <span className="font-bold">"{warehouse.name}"</span>?</p>
          <p className="text-sm text-gray-500 leading-relaxed">{t.warning}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button onClick={onClose} disabled={isDeleting} className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50">{t.cancel}</button>
          <button onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-2 px-6 py-2 text-xs font-bold tracking-widest uppercase text-white bg-rose-600 border border-rose-600 rounded-lg hover:bg-rose-700 transition-all duration-200 disabled:opacity-50 shadow-sm">
            {isDeleting ? <Icon name="ArrowPathIcon" size={14} className="animate-spin" /> : null} 
            {t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}