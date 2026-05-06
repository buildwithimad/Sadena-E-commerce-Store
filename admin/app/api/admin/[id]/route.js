import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth';

export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'User ID is required' }, { status: 400 });
  }


  // ==========================================
  // 1. THE GATEKEEPER (Now just 2 lines!)
  // ==========================================
  const adminUser = await checkAdmin();
  if (!adminUser) {
    return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
  }

  console.log("admin user from api", adminUser)

  // Safety check: Prevent admin from deleting themselves
  if (adminUser.id === id) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // 1. Fetch user to get the avatar URL before deleting them
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(id);

    if (!userError && userData?.user?.user_metadata?.avatar_url) {
      const avatarUrl = userData.user.user_metadata.avatar_url;

      // Extract the file path from the URL. 
      // Supabase URLs usually look like: .../storage/v1/object/public/admins/filename.jpg
      const filePathMatch = avatarUrl.split('/admins/');
      
      if (filePathMatch.length > 1) {
        const filePath = filePathMatch[1];

        // 2. Delete the image from the 'admins' bucket
        const { error: storageError } = await supabaseAdmin
          .storage
          .from('admins')
          .remove([filePath]);

        if (storageError) {
          console.error("Failed to delete admin image from storage:", storageError);
          // We just log this error but continue, so the user still gets deleted even if the image delete fails
        }
      }
    }

    // 3. Delete user from Supabase Auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}