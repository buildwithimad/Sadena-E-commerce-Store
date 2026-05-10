import { createClient } from '@/lib/supabaseServer';

export async function getBanners(lang = 'en') {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Banners Error:', error);
    return [];
  }

  return (data || []).map(b => ({
    ...b,
    title: lang === 'ar' ? b.title_ar : b.title,
    subtitle: lang === 'ar' ? b.subtitle_ar : b.subtitle,
  }));
}