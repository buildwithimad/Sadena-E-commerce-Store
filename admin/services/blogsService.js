import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Fetches paginated blogs from the database.
 * @param {number} page - The current page number (starts at 1).
 * @param {number} limit - How many items per page.
 */
export async function fetchBlogs(page = 1, limit = 12) {
  try {
    // Calculate database ranges (0-indexed)
    // Page 1: 0 to 11
    // Page 2: 12 to 23
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: blogs, count, error } = await supabaseAdmin
      .from('blogs')
      .select('*', { count: 'exact' }) // 👉 Also fetch total number of records
      .order('created_at', { ascending: false })
      .range(from, to); // 👉 Apply pagination limit

    if (error) {
      console.error("Database error fetching blogs:", error.message);
      return { blogs: [], count: 0 };
    }

    return { blogs: blogs || [], count: count || 0 };
  } catch (error) {
    console.error("Unexpected error fetching blogs:", error);
    return { blogs: [], count: 0 };
  }
}