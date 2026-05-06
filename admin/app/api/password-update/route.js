import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    // 1. Verify the requester is a logged-in Admin
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newPassword, confirmPassword } = await req.json();

    // 2. Server-side Validation
    if (!newPassword || newPassword.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return Response.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // 3. Update the password using the Admin Auth API
    const { error } = await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: newPassword
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Password Update Error:", err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}