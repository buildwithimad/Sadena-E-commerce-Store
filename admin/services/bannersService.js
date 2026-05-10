import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getBanners() {
  const { data, error } = await supabaseAdmin
    .from("banners")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Banners Error:", error);
    return [];
  }

  return data || [];
}