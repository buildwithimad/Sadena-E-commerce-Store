import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function PUT(req) {
  try {
    // 1. Grab the token sent from the frontend
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return Response.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');

    // 2. Get the currently logged-in user explicitly using their token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 3. Extract the updated data from the request body
    const body = await req.json();
    const { first_name, last_name, avatar_url } = body;

    // 4. --- DELETE OLD IMAGE LOGIC ---
    const oldAvatarUrl = user.user_metadata?.avatar_url;

    if (oldAvatarUrl && oldAvatarUrl !== avatar_url && oldAvatarUrl.startsWith('http')) {
      const parts = oldAvatarUrl.split('/storage/v1/object/public/admins/');
      const fileName = parts[1];
      
      if (fileName) {
        // Remove the old image from the bucket
        const { error: storageError } = await supabaseAdmin
          .storage
          .from('admins')
          .remove([fileName]);
          
        if (storageError) {
          console.error("Failed to delete old profile image:", storageError);
        }
      }
    }

    // 5. Update the user's metadata in Supabase
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        first_name,
        last_name,
        avatar_url,
        role: user.user_metadata?.role || 'admin' // preserve role
      }
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, user: data.user });
  } catch (err) {
    console.error("Profile Update Error:", err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}