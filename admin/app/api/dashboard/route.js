import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { checkAdmin } from '@/lib/auth'; // ✅ Import your gatekeeper

export async function GET() {
  try {
    // ==========================================
    // 1. THE GATEKEEPER
    // ==========================================
    const adminUser = await checkAdmin();
    if (!adminUser) {
      return Response.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    // ==========================================
    // 2. FETCH DATA (Using Promise.all for speed)
    // ==========================================
    const [
      productsCount,
      categoriesCount,
      ordersData,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*'),
      supabaseAdmin.from('products').select('*').lt('stock', 10),
      supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(6)
    ]);

    const totalProducts = productsCount.count || 0;
    const totalCategories = categoriesCount.count || 0;
    const totalOrders = ordersData.data?.length || 0;

    // ==========================================
    // 3. REVENUE CALCULATIONS
    // ==========================================
    const totalRevenue = ordersData.data?.reduce(
      (sum, o) => sum + Number(o.total_amount || o.total || 0),
      0
    ) || 0;

    const today = new Date().toISOString().split('T')[0];

    const todaySales = ordersData.data?.filter(
      (o) => o.created_at.startsWith(today)
    ).reduce((sum, o) => sum + Number(o.total_amount || o.total || 0), 0) || 0;

    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    // ==========================================
    // 4. SALES CHART LOGIC
    // ==========================================
    const salesMap = {};

    ordersData.data?.forEach((order) => {
      const date = order.created_at.split('T')[0];
      salesMap[date] = (salesMap[date] || 0) + Number(order.total_amount || order.total || 0);
    });

    const salesChart = Object.entries(salesMap)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // ==========================================
    // 5. PRODUCT INSIGHTS
    // ==========================================
    const outOfStock = lowStockProducts.data?.filter(p => p.stock === 0) || [];

    // ==========================================
    // 6. RESPONSE
    // ==========================================
    return Response.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue,
        todaySales,
        avgOrderValue
      },
      salesChart,
      products: {
        lowStock: lowStockProducts.data || [],
        outOfStock
      },
      orders: {
        recent: recentOrders.data || []
      }
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}