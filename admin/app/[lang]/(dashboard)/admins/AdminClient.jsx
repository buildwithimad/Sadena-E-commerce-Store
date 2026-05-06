'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { uploadImages } from '@/lib/uploadImage';

export default function AdminsClient({ lang = 'en', initialAdmins = [] }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [admins, setAdmins] = useState(initialAdmins);
  const [activeModal, setActiveModal] = useState(null); 
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // View Mode State: 'list' or 'grid'
  const [viewMode, setViewMode] = useState('list');

  // Animation States for smooth modals
  const [renderModal, setRenderModal] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const t = {
    en: {
      title: 'Administrators', search: 'Search admins...', add: 'Add Admin',
      empty: 'No administrators found.', role: 'Admin',
      table: { admin: 'Admin', role: 'Role', joined: 'Joined', actions: 'Actions' },
      modals: {
        addTitle: 'Add New Admin', viewTitle: 'Admin Details', deleteTitle: 'Remove Admin',
        name: 'First Name', lastName: 'Last Name', email: 'Email Address', password: 'Temporary Password',
        cancel: 'Cancel', save: 'Create Admin', delete: 'Remove',
        deleteMsg: 'Are you sure you want to remove', joined: 'Joined Date', status: 'Status', active: 'Active',
        uploadTxt: 'Profile Picture', uploadSub: 'Optional (PNG, JPG)'
      }
    },
    ar: {
      title: 'المسؤولين', search: 'البحث عن مسؤول...', add: 'إضافة مسؤول',
      empty: 'لم يتم العثور على مسؤولين.', role: 'مسؤول',
      table: { admin: 'المسؤول', role: 'الدور', joined: 'تاريخ الانضمام', actions: 'إجراءات' },
      modals: {
        addTitle: 'إضافة مسؤول جديد', viewTitle: 'تفاصيل المسؤول', deleteTitle: 'حذف المسؤول',
        name: 'الاسم الأول', lastName: 'اسم العائلة', email: 'البريد الإلكتروني', password: 'كلمة مرور مؤقتة',
        cancel: 'إلغاء', save: 'إنشاء حساب', delete: 'حذف',
        deleteMsg: 'هل أنت متأكد أنك تريد حذف', joined: 'تاريخ الانضمام', status: 'الحالة', active: 'نشط',
        uploadTxt: 'الصورة الشخصية', uploadSub: 'اختياري (PNG, JPG)'
      }
    }
  }[lang];

  // Logic to handle smooth mounting/unmounting
  useEffect(() => {
    if (activeModal) {
      setRenderModal(true);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setShowContent(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRenderModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [activeModal]);

  const filteredAdmins = admins.filter(admin => 
    (admin.first_name + ' ' + (admin.last_name || '')).toLowerCase().includes(searchQuery.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', password: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const openModal = (type, admin = null) => {
    setSelectedAdmin(admin);
    setActiveModal(type);
    setImagePreview('');
    setImageFile(null);
    setApiError(null);
    if (type === 'add') setFormData({ first_name: '', last_name: '', email: '', password: '' });
  };

  const closeModal = () => {
    if (isLoading) return;
    setActiveModal(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);

    try {
      let avatarUrl = null;
      if (imageFile) {
        const urls = await uploadImages([imageFile], 'admins');
        avatarUrl = urls[0];
      }

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, avatar_url: avatarUrl })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed');

      setAdmins([{ 
        id: result.user.id, 
        email: result.user.email, 
        first_name: formData.first_name, 
        last_name: formData.last_name, 
        avatar: avatarUrl,
        created_at: result.user.created_at, 
        role: 'admin' 
      }, ...admins]);
      closeModal();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/${selectedAdmin.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setAdmins(admins.filter(a => a.id !== selectedAdmin.id));
      closeModal();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-900 focus:bg-white focus:outline-none focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d] transition-all duration-200 placeholder:text-gray-400";
  const labelClass = "block text-[11px] font-bold uppercase tracking-[0.1em] text-gray-500 mb-2";

  return (
    <div dir={dir} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 text-gray-900">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ecfdf3] text-[#21c45d] border border-[#21c45d]/10 flex items-center justify-center shrink-0">
            <Icon name="UsersIcon" size={24} variant="outline" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t.title}</h1>
            <p className="text-[13px] font-medium text-gray-500 mt-0.5">
              {lang === 'ar' ? 'إدارة حسابات المسؤولين والصلاحيات' : 'Manage administrator accounts and roles'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex bg-gray-50 border border-gray-200 rounded-xl p-1 shrink-0">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center outline-none ${viewMode === 'list' ? 'bg-white shadow-sm text-[#21c45d] border border-gray-100' : 'text-gray-400 hover:text-gray-900'}`}
              aria-label="List View"
            >
              <Icon name="ListBulletIcon" size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center outline-none ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#21c45d] border border-gray-100' : 'text-gray-400 hover:text-gray-900'}`}
              aria-label="Grid View"
            >
              <Icon name="Squares2X2Icon" size={18} />
            </button>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full sm:w-72 hover:border-gray-300 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all duration-200 shadow-sm">
            <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 mr-2 rtl:ml-2 rtl:mr-0 shrink-0" />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="bg-transparent border-none outline-none text-[13px] w-full text-gray-900 placeholder:text-gray-400 font-medium" 
            />
          </div>
          <button 
            onClick={() => openModal('add')} 
            className="w-full sm:w-auto flex cursor-pointer items-center justify-center gap-2 bg-[#21c45d] text-white px-6 py-2.5 text-[13px] font-bold tracking-widest uppercase rounded-xl hover:bg-[#1eb053] transition-all active:scale-95 shadow-sm shadow-[#21c45d]/20 outline-none"
          >
            <Icon name="PlusIcon" size={16} strokeWidth={2.5} /> {t.add}
          </button>
        </div>
      </div>

      {/* ADMINS DATA */}
      {filteredAdmins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center mb-4">
            <Icon name="UsersIcon" size={32} className="text-gray-300" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{t.empty}</h3>
        </div>
      ) : (
        <>
          {/* ---- LIST VIEW ---- */}
          {viewMode === 'list' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-300">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className={`bg-gray-50/50 text-[11px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <tr>
                      <th className="px-6 py-4">{t.table.admin}</th>
                      <th className="px-6 py-4">{t.table.role}</th>
                      <th className="px-6 py-4">{t.table.joined}</th>
                      <th className="px-6 py-4 text-center">{t.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y divide-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors duration-200 group bg-white">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                              {admin.avatar ? (
                                <img src={admin.avatar} className="w-full h-full object-cover" alt={`${admin.first_name} avatar`} />
                              ) : (
                                <span className="text-[14px] font-bold text-gray-400">{admin.first_name?.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-bold text-gray-900 leading-tight">
                                {admin.first_name} {admin.last_name}
                              </span>
                              <span className="text-[12px] font-medium text-gray-500 mt-0.5">{admin.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-[#21c45d]/20 bg-[#ecfdf3] text-[#21c45d]">
                            {t.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] font-medium text-gray-600" dir="ltr">
                            {new Date(admin.created_at).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                            <button 
                              onClick={() => openModal('view', admin)} 
                              className="p-2 cursor-pointer text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all outline-none"
                            >
                              <Icon name="EyeIcon" size={16} />
                            </button>
                            <button 
                              onClick={() => openModal('delete', admin)} 
                              className="p-2 cursor-pointer text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all outline-none"
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
            </div>
          )}

          {/* ---- GRID VIEW ---- */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-300">
              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col relative group transition-all duration-300 hover:border-gray-300 hover:shadow-sm">
                  <div className="absolute top-5 right-5 rtl:left-5 rtl:right-auto">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-[#21c45d]/20 bg-[#ecfdf3] text-[#21c45d]">
                      {t.role}
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center mt-2 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {admin.avatar ? (
                        <img src={admin.avatar} className="w-full h-full object-cover" alt={`${admin.first_name} avatar`} />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">{admin.first_name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0 w-full px-2">
                      <h3 className="text-[15px] font-bold truncate text-gray-900">{admin.first_name} {admin.last_name}</h3>
                      <p className="text-[12px] font-medium text-gray-500 truncate mt-1">{admin.email}</p>
                    </div>
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-5 border-t border-gray-100">
                    <button 
                      onClick={() => openModal('view', admin)} 
                      className="flex items-center justify-center gap-1.5 py-2 cursor-pointer text-[11px] font-bold uppercase tracking-wider text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors outline-none"
                    >
                      <Icon name="EyeIcon" size={14} /> View
                    </button>
                    <button 
                      onClick={() => openModal('delete', admin)} 
                      className="flex items-center justify-center gap-1.5 cursor-pointer py-2 text-[11px] font-bold uppercase tracking-wider text-red-500 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors outline-none"
                    >
                      <Icon name="TrashIcon" size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* MODALS WRAPPER */}
      {renderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`} 
            onClick={closeModal} 
          />

          {/* --- ADD MODAL --- */}
          {activeModal === 'add' && (
            <div className={`relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl flex flex-col shadow-2xl overflow-hidden transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
              
              {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
                  <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                    <Icon name="ArrowPathIcon" size={18} className="animate-spin text-[#21c45d]" />
                    <span className="text-[12px] font-bold uppercase tracking-widest text-gray-900">{lang === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</span>
                  </div>
                </div>
              )}

              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ecfdf3] text-[#21c45d] flex items-center justify-center border border-[#21c45d]/10">
                    <Icon name="UserPlusIcon" size={18} variant="outline" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.modals.addTitle}</h2>
                </div>
                <button onClick={closeModal} className="p-2 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all outline-none">
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[75vh] no-scrollbar">
                {apiError && (
                  <div className="p-3 bg-red-50 text-red-600 text-[12px] font-bold border border-red-100 rounded-xl flex items-center gap-2">
                    <Icon name="ExclamationTriangleIcon" size={16} /> {apiError}
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div onClick={() => fileInputRef.current?.click()} className="relative w-16 h-16 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#21c45d] transition-colors flex items-center justify-center cursor-pointer overflow-hidden group">
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <Icon name="CameraIcon" size={20} className="text-gray-400 group-hover:text-[#21c45d] transition-colors" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">{t.modals.uploadTxt}</p>
                    <p className="text-[11px] font-medium text-gray-500 mt-0.5">{t.modals.uploadSub}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{t.modals.name} *</label>
                    <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t.modals.lastName}</label>
                    <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t.modals.email} *</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} dir="ltr" />
                </div>
                <div>
                  <label className={labelClass}>{t.modals.password} *</label>
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={inputClass} dir="ltr" minLength={6} />
                </div>
                
                <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors outline-none">
                    {t.modals.cancel}
                  </button>
                  <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white bg-[#21c45d] rounded-xl hover:bg-[#1eb053] transition-colors disabled:opacity-50 shadow-sm shadow-[#21c45d]/20 outline-none">
                    {t.modals.save}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- VIEW MODAL --- */}
          {activeModal === 'view' && selectedAdmin && (
            <div className={`relative w-full max-w-sm bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-gray-900">{t.modals.viewTitle}</h2>
                <button onClick={closeModal} className="p-2 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all outline-none">
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
              <div className="p-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center text-3xl font-bold text-gray-400 mb-5 shadow-sm">
                  {selectedAdmin.avatar ? (
                    <img src={selectedAdmin.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span>{selectedAdmin.first_name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedAdmin.first_name} {selectedAdmin.last_name}</h2>
                <p className="text-[13px] font-medium text-gray-500 mb-8">{selectedAdmin.email}</p>
                
                <div className="w-full space-y-4 bg-gray-50 border border-gray-100 p-5 rounded-xl">
                  <div className="flex justify-between items-center text-[12px] font-bold">
                    <span className="text-gray-500 uppercase tracking-widest">{t.modals.status}</span>
                    <span className="text-[#21c45d]">{t.modals.active}</span>
                  </div>
                  <div className="h-px w-full bg-gray-200" />
                  <div className="flex justify-between items-center text-[12px] font-bold">
                    <span className="text-gray-500 uppercase tracking-widest">{t.modals.joined}</span>
                    <span className="text-gray-900" dir="ltr">{new Date(selectedAdmin.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100">
                <button onClick={closeModal} className="w-full py-2.5 text-[12px] font-bold uppercase tracking-wider text-gray-700 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors outline-none shadow-sm">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* --- DELETE MODAL --- */}
          {activeModal === 'delete' && selectedAdmin && (
            <div className={`relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
              
              {isLoading && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
                  <div className="bg-white px-5 py-3 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                    <Icon name="ArrowPathIcon" size={18} className="animate-spin text-red-500" />
                    <span className="text-[12px] font-bold uppercase tracking-widest text-gray-900">Deleting...</span>
                  </div>
                </div>
              )}

              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-gray-900">{t.modals.deleteTitle}</h2>
                <button onClick={closeModal} disabled={isLoading} className="p-2 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all outline-none">
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center text-center">
                {apiError && (
                  <div className="w-full mb-5 p-3 bg-red-50 text-red-600 text-[12px] font-bold border border-red-100 rounded-xl flex items-center justify-center gap-2">
                    <Icon name="ExclamationTriangleIcon" size={16} /> {apiError}
                  </div>
                )}
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5 border-[6px] border-red-50/50">
                  <Icon name="ExclamationTriangleIcon" size={24} className="text-red-500" />
                </div>
                <p className="text-[15px] font-bold text-gray-900 mb-2">
                  {t.modals.deleteMsg} <span className="text-red-500" dir="ltr">"{selectedAdmin.first_name}"</span>?
                </p>
                <p className="text-[13px] text-gray-500 font-medium leading-relaxed max-w-[90%]">
                  {t.modals.deleteWarning}
                </p>
              </div>

              <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button onClick={closeModal} disabled={isLoading} className="px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-gray-600 bg-white border border-gray-200 cursor-pointer rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 outline-none">
                  {t.modals.cancel}
                </button>
                <button onClick={handleDeleteConfirm} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white bg-red-500 cursor-pointer rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-500/20 disabled:opacity-50 outline-none">
                  <Icon name="TrashIcon" size={14} /> {t.modals.delete}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}