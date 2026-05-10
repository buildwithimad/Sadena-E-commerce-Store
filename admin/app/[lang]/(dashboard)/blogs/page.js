import BlogsClient from './BlogsClient';
import { fetchBlogs } from '@/services/blogsService';

export const revalidate = 0;

export const metadata = {
  title: 'Blogs Management | Sadena Admin',
};

export default async function BlogsPage({ params, searchParams }) {
  const { lang } = await params;
  
  // 👉 1. Get the current page from the URL (Default to 1)
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const limit = 12;

  // 👉 2. Fetch the paginated data and the total count
  const { blogs, count } = await fetchBlogs(currentPage, limit);
  
  // 👉 3. Calculate total pages
  const totalPages = Math.ceil(count / limit) || 1;

  return (
    <div className="min-h-screen bg-white">
      <BlogsClient 
        lang={lang} 
        initialBlogs={blogs} 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />
    </div>
  );
}