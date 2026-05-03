import { createClient } from '@/lib/supabaseServer';

export async function getUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return data?.user || null;
}