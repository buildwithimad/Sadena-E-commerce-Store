import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth';

export async function DELETE(req) {
  try {
    // 1. Verify identity
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Optional: Clean up profile image from storage before deleting user
    const avatarUrl = adminUser.user_metadata?.avatar_url;
    if (avatarUrl && avatarUrl.includes('/admins/')) {
      const fileName = avatarUrl.split('/admins/')[1];
      if (fileName) {
        await supabaseAdmin.storage.from('admins').remove([fileName]);
      }
    }

    // 3. Delete the user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(adminUser.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Account Deletion Error:", err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}