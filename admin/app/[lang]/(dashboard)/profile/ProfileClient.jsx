'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient';
import { uploadImages } from '@/lib/uploadImage';

export default function ProfileClient({ lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  // User Auth State
  const [user, setUser] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({ first_name: '', last_name: '', avatar: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Image Upload State
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const t = {
    en: {
      title: 'My Profile', subtitle: 'View and manage your personal information and account details.',
      role: 'Admin', edit: 'Edit Profile', save: 'Save Changes', cancel: 'Cancel',
      firstName: 'First Name', lastName: 'Last Name', email: 'Email Address',
      emailHelp: 'Email cannot be changed directly for security reasons.',
      success: 'Profile updated successfully!', uploadImg: 'Change Picture',
      accountInfo: 'Account Information', personalInfo: 'Personal Information',
      memberSince: 'Member Since', status: 'Account Status', active: 'Active'
    },
    ar: {
      title: 'ملفي الشخصي', subtitle: 'عرض وإدارة معلوماتك الشخصية وتفاصيل الحساب.',
      role: 'مسؤول', edit: 'تعديل الملف', save: 'حفظ التغييرات', cancel: 'إلغاء',
      firstName: 'الاسم الأول', lastName: 'اسم العائلة', email: 'البريد الإلكتروني',
      emailHelp: 'لا يمكن تغيير البريد الإلكتروني مباشرة لأسباب أمنية.',
      success: 'تم تحديث الملف الشخصي بنجاح!', uploadImg: 'تغيير الصورة',
      accountInfo: 'معلومات الحساب', personalInfo: 'المعلومات الشخصية',
      memberSince: 'عضو منذ', status: 'حالة الحساب', active: 'نشط'
    }
  }[lang];

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push(`/${lang}`);
        return;
      }
      const avatarUrl = user.user_metadata?.avatar_url || '';
      setUser(user);
      setFormData({
        first_name: user.user_metadata?.first_name || user.email.split('@')[0],
        last_name: user.user_metadata?.last_name || '',
        avatar: avatarUrl
      });
      setImagePreview(avatarUrl);
      setIsPageLoading(false);
    };
    fetchUser();
  }, [lang, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ 
      first_name: user.user_metadata?.first_name || user.email.split('@')[0], 
      last_name: user.user_metadata?.last_name || '', 
      avatar: user.user_metadata?.avatar_url || '' 
    });
    setImagePreview(user.user_metadata?.avatar_url || '');
    setImageFile(null);
    setApiError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);

    try {
      let finalAvatarUrl = formData.avatar;
      if (imageFile) {
        const urls = await uploadImages([imageFile], 'admins');
        finalAvatarUrl = urls[0];
      }
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          avatar_url: finalAvatarUrl
        })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to update profile');

      setFormData({ ...formData, avatar: finalAvatarUrl });
      setImagePreview(finalAvatarUrl);
      setImageFile(null);
      setIsEditing(false);
      setSuccessMsg(t.success);
      setUser({ ...user, user_metadata: { ...user.user_metadata, first_name: formData.first_name, last_name: formData.last_name, avatar_url: finalAvatarUrl }});
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return <div className="flex justify-center py-40"><Icon name="ArrowPathIcon" className="animate-spin text-[#21c45d]" size={32} /></div>;
  }

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#21c45d] focus:ring-1 focus:ring-[#21c45d] transition-all duration-200";
  const labelClass = "text-[11px] font-bold uppercase tracking-widest text-gray-400 w-1/3 sm:w-1/4 shrink-0";
  const valueClass = "text-sm font-medium text-gray-900";

  return (
    <div dir={dir} className="min-h-screen bg-[#f9fafb] text-gray-900 pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-gray-900">{t.title}</h1>
            <p className="text-[15px] text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => { setIsEditing(true); setSuccessMsg(null); }} 
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 text-[13px] font-bold tracking-wider uppercase rounded-lg hover:bg-gray-50 transition-all shadow-sm outline-none cursor-pointer"
            >
              <Icon name="PencilSquareIcon" size={18} strokeWidth={2} /> {t.edit}
            </button>
          )}
        </div>

        {/* FEEDBACK MESSAGES */}
        {apiError && <div className="p-4 bg-red-50 text-red-600 text-[13px] font-bold border border-red-100 rounded-xl flex items-center gap-3"><Icon name="ExclamationTriangleIcon" size={18} /> {apiError}</div>}
        {successMsg && <div className="p-4 bg-green-50 text-[#21c45d] text-[13px] font-bold border border-green-100 rounded-xl flex items-center gap-3"><Icon name="CheckCircleIcon" size={18} /> {successMsg}</div>}

        <div className="bg-white border border-gray-200 rounded-[20px] shadow-sm overflow-hidden">
          
          {/* PROFILE HEADER STRIP - FIXED PADDING & ALIGNMENT */}
          <div className="bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-100 px-8 py-12 flex flex-col sm:flex-row items-center gap-10 relative">
            <div className="relative">
              <div 
                className={`w-32 h-32 rounded-3xl border-4 border-white bg-[#ecfdf3] flex items-center justify-center text-5xl font-bold text-[#21c45d] overflow-hidden shadow-md transition-transform duration-300 ${isEditing ? 'cursor-pointer hover:scale-105' : ''}`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  formData.first_name?.charAt(0).toUpperCase() || 'A'
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="CameraIcon" size={32} />
                  </div>
                )}
              </div>
              
              {/* Camera Icon Overlay - Styled like Image */}
              <button 
                onClick={() => isEditing && fileInputRef.current?.click()}
                className={`absolute bottom-0 right-0 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-lg text-[#21c45d] ${isEditing ? 'opacity-100 translate-x-1 translate-y-1' : 'opacity-0'} transition-all`}
              >
                <Icon name="CameraIcon" size={18} strokeWidth={2.5} />
              </button>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
            </div>

            <div className="text-center sm:text-left rtl:sm:text-right flex-1">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{formData.first_name} {formData.last_name}</h2>
              <p className="text-base font-medium text-gray-500 mb-5">{user.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ecfdf3] text-[#21c45d] text-[11px] font-bold uppercase tracking-[0.15em] rounded-lg border border-[#21c45d]/20">
                <Icon name="ShieldCheckIcon" size={14} variant="solid" />
                {t.role}
              </div>
            </div>
          </div>

          <div className="p-10">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* PERSONAL INFORMATION SECTION */}
              <div className="space-y-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest pb-4 border-b border-gray-100">
                  {t.personalInfo}
                </h3>
                
                <div className="space-y-8">
                  {/* First Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className={labelClass}>{t.firstName}</label>
                    {isEditing ? (
                      <div className="flex-1 max-w-lg">
                        <input required type="text" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className={inputClass} />
                      </div>
                    ) : (
                      <p className={valueClass}>{formData.first_name}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className={labelClass}>{t.lastName}</label>
                    {isEditing ? (
                      <div className="flex-1 max-w-lg">
                        <input type="text" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className={inputClass} />
                      </div>
                    ) : (
                      <p className={valueClass}>{formData.last_name || '—'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className={labelClass}>{t.email}</label>
                    <div className="flex-1">
                      <p className={valueClass} dir="ltr">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACCOUNT INFORMATION SECTION */}
              {!isEditing && (
                <div className="space-y-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest pb-4 border-b border-gray-100">
                    {t.accountInfo}
                  </h3>
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className={labelClass}>{lang === 'ar' ? 'الصلاحية' : 'ROLE'}</label>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ecfdf3] text-[#21c45d] text-[11px] font-bold uppercase rounded-lg border border-[#21c45d]/20 w-fit">
                         <Icon name="ShieldCheckIcon" size={14} variant="solid" />
                         {t.role}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className={labelClass}>{t.memberSince}</label>
                      <div className="flex items-center gap-2 font-medium text-gray-900 text-sm">
                        <Icon name="CalendarIcon" size={16} className="text-gray-400" />
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <label className={labelClass}>{t.status}</label>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 uppercase tracking-widest text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#21c45d] animate-pulse" />
                        {t.active}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* EDIT MODE ACTIONS */}
              {isEditing && (
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    disabled={isLoading} 
                    className="px-10 py-3.5 text-[13px] font-bold uppercase tracking-wider text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all outline-none cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="flex items-center justify-center gap-2 px-10 py-3.5 text-[13px] font-bold uppercase tracking-wider text-white bg-[#21c45d] rounded-xl hover:bg-[#1eb053] transition-all shadow-sm shadow-[#21c45d]/20 outline-none cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <Icon name="ArrowPathIcon" size={18} className="animate-spin" /> : <Icon name="CheckCircleIcon" size={18} variant="solid" />} 
                    {t.save}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}