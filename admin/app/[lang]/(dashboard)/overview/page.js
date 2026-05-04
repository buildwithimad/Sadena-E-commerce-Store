import OverviewClient from './OverviewClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// ✅ Helper: Format date to local YYYY-MM-DD or YYYY-MM without UTC shifting
function getLocalKey(date, isMonthly) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return isMonthly ? `${y}-${m}` : `${y}-${m}-${d}`;
}

export default async function OverviewHome({ params, searchParams }) {
  const { lang = 'en' } = await params;
  const range = (await searchParams)?.range || '30d';

  // 1. Setup Date Ranges
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let isMonthly = false;

  if (range === '7d') startDate.setDate(today.getDate() - 6);
  else if (range === '30d') startDate.setDate(today.getDate() - 29);
  else if (range === 'this_month') startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  else if (range === 'last_month') {
    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    endDate = new Date(today.getFullYear(), today.getMonth(), 0);
  }
  else if (range === '6m') {
    startDate.setMonth(today.getMonth() - 5);
    startDate.setDate(1);
    isMonthly = true;
  }
  else if (range === 'this_year') {
    startDate = new Date(today.getFullYear(), 0, 1);
    isMonthly = true;
  }
  else if (range === 'last_year') {
    startDate = new Date(today.getFullYear() - 1, 0, 1);
    endDate = new Date(today.getFullYear() - 1, 11, 31);
    isMonthly = true;
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // 2. Fetch Data
  const [productsCount, categoriesCount, ordersData, lowStockProducts, recentOrders] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*').gte('created_at', startDate.toISOString()).lte('created_at', endDate.toISOString()),
    supabaseAdmin.from('products').select('*').lt('stock', 10),
    supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(6)
  ]);

  const filteredOrders = ordersData?.data || [];
  
  // 3. Stats
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount ?? o.total ?? 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // 4. Generate Chart Data with Gap Filling
  const chartDataMap = {};
  let current = new Date(startDate);

  while (current <= endDate) {
    const key = getLocalKey(current, isMonthly);
    chartDataMap[key] = { date: key, revenue: 0, orders: 0 };
    if (isMonthly) current.setMonth(current.getMonth() + 1);
    else current.setDate(current.getDate() + 1);
  }

  filteredOrders.forEach(order => {
    const d = new Date(order.created_at);
    const key = getLocalKey(d, isMonthly);
    if (chartDataMap[key]) {
      chartDataMap[key].revenue += Number(order.total_amount ?? order.total ?? 0);
      chartDataMap[key].orders += 1;
    }
  });

  const chartData = Object.values(chartDataMap).sort((a, b) => a.date.localeCompare(b.date));

  // 5. Build Final Object
  const dashboardData = {
    stats: {
      totalProducts: productsCount?.count || 0,
      totalCategories: categoriesCount?.count || 0,
      totalOrders,
      totalRevenue,
      avgOrderValue
    },
    chartData,
    statusCounts: filteredOrders.reduce((acc, o) => {
      const s = o.status?.toLowerCase() || 'placed';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {}),
    products: {
      lowStock: lowStockProducts?.data || [],
      outOfStock: lowStockProducts?.data?.filter(p => p.stock === 0) || []
    },
    orders: { recent: recentOrders?.data || [] }
  };

  return <OverviewClient lang={lang} dashboardData={dashboardData} currentRange={range} />;
}