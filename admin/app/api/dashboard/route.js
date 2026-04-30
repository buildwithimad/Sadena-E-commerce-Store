import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // -----------------------------
    // 🟢 BASIC COUNTS
    // -----------------------------
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
      supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    const totalProducts = productsCount.count || 0
    const totalCategories = categoriesCount.count || 0
    const totalOrders = ordersData.data?.length || 0

    // -----------------------------
    // 💰 REVENUE CALCULATIONS
    // -----------------------------
    const totalRevenue = ordersData.data?.reduce(
      (sum, o) => sum + Number(o.total_amount || 0),
      0
    ) || 0

    const today = new Date().toISOString().split('T')[0]

    const todaySales = ordersData.data?.filter(
      (o) => o.created_at.startsWith(today)
    ).reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0

    const avgOrderValue = totalOrders
      ? totalRevenue / totalOrders
      : 0

    // -----------------------------
    // 📊 SALES CHART
    // -----------------------------
    const salesMap = {}

    ordersData.data?.forEach((order) => {
      const date = order.created_at.split('T')[0]
      salesMap[date] = (salesMap[date] || 0) + Number(order.total_amount || 0)
    })

    const salesChart = Object.entries(salesMap).map(([date, total]) => ({
      date,
      total
    }))

    // -----------------------------
    // 📦 PRODUCT INSIGHTS
    // -----------------------------
    const outOfStock = lowStockProducts.data?.filter(p => p.stock === 0) || []

    // -----------------------------
    // 📦 RESPONSE
    // -----------------------------
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
    })

  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}