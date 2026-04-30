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
      title: 'Categories', add: 'New Category', search: 'Search categories...', empty: 'No categories found.',
      table: { category: 'Category Info', arabicName: 'Arabic Content', action: 'Actions' }
    },
    ar: { 
      title: 'الأقسام', add: 'قسم جديد', search: 'البحث في الأقسام...', empty: 'لا توجد أقسام.',
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
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pb-12">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">{t.title}</h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Borderless Search Pill */}
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

          {/* Primary Action */}
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
                <th className="px-6 py-4 font-bold w-1/2">{t.table.category}</th>
                <th className="px-6 py-4 font-bold w-1/3">{t.table.arabicName}</th>
                <th className="px-6 py-4 font-bold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-all duration-200 group bg-white">
                  
                  {/* Column 1: Image & English Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      {/* Crisp Thumbnail */}
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden bg-gray-50 p-1">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.label} className="w-full h-full object-cover rounded-md" />
                        ) : (
                          <Icon name="PhotoIcon" size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="mt-0.5">
                        <p className="text-base font-medium text-gray-900 group-hover:text-green-600 transition-colors leading-tight" dir="ltr">
                          {cat.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed max-w-md" dir="ltr">
                          {cat.description || <span className="italic opacity-50">No description...</span>}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Arabic Details */}
                  <td className="px-6 py-4 align-top">
                    <div className="mt-0.5">
                      <p className="text-sm font-medium text-gray-900 leading-tight" dir="rtl">
                        {cat.label_ar || '-'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed max-w-sm" dir="rtl">
                        {cat.description_ar || '-'}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Actions (Fade in on hover) */}
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => openEditModal(cat)} 
                        className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50 rounded-lg transition-all duration-200 outline-none"
                      >
                        <Icon name="PencilSquareIcon" size={16} />
                      </button>
                      <button 
                        onClick={() => { setCategoryToDelete(cat); setIsDeleteModalOpen(true); }} 
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

        {/* EMPTY STATE INSIDE TABLE */}
        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border-t border-gray-200">
            <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-5">
              <Icon name="FolderOpenIcon" size={28} className="text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{t.empty}</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              We couldn't find any categories. Try adjusting your search or add a new one.
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