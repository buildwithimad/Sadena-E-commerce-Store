import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER (Fail Fast)
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    // ==========================================
    // 2. PARSE BODY & VALIDATE
    // ==========================================
    const body = await req.json();

    if (!body.email || !body.password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // ==========================================
    // 3. EXECUTE ACTION
    // ==========================================
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true, 
      user_metadata: {
        first_name: body.first_name,
        last_name: body.last_name,
        avatar_url: body.avatar_url || null,
        role: 'admin' 
      }
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, user: data.user });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}