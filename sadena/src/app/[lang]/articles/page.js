import { getPublishedBlogs } from '@/service/blogService';
import PublicBlogsClient from './ArticleClient';

export const revalidate = 60; // Optional: ISR cache for 60 seconds

export default async function PublicBlogsPage({ params: { lang }, searchParams }) {
  const page = parseInt(searchParams.page || '1', 10);
  
  // Fetch from service (Limit is strictly 12)
  const { blogs, totalPages } = await getPublishedBlogs(page, 12);

  return (
    <PublicBlogsClient 
      lang={lang} 
      blogs={blogs} 
      currentPage={page} 
      totalPages={totalPages} 
    />
  );
}