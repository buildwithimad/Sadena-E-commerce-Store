'use client';

import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function PublicBlogDetailsClient({ lang = 'en', blog }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const t = {
    en: { 
      back: 'Back to Articles',
      readTime: 'min read',
      writtenBy: 'Editorial Team',
      share: 'Share this article'
    },
    ar: { 
      back: 'العودة للمقالات',
      readTime: 'دقائق للقراءة',
      writtenBy: 'فريق التحرير',
      share: 'شارك هذا المقال'
    }
  }[lang];

  const title = lang === 'ar' && blog.title_ar ? blog.title_ar : blog.title;
  const content = lang === 'ar' && blog.content_ar ? blog.content_ar : blog.content;
  const date = new Date(blog.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const plainText = content.replace(/<[^>]*>?/gm, ''); 
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article dir={dir} className="min-h-screen bg-white pb-24 font-sans overflow-x-hidden w-full selection:bg-[#21c45d]/20 selection:text-gray-900">
      
      {/* Hero Header Section */}
      <header className="bg-gradient-to-b from-gray-50 to-white pt-10 sm:pt-16 pb-24 sm:pb-32 border-b border-gray-100 w-full relative">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Link 
            href={`/${lang}/blogs`} 
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#21c45d] transition-colors mb-8 sm:mb-12 group"
          >
            <Icon name={dir === 'rtl' ? "ArrowRightIcon" : "ArrowLeftIcon"} size={16} className="mr-2 rtl:mr-0 rtl:ml-2 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
            {t.back}
          </Link>

          {/* Meta Tags */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-gray-500 mb-6">
            <span className="px-2.5 py-0.5 bg-[#21c45d]/10 text-[#21c45d] rounded-full uppercase tracking-wider text-[10px] sm:text-xs font-bold">
              {lang === 'ar' ? 'مقال' : 'Article'}
            </span>
            <div className="flex items-center gap-1.5">
              <Icon name="CalendarIcon" size={14} className="sm:w-4 sm:h-4" />
              <time>{date}</time>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
            <div className="flex items-center gap-1.5">
              <Icon name="ClockIcon" size={14} className="sm:w-4 sm:h-4" />
              <span>{readingTime} {t.readTime}</span>
            </div>
          </div>

          {/* Main Title - Responsive sizing adjusted */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight sm:leading-[1.15] mb-8 sm:mb-10 break-words">
            {title}
          </h1>

          {/* Author Row */}
          <div className="flex items-center gap-4 border-t border-gray-200 pt-6 mt-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#21c45d] to-emerald-300 flex items-center justify-center text-white shadow-md shrink-0">
              <Icon name="UserIcon" size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-900">{t.writtenBy}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Sadena Store</p>
            </div>
          </div>

        </div>
      </header>

      {/* Featured Image */}
      {blog.image && (
        <figure className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20 mb-12 sm:mb-16">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50 border-4 border-white bg-gray-100 relative group">
            <img 
              src={blog.image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl sm:rounded-2xl pointer-events-none"></div>
          </div>
        </figure>
      )}

      {/* Main Content Body */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 mt-8 sm:mt-16">
        <div 
          className="
            prose prose-base sm:prose-lg md:prose-xl max-w-none w-full break-words
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
            
            /* Responsive H2 */
            prose-h2:text-xl sm:prose-h2:text-3xl prose-h2:mt-12 sm:prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-4
            
            /* Responsive H3 */
            prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:mt-8 sm:prose-h3:mt-10 prose-h3:mb-4
            
            prose-p:text-gray-600 text-sm md:text-md prose-p:leading-[1.7] sm:prose-p:leading-[1.8] prose-p:mb-6 sm:prose-p:mb-8
            prose-a:text-[#21c45d] hover:prose-a:text-[#1eb053] prose-a:font-medium prose-a:underline prose-a:underline-offset-4
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-ul:text-gray-600 prose-ol:text-gray-600 prose-ul:mb-8 prose-ol:mb-8
            prose-li:marker:text-[#21c45d] prose-li:mb-2
            prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8 sm:prose-img:my-12
            prose-blockquote:border-s-4 prose-blockquote:border-[#21c45d] prose-blockquote:bg-gray-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:text-gray-700 prose-blockquote:italic prose-blockquote:my-8 sm:prose-blockquote:my-10
            [&_p]:whitespace-pre-line
          "
          dangerouslySetInnerHTML={{ __html: content }} 
        />
        
        {/* Footer / Sharing Row */}
        <footer className="mt-16 sm:mt-20 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-bold text-gray-900">{t.share}</p>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:bg-[#21c45d] hover:text-white transition-all flex items-center justify-center border border-gray-200 hover:border-transparent">
              <Icon name="LinkIcon" size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-gray-200 hover:border-transparent">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:bg-blue-800 hover:text-white transition-all flex items-center justify-center border border-gray-200 hover:border-transparent">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>
          </div>
        </footer>

      </div>
    </article>
  );
}