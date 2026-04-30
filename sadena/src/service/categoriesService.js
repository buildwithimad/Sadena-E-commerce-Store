import { createClient } from '@/lib/supabaseServer';

export async function getCategories({ lang = 'en' } = {}) {
  const supabase = await createClient();

  const nameField = lang === 'ar' ? 'label_ar' : 'label';

  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      slug,
      ${nameField},
      created_at
    `)
    .order('created_at', { ascending: true });


  if (error) {
    console.error('Categories fetch error:', error);
    return [];
  }

  return (data || []).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c[nameField],
  }));
}