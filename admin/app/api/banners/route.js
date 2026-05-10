import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { checkAdmin } from "@/lib/auth";

// ✅ CREATE
export async function POST(req) {
  const user = await checkAdmin();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Extract new fields
    const { 
      section, 
      image, 
      position = 0, 
      is_active = true,
      title,
      title_ar,
      subtitle,
      subtitle_ar,
      link
    } = body;

    if (!section || !image) {
      return new Response(
        JSON.stringify({ error: "section and image are required" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("banners")
      .insert({
        section,
        image,
        position,
        is_active,
        title,
        title_ar,
        subtitle,
        subtitle_ar,
        link
      })
      .select()
      .single();

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}