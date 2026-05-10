import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    // ==========================================
    // 1. THE GATEKEEPER
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const body = await req.json();

    // ==========================================
    // 2. VALIDATION
    // ==========================================
    if (!body.title || !body.content) {
      return Response.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // ==========================================
    // 3. GENERATE UNIQUE SLUG
    // ==========================================
    let slug = body.title
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, '') // Supports Arabic & English
      .replace(/\s+/g, '-')
      .toLowerCase();

    // Append a short timestamp to guarantee the slug is unique
    slug = `${slug}-${Math.floor(Date.now() / 1000)}`;

    // ==========================================
    // 4. PREPARE & INSERT DATA
    // ==========================================
    const blogData = {
      slug,
      title: body.title,
      title_ar: body.title_ar || null,
      excerpt: body.excerpt || null,
      excerpt_ar: body.excerpt_ar || null,
      content: body.content,
      content_ar: body.content_ar || null,
      image: body.image || null,
      is_published: Boolean(body.is_published),
      author_id: adminUser.id // Locks the current admin as the author
    };

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert([blogData])
      .select()
      .single();

    if (error) {
      console.error('Blog Create Error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });

  } catch (err) {
    console.error('Server Error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}