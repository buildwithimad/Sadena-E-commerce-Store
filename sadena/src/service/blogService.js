import { createClient } from '@/lib/supabaseServer';

export async function getPublishedBlogs(page = 1, limit = 12) {
  // 1. Await the client creation first
  const supabase = await createClient();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 2. Use the instantiated 'supabase' variable
  const { data, count, error } = await supabase
    .from('blogs')
    .select('id, title, title_ar, slug, excerpt, excerpt_ar, image, created_at', { count: 'exact' })
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], totalPages: 1 };
  }

  return { 
    blogs: data, 
    totalPages: Math.ceil((count || 0) / limit) 
  };
}

export async function getBlogBySlug(slug) {
  // 1. Await the client creation here as well
  const supabase = await createClient();
  
  // 2. Replace 'supabaseAdmin' with the 'supabase' instance
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching blog details:', error);
    return null;
  }

  return data;
}