import { supabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * 🧠 Translation helper
 */
function t(en, ar, lang) {
  return lang === 'ar' ? ar || en : en
}

/**
 * 📦 Get All Categories
 */
export async function getCategories(lang = 'en') {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getCategories error:', error)
    return []
  }

  return data.map((c) => ({
    ...c,
    label: t(c.label, c.label_ar, lang),
    description: t(c.description, c.description_ar, lang)
  }))
}
