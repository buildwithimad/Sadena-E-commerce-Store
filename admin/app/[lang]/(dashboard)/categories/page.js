import CategoriesClient from './CategoriesClient';
import { getCategories } from '@/services/categoriesService';

export const metadata = {
  title: 'Categories | Admin Panel',
};

export default async function CategoriesPage({ params }) {
  const { lang } = await params;
  
  // Fetch Categories
  const categories = await getCategories(lang);

  return <CategoriesClient lang={lang} categories={categories || []} />;
}