import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth';

// 🟡 UPDATE BLOG
export async function PUT(req, { params }) {
  try {
    // 1. THE GATEKEEPER
    const adminUser = await checkAdmin();
    if (!adminUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!id) return Response.json({ error: 'Missing blog id' }, { status: 400 });

    const body = await req.json();
    
    if (!body.title || !body.content) {
      return Response.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // 2. GET OLD BLOG (To compare images for deletion)
    const { data: oldBlog } = await supabaseAdmin
      .from('blogs')
      .select('image')
      .eq('id', id)
      .single();

    // 3. STORAGE CLEANUP (If image was changed/removed)
    const oldImage = oldBlog?.image;
    const newImage = body.image || null;

    if (oldImage && oldImage !== newImage && oldImage.startsWith('http')) {
      const parts = oldImage.split('/storage/v1/object/public/blogs/');
      const fileName = parts[1];
      if (fileName) {
        await supabaseAdmin.storage.from('blogs').remove([fileName]);
      }
    }

    // 4. UPDATE DATABASE
    // We do NOT update the slug here to preserve SEO links.
    // We also do NOT update the author_id so the original creator is preserved.
    const updateData = {
      title: body.title,
      title_ar: body.title_ar || null,
      excerpt: body.excerpt || null,
      excerpt_ar: body.excerpt_ar || null,
      content: body.content,
      content_ar: body.content_ar || null,
      image: newImage,
      is_published: Boolean(body.is_published)
    };

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, data });

  } catch (err) {
    console.error('Blog Update Error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🔴 DELETE BLOG
export async function DELETE(req, { params }) {
  try {
    // 1. THE GATEKEEPER
    const adminUser = await checkAdmin();
    if (!adminUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!id) return Response.json({ error: 'Missing blog id' }, { status: 400 });

    // 2. FETCH EXISTING IMAGE
    const { data: blog, error: fetchError } = await supabaseAdmin
      .from('blogs')
      .select('image')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 3. DELETE IMAGE FROM STORAGE
    if (blog?.image && blog.image.startsWith('http')) {
      const parts = blog.image.split('/storage/v1/object/public/blogs/');
      const fileName = parts[1];
      if (fileName) {
        await supabaseAdmin.storage.from('blogs').remove([fileName]);
      }
    }

    // 4. DELETE DATABASE RECORD
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, message: 'Blog deleted' });

  } catch (err) {
    console.error('Blog Delete Error:', err);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}