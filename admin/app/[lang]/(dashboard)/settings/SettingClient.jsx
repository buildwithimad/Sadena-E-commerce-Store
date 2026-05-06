'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabaseClient'; // ✅ Import your browser client

export default function SettingsClient({ lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  // UI States
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 

  // Animation States for smooth modal
  const [renderModal, setRenderModal] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const t = {
    en: {
      title: 'Settings',
      subtitle: 'Manage your account security and preferences.',
      security: 'Security Settings',
      passwordSub: 'Change your password to keep your account safe.',
      currentPass: 'Current Password',
      newPass: 'New Password',
      confirmPass: 'Confirm New Password',
      updateBtn: 'Update Password',
      dangerZone: 'Danger Zone',
      deleteTitle: 'Delete Account',
      deleteDesc: 'Once you delete your account, all your data will be permanently removed.',
      deleteBtn: 'Delete Account',
      modals: {
        deleteTitle: 'Permanently Remove Account?',
        deleteWarning: 'This action is irreversible. You will lose access to the admin dashboard immediately.',
        cancel: 'Cancel',
        confirm: 'Confirm Deletion',
      },
      errors: {
        match: 'Passwords do not match.',
        short: 'Password must be at least 6 characters.',
        generic: 'An error occurred. Please try again.'
      }
    },
    ar: {
      title: 'الإعدادات',
      subtitle: 'إدارة أمان حسابك وتفضيلاتك.',
      security: 'إعدادات الأمان',
      passwordSub: 'قم بتغيير كلمة المرور الخاصة بك للحفاظ على أمان حسابك.',
      currentPass: 'كلمة المرور الحالية',
      newPass: 'كلمة المرور الجديدة',
      confirmPass: 'تأكيد كلمة المرور الجديدة',
      updateBtn: 'تحديث كلمة المرور',
      dangerZone: 'منطقة الخطر',
      deleteTitle: 'حذف الحساب',
      deleteDesc: 'بمجرد حذف حسابك، سيتم إزالة جميع البيانات بشكل دائم.',
      deleteBtn: 'حذف الحساب',
      modals: {
        deleteTitle: 'حذف الحساب نهائياً؟',
        deleteWarning: 'هذا الإجراء لا يمكن التراجع عنه. ستفقد إمكانية الوصول إلى لوحة التحكم فوراً.',
        cancel: 'إلغاء',
        confirm: 'تأكيد الحذف',
      },
      errors: {
        match: 'كلمات المرور غير متطابقة.',
        short: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.',
        generic: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'
      }
    }
  }[lang];

  // Handle smooth mounting/unmounting of modal
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

  // ✅ SECURE PASSWORD UPDATE
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMsg(null);

    if (passwordData.newPassword.length < 6) {
      setApiError(t.errors.short);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setApiError(t.errors.match);
      return;
    }

    setLoading(true);
    try {
      // Get session for the token
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/password-update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}` // 🔥 Verify identity
        },
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || t.errors.generic);

      setSuccessMsg(lang === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SECURE ACCOUNT DELETION
  const handleDeleteAccount = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session?.access_token}` // 🔥 Verify identity
        }
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || t.errors.generic);

      // Sign out on client and redirect
      await supabase.auth.signOut();
      router.refresh();
      router.push(`/${lang}`); // Redirect to your auth page
      
    } catch (err) {
      setApiError(err.message);
      setActiveModal(null);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-[#21c45d] focus:ring-[#21c45d]/20 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:bg-white focus:ring-2 transition-all duration-200 placeholder:text-gray-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2";

  return (
    <div dir={dir} className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 text-gray-900">
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#ecfdf3] text-[#21c45d] border border-[#21c45d]/10 flex items-center justify-center shrink-0">
          <Icon name="Cog8ToothIcon" size={24} variant="outline" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t.title}</h1>
          <p className="text-[13px] font-medium text-gray-500 mt-0.5">{t.subtitle}</p>
        </div>
      </div>

      {apiError && <div className="p-4 bg-red-50 text-red-600 text-[13px] font-bold border border-red-100 rounded-xl flex items-center gap-3"><Icon name="ExclamationTriangleIcon" size={18} /> {apiError}</div>}
      {successMsg && <div className="p-4 bg-green-50 text-[#21c45d] text-[13px] font-bold border border-green-100 rounded-xl flex items-center gap-3"><Icon name="CheckCircleIcon" size={18} /> {successMsg}</div>}

      <div className="space-y-6">
        
        <div className="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{t.security}</h3>
            <p className="text-xs text-gray-500 mt-1">{t.passwordSub}</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 max-w-md">
                <label className={labelClass}>{t.currentPass}</label>
                <input required type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className={inputClass} />
              </div>
              <div className="max-w-md">
                <label className={labelClass}>{t.newPass}</label>
                <input required type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className={inputClass} />
              </div>
              <div className="max-w-md">
                <label className={labelClass}>{t.confirmPass}</label>
                <input required type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className={inputClass} />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="px-8 py-3 bg-[#21c45d] text-white text-[13px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#1eb053] transition-all active:scale-95 disabled:opacity-50 outline-none shadow-sm shadow-[#21c45d]/20 flex items-center gap-2 cursor-pointer">
                {loading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
                {t.updateBtn}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white border border-red-100 rounded-[20px] overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-red-50 bg-red-50/30">
            <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest">{t.dangerZone}</h3>
          </div>
          <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-bold text-gray-900">{t.deleteTitle}</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-md">{t.deleteDesc}</p>
            </div>
            <button onClick={() => setActiveModal('delete')} className="px-6 py-3 border border-red-100 text-red-500 bg-white text-[12px] font-bold uppercase tracking-wider rounded-xl hover:bg-red-50 transition-all outline-none cursor-pointer">
              {t.deleteBtn}
            </button>
          </div>
        </div>
      </div>

      {renderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`} onClick={() => !loading && setActiveModal(null)} />
          <div className={`relative w-full max-w-md bg-white border border-gray-100 rounded-[20px] flex flex-col overflow-hidden shadow-2xl transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">{t.modals.deleteTitle}</h2>
              <button onClick={() => setActiveModal(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all outline-none">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6 border border-red-100">
                <Icon name="ExclamationTriangleIcon" size={32} className="text-red-500" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{t.modals.deleteWarning}</p>
            </div>

            <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button onClick={() => setActiveModal(null)} className="flex-1 py-3 text-[12px] font-bold uppercase text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all outline-none cursor-pointer">
                {t.modals.cancel}
              </button>
              <button onClick={handleDeleteAccount} disabled={loading} className="flex-1 py-3 text-[12px] font-bold uppercase text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 shadow-sm shadow-red-500/20 outline-none cursor-pointer">
                {loading ? <Icon name="ArrowPathIcon" size={16} className="animate-spin" /> : t.modals.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}