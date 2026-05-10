import { notFound } from 'next/navigation';
import { getBlogBySlug } from '@/service/blogService';
import PublicBlogDetailsClient from './ArticleClientDetails';

export const revalidate = 60; // Optional: ISR cache for 60 seconds

export default async function PublicBlogDetailsPage({ params }) {
  // 👉 1. AWAIT THE PARAMS HERE (Next.js 16 Requirement)
  const { lang, slug } = await params;

  // 2. Fetch full details from service
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound(); // Triggers Next.js 404 page if blog doesn't exist
  }

  return <PublicBlogDetailsClient lang={lang} blog={blog} />;
}