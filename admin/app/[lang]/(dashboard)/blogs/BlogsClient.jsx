'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import BlogModal from './BlogModal';

export default function BlogsClient({ lang = 'en', initialBlogs = [], currentPage = 1, totalPages = 1 }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  // Data & Filter States
  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // UI States
  const [view, setView] = useState('list');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modals States
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'delete', 'view'
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    setBlogs(initialBlogs);
  }, [initialBlogs]);

  const t = {
    en: {
      title: 'Blogs', subtitle: 'Manage your blog posts',
      add: 'New Blog', search: 'Search blogs...',
      grid: 'Grid', list: 'List', status: 'Status', date: 'Date', actions: 'Actions',
      published: 'Published', draft: 'Draft',
      filters: { allStatuses: 'Filter by status', newest: 'Sort by: Newest', oldest: 'Sort by: Oldest' },
      pagination: { prev: 'Previous', next: 'Next', page: 'Page', of: 'of' }, 
      modals: {
        viewTitle: 'Blog Preview', deleteTitle: 'Delete Blog?', 
        deleteWarning: 'Are you sure you want to delete this blog?',
        cancel: 'Cancel', delete: 'Confirm Delete'
      }
    },
    ar: {
      title: 'المدونات', subtitle: 'إدارة مقالات المدونة الخاصة بك',
      add: 'مدونة جديدة', search: 'البحث في المدونات...',
      grid: 'شبكة', list: 'قائمة', status: 'الحالة', date: 'التاريخ', actions: 'إجراءات',
      published: 'منشور', draft: 'مسودة',
      filters: { allStatuses: 'حسب الحالة', newest: 'ترتيب: الأحدث', oldest: 'ترتيب: الأقدم' },
      pagination: { prev: 'السابق', next: 'التالي', page: 'صفحة', of: 'من' }, 
      modals: {
        viewTitle: 'معاينة المدونة', deleteTitle: 'حذف المدونة؟', 
        deleteWarning: 'هل أنت متأكد أنك تريد حذف هذه المدونة؟',
        cancel: 'إلغاء', delete: 'تأكيد الحذف'
      }
    }
  }[lang];

  const handleBlogModalSuccess = (savedBlog, method) => {
    if (method === 'POST') {
      setBlogs([savedBlog, ...blogs].slice(0, 12)); 
    } else {
      setBlogs(blogs.map(b => b.id === savedBlog.id ? savedBlog : b));
    }
    setIsBlogModalOpen(false);
    setSelectedBlog(null);
    router.refresh();
  };

  const openBlogModal = (blog = null) => {
    setSelectedBlog(blog);
    setIsBlogModalOpen(true);
  };

  const openActionModal = (type, blog) => {
    setSelectedBlog(blog);
    setActiveModal(type);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blogs/${selectedBlog.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setBlogs(blogs.filter(b => b.id !== selectedBlog.id));
      setActiveModal(null);
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 👉 UPDATED LOGIC: Search, Filter, and Sort combined
  const processedBlogs = blogs
    .filter(b => {
      // 1. Search Filter
      const matchesSearch = b.title?.toLowerCase().includes(search.toLowerCase()) || b.title_ar?.includes(search);
      
      // 2. Status Filter
      const matchesStatus = statusFilter === 'all' 
        ? true 
        : statusFilter === 'published' 
          ? b.is_published 
          : !b.is_published;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 3. Sort Logic
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const handlePageChange = (newPage) => {
    router.push(`/${lang}/blogs?page=${newPage}`);
  };

  return (
    <div dir={dir} className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 text-gray-900 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        <button onClick={() => openBlogModal(null)} className="px-4 py-2 bg-[#21c45d] text-white text-sm font-medium rounded-md hover:bg-[#1eb053] transition-all flex items-center gap-2 shadow-sm">
          <Icon name="PlusIcon" size={16} /> {t.add}
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Icon name="MagnifyingGlassIcon" size={16} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 rtl:left-auto rtl:right-3" />
          <input 
            type="text" placeholder={t.search} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-md pl-9 rtl:pl-3 rtl:pr-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#21c45d] focus:border-[#21c45d] placeholder:text-gray-400 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          
          {/* Status Filter */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-within:ring-1 focus-within:ring-[#21c45d] focus-within:border-[#21c45d] transition-all group">
            <div className={`absolute pointer-events-none flex items-center ${dir === 'rtl' ? 'right-3' : 'left-3'}`}>
              <Icon name="FunnelIcon" size={14} className="text-gray-500" />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full bg-transparent border-none appearance-none outline-none cursor-pointer py-2 ${dir === 'rtl' ? 'pr-9 pl-8' : 'pl-9 pr-8'} z-10`}
            >
              <option value="all">{t.filters.allStatuses}</option>
              <option value="published">{t.published}</option>
              <option value="draft">{t.draft}</option>
            </select>
            <div className={`absolute pointer-events-none flex items-center ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
              <Icon name="ChevronDownIcon" size={14} className="text-gray-500 group-hover:text-gray-700" />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="relative flex items-center bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus-within:ring-1 focus-within:ring-[#21c45d] focus-within:border-[#21c45d] transition-all group">
            <div className={`absolute pointer-events-none flex items-center ${dir === 'rtl' ? 'right-3' : 'left-3'}`}>
              <Icon name="ArrowsUpDownIcon" size={14} className="text-gray-500" />
            </div>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={`w-full bg-transparent border-none appearance-none outline-none cursor-pointer py-2 ${dir === 'rtl' ? 'pr-9 pl-8' : 'pl-9 pr-8'} z-10`}
            >
              <option value="newest">{t.filters.newest}</option>
              <option value="oldest">{t.filters.oldest}</option>
            </select>
            <div className={`absolute pointer-events-none flex items-center ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
              <Icon name="ChevronDownIcon" size={14} className="text-gray-500 group-hover:text-gray-700" />
            </div>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-white border border-gray-200 rounded-md p-0.5 shadow-sm hidden sm:flex">
            <button onClick={() => setView('grid')} className={`p-1.5 rounded-[4px] ${view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon name="Squares2X2Icon" size={16} />
            </button>
            <button onClick={() => setView('list')} className={`p-1.5 rounded-[4px] ${view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icon name="Bars3Icon" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* VIEWS */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedBlogs.map((blog) => (
            <div key={blog.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300"><Icon name="PhotoIcon" size={48} /></div>
                )}
                <div className={`absolute top-3 ${dir === 'rtl' ? 'right-3' : 'left-3'} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-md border ${blog.is_published ? 'bg-[#ecfdf3] text-[#027a48] border-[#ecfdf3]' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {blog.is_published ? t.published : t.draft}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{lang === 'ar' && blog.title_ar ? blog.title_ar : blog.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex-1">{lang === 'ar' && blog.excerpt_ar ? blog.excerpt_ar : blog.excerpt}</p>
                <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100">
                  <button onClick={() => openActionModal('view', blog)} className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors flex items-center justify-center gap-1.5"><Icon name="EyeIcon" size={14} /> View</button>
                  <button onClick={() => openBlogModal(blog)} className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors flex items-center justify-center gap-1.5"><Icon name="PencilSquareIcon" size={14} /> Edit</button>
                  <button onClick={() => openActionModal('delete', blog)} className="py-1.5 px-3 text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 rounded-md transition-colors flex items-center justify-center"><Icon name="TrashIcon" size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right border-collapse min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-6 py-4">Blog</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {processedBlogs.length > 0 ? processedBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-[60px] rounded-md bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                          {blog.image ? (
                            <img src={blog.image} className="w-full h-full object-cover" alt="Cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Icon name="PhotoIcon" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="font-semibold text-sm text-gray-900 line-clamp-1 max-w-[400px]">
                            {lang === 'ar' && blog.title_ar ? blog.title_ar : blog.title}
                          </span>
                          <span className="text-sm text-gray-500 line-clamp-1 max-w-[400px] mt-0.5">
                            {lang === 'ar' && blog.excerpt_ar ? blog.excerpt_ar : blog.excerpt || blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md ${
                        blog.is_published 
                          ? 'bg-[#ecfdf3] text-[#027a48]' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {blog.is_published ? t.published : t.draft}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>{new Date(blog.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{new Date(blog.created_at).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openActionModal('view', blog)} className="p-1.5 text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-100 rounded-md transition-all">
                          <Icon name="EyeIcon" size={16} />
                        </button>
                        <button onClick={() => openBlogModal(blog)} className="p-1.5 text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-100 rounded-md transition-all">
                          <Icon name="PencilSquareIcon" size={16} />
                        </button>
                        <button onClick={() => openActionModal('delete', blog)} className="p-1.5 text-red-500 hover:text-red-700 border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-md transition-all">
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      No blogs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION (BOTTOM OF TABLE) */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {t.pagination.page} <span className="font-semibold text-gray-900">{currentPage}</span> {t.pagination.of} <span className="font-semibold text-gray-900">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <Icon name="ChevronLeftIcon" size={14} /> {t.pagination.prev}
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  {t.pagination.next} <Icon name="ChevronRightIcon" size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER THE SEPARATED BLOG ADD/EDIT MODAL */}
      <BlogModal 
        isOpen={isBlogModalOpen} 
        onClose={() => setIsBlogModalOpen(false)} 
        onSuccess={handleBlogModalSuccess}
        blog={selectedBlog} 
        lang={lang} 
      />

      {/* RENDER VIEW/DELETE MODALS (Inline for simplicity of separation) */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isLoading && setActiveModal(null)} />
          <div className={`relative w-full ${activeModal === 'delete' ? 'max-w-md' : 'max-w-3xl'} max-h-[90vh] bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden shadow-xl animate-in zoom-in-95 duration-200`}>
            
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {activeModal === 'view' ? t.modals.viewTitle : t.modals.deleteTitle}
              </h2>
              <button onClick={() => setActiveModal(null)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all outline-none">
                <Icon name="XMarkIcon" size={20} />
              </button>
            </div>

            {/* DELETE CONTENT */}
            {activeModal === 'delete' && (
              <>
                <div className="p-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5 border border-red-100">
                    <Icon name="ExclamationTriangleIcon" size={28} className="text-red-500" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{t.modals.deleteWarning}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all">{t.modals.cancel}</button>
                  <button onClick={handleDelete} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-sm">
                    {isLoading && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />} {t.modals.delete}
                  </button>
                </div>
              </>
            )}

            {/* VIEW CONTENT */}
            {activeModal === 'view' && selectedBlog && (
              <div className="overflow-y-auto p-6 space-y-6">
                {selectedBlog.image && <img src={selectedBlog.image} className="w-full h-64 object-cover rounded-lg border border-gray-200" />}
                <div className="flex items-center gap-3">
                  <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md ${selectedBlog.is_published ? 'bg-[#ecfdf3] text-[#027a48]' : 'bg-gray-100 text-gray-600'}`}>
                    {selectedBlog.is_published ? t.published : t.draft}
                  </span>
                  <span className="text-sm text-gray-500">{new Date(selectedBlog.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{lang === 'ar' && selectedBlog.title_ar ? selectedBlog.title_ar : selectedBlog.title}</h1>
                  <p className="text-base text-gray-600 font-medium">{lang === 'ar' && selectedBlog.excerpt_ar ? selectedBlog.excerpt_ar : selectedBlog.excerpt}</p>
                </div>
                
                {/* Notice dangerouslySetInnerHTML used here to render the React Quill HTML output properly */}
                <div 
                  className="prose max-w-none text-gray-700 text-sm whitespace-pre-wrap pt-4 border-t border-gray-100"
                  dangerouslySetInnerHTML={{ __html: lang === 'ar' && selectedBlog.content_ar ? selectedBlog.content_ar : selectedBlog.content }} 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}