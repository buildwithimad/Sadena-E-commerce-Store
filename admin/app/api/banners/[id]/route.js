import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { checkAdmin } from "@/lib/auth";

// 🧹 HELPER: Extract path from URL and delete from Supabase Storage
async function deleteOldImage(imageUrl) {
  if (!imageUrl || !imageUrl.includes('/public/banners/')) return;

  try {
    const filePath = imageUrl.split('/public/banners/')[1];
    
    if (filePath) {
      const { error } = await supabaseAdmin.storage
        .from("banners")
        .remove([filePath]);

      if (error) console.error("Failed to delete old image:", error.message);
    }
  } catch (err) {
    console.error("Error parsing image URL for deletion:", err);
  }
}

// ✅ UPDATE
export async function PUT(req, { params }) {
  const user = await checkAdmin();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // Extract new fields
    const { 
      section, 
      image, 
      position, 
      is_active,
      title,
      title_ar,
      subtitle,
      subtitle_ar,
      link 
    } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });
    }

    const { data: existingBanner, error: fetchError } = await supabaseAdmin
      .from("banners")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (existingBanner.image && existingBanner.image !== image) {
      await deleteOldImage(existingBanner.image);
    }

    const { data, error: updateError } = await supabaseAdmin
      .from("banners")
      .update({ 
        section, 
        image, 
        position, 
        is_active,
        title,
        title_ar,
        subtitle,
        subtitle_ar,
         
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return Response.json({ success: true, data });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req, { params }) {
  const user = await checkAdmin();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), { status: 400 });
    }

    const { data: existingBanner, error: fetchError } = await supabaseAdmin
      .from("banners")
      .select("image")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    if (existingBanner.image) {
      await deleteOldImage(existingBanner.image);
    }

    const { error: deleteError } = await supabaseAdmin
      .from("banners")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return Response.json({ success: true });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}