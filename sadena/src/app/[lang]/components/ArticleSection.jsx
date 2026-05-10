import Link from 'next/link';

export default function BlogSection({ lang, t, blogs = [] }) {
  if (!blogs || blogs.length === 0) return null;

  const title = lang === 'ar' ? 'نصائح الجمال من سادينا' : 'Beauty Tips from Sadina';
  const subtitle = lang === 'ar' 
    ? 'تعلمي كيفية العناية ببشرتك واختيار ما يناسبك' 
    : 'Learn how to care for your skin and choose what suits you best';
  const readMore = lang === 'ar' ? 'اقرأ المزيد' : 'Read More';

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="group bg-white border border-gray-100 rounded-[24px] overflow-hidden hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300 flex flex-col">
            <Link href={`/${lang}/blogs/${blog.slug}`} className="block aspect-[16/10] overflow-hidden bg-gray-50">
              {blog.image && (
                <img 
                  src={blog.image} 
                  alt={lang === 'ar' ? blog.title_ar : blog.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                {new Date(blog.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {lang === 'ar' ? blog.title_ar : blog.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-3 flex-1">
                {lang === 'ar' ? blog.excerpt_ar : blog.excerpt}
              </p>
              <Link 
                href={`/${lang}/blogs/${blog.slug}`}
                className="text-[#21c45d] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                {readMore} 
                <span className="rtl:rotate-180">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}