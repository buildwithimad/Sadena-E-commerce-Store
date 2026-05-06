import AdminsClient from './AdminClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 0; 

export default async function AdminsPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  // Fetch all users from Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error("Error fetching admins:", error);
  }

  // Filter for role 'admin' and format for the client
  const safeAdmins = data?.users
    ?.filter(user => user?.user_metadata?.role === 'admin')
    ?.map((user) => ({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || user.email.split('@')[0],
      last_name: user.user_metadata?.last_name || '',
      avatar: user.user_metadata?.avatar_url || null,
      created_at: user.created_at,
      role: 'admin'
    })) || [];

  return <AdminsClient lang={lang} initialAdmins={safeAdmins} />;
}