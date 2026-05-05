'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import CategoryModal from '@/components/Category/AddModal';
import DeleteCategoryModal from '@/components/Category/DeleteModal';

export default function CategoriesClient({ lang = 'en', categories = [] }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  // Translations
  const t = {
    en: { 
      title: 'Categories', 
      subtitle: 'Manage and organize your product categories.',
      add: 'New Category', 
      search: 'Search categories...', 
      empty: 'No categories found.',
      table: { category: 'Category Info', arabicName: 'Arabic Content', action: 'Actions' }
    },
    ar: { 
      title: 'الأقسام', 
      subtitle: 'إدارة وتنظيم أقسام المنتجات الخاصة بك.',
      add: 'قسم جديد', 
      search: 'البحث في الأقسام...', 
      empty: 'لا توجد أقسام.',
      table: { category: 'معلومات القسم', arabicName: 'المحتوى العربي', action: 'إجراءات' }
    }
  }[lang];

  // Search Filter
  const filteredCategories = categories.filter(c => 
    c.label?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.label_ar?.includes(searchQuery)
  );

  // Handle Save (Create or Update)
  const handleSaveCategory = async (formData) => {
    try {
      setIsLoading(true);
      const isEdit = !!categoryToEdit;
      const url = isEdit ? `/api/categories/${categoryToEdit.id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to save category');
      }

      setIsModalOpen(false);
      setCategoryToEdit(null);
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteCategory = async (id) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE', credentials: 'include' });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to delete category');
      }

      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  return (
    <div dir={dir} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out text-gray-800 pb-12">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">{t.title}</h1>
          <p className="text-[15px] text-gray-500">{t.subtitle}</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="inline-flex items-center justify-center cursor-pointer gap-2 bg-[#21c45d] text-white px-5 py-2.5 text-sm font-semibold rounded-xl hover:bg-[#1eb053] transition-all duration-300 active:scale-95 shadow-sm shadow-[#21c45d]/20"
        >
          <Icon name="PlusIcon" size={18} strokeWidth={2.5} />
          {t.add}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 focus-within:border-[#21c45d] focus-within:ring-1 focus-within:ring-[#21c45d] transition-all duration-300 group shadow-sm">
          <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400 shrink-0 mr-3" />
          <input 
            type="text" 
            placeholder={t.search} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-900 placeholder:text-gray-400 font-medium" 
          />
        </div>
      </div>

      {/* MODERN E-COMMERCE TABLE */}
      <div className="relative bg-white border border-gray-100 rounded-[20px] shadow-sm flex flex-col pt-2">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className={`text-[13px] font-semibold text-gray-900 border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-6 py-4">{t.table.category}</th>
                <th className="px-6 py-4">{t.table.arabicName}</th>
                <th className="px-6 py-4 text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="bg-white hover:bg-gray-50/50 transition-colors duration-200 group">
                    
                    {/* Column 1: Image & English Details */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden bg-gray-50">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.label} className="w-full h-full object-cover mix-blend-multiply" />
                          ) : (
                            <Icon name="PhotoIcon" size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-900 leading-tight truncate max-w-[300px] text-[14px] mb-0.5">
                            {cat.label}
                          </p>
                          <p className="text-[12px] text-gray-400 font-medium truncate max-w-[300px]">
                            {cat.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Arabic Details */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col" dir="rtl">
                        <p className="font-semibold text-gray-900 text-[14px] mb-0.5">
                          {cat.label_ar || '-'}
                        </p>
                        <p className="text-[12px] text-gray-400 font-medium truncate max-w-[300px]">
                          {cat.description_ar || '-'}
                        </p>
                      </div>
                    </td>

                    {/* Column 3: Actions */}
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => openEditModal(cat)} 
                          className="p-2 text-gray-400 cursor-pointer bg-white border border-gray-200 hover:text-[#21c45d] hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 outline-none flex items-center justify-center"
                        >
                          <Icon name="PencilSquareIcon" size={16} />
                        </button>
                        <button 
                          onClick={() => { setCategoryToDelete(cat); setIsDeleteModalOpen(true); }} 
                          className="p-2 text-gray-400 cursor-pointer bg-white border border-gray-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all duration-200 outline-none"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center text-gray-500 bg-white font-medium text-[15px]">{t.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE INSIDE TABLE (Explicit fallback check) */}
        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-b-[20px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Icon name="FolderOpenIcon" size={32} className="text-gray-300" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">{t.empty}</h3>
            <p className="text-xs text-gray-500 max-w-xs font-normal">
              We couldn't find any categories matching your search.
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveCategory}
        category={categoryToEdit}
        lang={lang}
        isLoading={isLoading}
        bucketName="categories"
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setCategoryToDelete(null); }}
        onConfirm={handleDeleteCategory}
        category={categoryToDelete}
        lang={lang}
        isLoading={isDeleting}
      />

    </div>
  );
}