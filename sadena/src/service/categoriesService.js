import { createClient } from '@/lib/supabaseServer';

export async function getCategories() {
  const supabase = await createClient();

  // Fetch BOTH languages always. This prevents caching bugs in Next.js
  // and allows the frontend to switch instantly.
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id,
      slug,
      label,
      label_ar,
      created_at
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Categories fetch error:', error);
    return [];
  }

  // Return the data exactly as the Navbar expects it
  return (data || []).map((c) => ({
    id: c.id,
    slug: c.slug,
    label: c.label || 'Unknown',
    label_ar: c.label_ar || c.label || 'Unknown', // Fallback to English if Arabic is missing
    
    // We keep 'name' here just in case any other part of your app relies on it!
    name: c.label 
  }));
}