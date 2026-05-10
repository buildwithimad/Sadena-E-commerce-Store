'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

export default function PublicBlogsClient({ lang = 'en', blogs = [], currentPage = 1, totalPages = 1 }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();

  const t = {
    en: {
      title: 'Our Latest Articles',
      subtitle: 'Insights, news, and tips from our experts.',
      readMore: 'Read Article',
      prev: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      empty: 'No articles published yet.'
    },
    ar: {
      title: 'أحدث مقالاتنا',
      subtitle: 'رؤى وأخبار ونصائح من خبرائنا.',
      readMore: 'اقرأ المقال',
      prev: 'السابق',
      next: 'التالي',
      page: 'صفحة',
      of: 'من',
      empty: 'لم يتم نشر أي مقالات بعد.'
    }
  }[lang];

  const handlePageChange = (newPage) => {
    router.push(`/${lang}/blogs?page=${newPage}`);
  };

  return (
    <div dir={dir} className="min-h-screen bg-[#f9fafb] py-16 px-4 sm:px-6 lg:px-8 font-sans mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">{t.subtitle}</p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <Link href={`/${lang}/articles/${blog.slug}`} key={blog.id}>
                <div 
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full animate-in fade-in zoom-in-95"
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden shrink-0">
                    {blog.image ? (
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Icon name="PhotoIcon" size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-[#21c45d] uppercase tracking-wider mb-2 block">
                      {new Date(blog.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#21c45d] transition-colors">
                      {lang === 'ar' && blog.title_ar ? blog.title_ar : blog.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                      {lang === 'ar' && blog.excerpt_ar ? blog.excerpt_ar : blog.excerpt}
                    </p>
                    <div className="flex items-center text-sm font-bold text-[#21c45d]">
                      {t.readMore} <Icon name={dir === 'rtl' ? "ArrowLeftIcon" : "ArrowRightIcon"} size={16} className="ml-2 rtl:ml-0 rtl:mr-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Icon name="DocumentTextIcon" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">{t.empty}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Icon name="ChevronLeftIcon" size={16} /> {t.prev}
            </button>
            <span className="text-sm font-medium text-gray-500">
              {t.page} <span className="font-bold text-gray-900">{currentPage}</span> {t.of} <span className="font-bold text-gray-900">{totalPages}</span>
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {t.next} <Icon name="ChevronRightIcon" size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}