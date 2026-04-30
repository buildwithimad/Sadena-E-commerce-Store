import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getWarehouses() {
  const { data, error } = await supabaseAdmin
    .from('warehouses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getWarehouses error:', error)
    return []
  }

  return data
}