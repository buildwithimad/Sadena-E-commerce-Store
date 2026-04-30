'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function OverviewClient({ lang = 'en', dashboardData = null }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // ------------------------
  // 🎛️ State
  // ------------------------
  const [timeFilter, setTimeFilter] = useState('30d');

  // ------------------------
  // 🌍 Internal Translations
  // ------------------------
  const translations = {
    en: {
      title: 'Dashboard Overview',
      download: 'Download Report',
      filters: { '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 3 Months', '1y': 'This Year' },
      stats: { orders: 'Total Orders', revenue: 'Total Revenue', todaySales: "Today's Sales", products: 'Total Products' },
      charts: { revenue: 'Revenue Trend', status: 'Recent Order Status' },
      recentOrders: { title: 'Recent Orders', viewAll: 'View All', orderId: 'Order ID', customer: 'Customer', date: 'Date', status: 'Status', total: 'Total' },
      inventory: { title: 'Low Stock Alerts', viewInventory: 'Manage Stock', outOfStock: 'Out of Stock', lowStock: 'Low Stock' },
      status: { pending: 'Pending', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled' },
      empty: { chart: 'No data available for this period.', orders: 'No recent orders found.', stock: 'Inventory is healthy.' }
    },
    ar: {
      title: 'نظرة عامة',
      download: 'تحميل التقرير',
      filters: { '7d': 'آخر 7 أيام', '30d': 'آخر 30 يوم', '90d': 'آخر 3 أشهر', '1y': 'هذا العام' },
      stats: { orders: 'إجمالي الطلبات', revenue: 'إجمالي الإيرادات', todaySales: 'مبيعات اليوم', products: 'إجمالي المنتجات' },
      charts: { revenue: 'اتجاه الإيرادات', status: 'حالة الطلبات الأخيرة' },
      recentOrders: { title: 'أحدث الطلبات', viewAll: 'عرض الكل', orderId: 'رقم الطلب', customer: 'العميل', date: 'التاريخ', status: 'الحالة', total: 'الإجمالي' },
      inventory: { title: 'تنبيهات انخفاض المخزون', viewInventory: 'إدارة المخزون', outOfStock: 'نفذت الكمية', lowStock: 'مخزون منخفض' },
      status: { pending: 'قيد الانتظار', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي' },
      empty: { chart: 'لا توجد بيانات متاحة لهذه الفترة.', orders: 'لم يتم العثور على طلبات حديثة.', stock: 'المخزون بحالة جيدة.' }
    }
  };

  const t = translations[lang] || translations.en;

  // ------------------------
  // 🛠️ Formatting Helpers
  // ------------------------
  const formatCurrency = (val) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', { 
      style: 'currency', currency: 'SAR', maximumFractionDigits: 0
    }).format(val || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(date);
  };

  const formatChartDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short', day: 'numeric'
    }).format(date);
  };

  // ------------------------
  // 📊 API Data Extraction
  // ------------------------
  const statsData = dashboardData?.stats || {};
  const rawSalesChart = dashboardData?.salesChart || [];
  const recentOrders = dashboardData?.orders?.recent || [];
  const lowStockProducts = dashboardData?.products?.lowStock || [];
  const outOfStockProducts = dashboardData?.products?.outOfStock || [];

  // Combine low stock & out of stock for the widget
  const inventoryAlerts = [...outOfStockProducts, ...lowStockProducts].slice(0, 5);

  // Mapped Stats
  const stats = [
    { label: t.stats.orders, value: statsData.totalOrders || 0, icon: 'ShoppingBagIcon' },
    { label: t.stats.revenue, value: formatCurrency(statsData.totalRevenue), icon: 'BanknotesIcon' },
    { label: t.stats.todaySales, value: formatCurrency(statsData.todaySales), icon: 'ArrowTrendingUpIcon' },
    { label: t.stats.products, value: statsData.totalProducts || 0, icon: 'CubeIcon' },
  ];

  // Map sales data for Area Chart
  const revenueChartData = rawSalesChart
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(item => ({
      name: formatChartDate(item.date),
      total: item.total
    }));

  // Map status data dynamically from recent orders (since API doesn't aggregate all statuses)
  const statusCounts = recentOrders.reduce((acc, order) => {
    const s = order.status?.toLowerCase() || 'pending';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusColors = { pending: '#eab308', shipped: '#3b82f6', delivered: '#22c55e', cancelled: '#f43f5e' };
  
  const statusChartData = Object.entries(statusCounts).map(([key, value]) => ({
    name: t.status[key] || key,
    value,
    color: statusColors[key] || '#9ca3af'
  }));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Shadowless Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-green-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
          {t.title}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-700 px-4 py-2.5 pr-10 rtl:pr-4 rtl:pl-10 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-gray-50 transition-all duration-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 cursor-pointer"
            >
              {Object.entries(t.filters).map(([key, val]) => (
                <option key={key} value={key}>{val}</option>
              ))}
            </select>
            <Icon name="ChevronDownIcon" size={14} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${dir === 'rtl' ? 'left-3' : 'right-3'}`} />
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-green-600 border border-transparent text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg hover:bg-green-700 transition-all duration-200 active:scale-95">
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span className="hidden sm:inline">{t.download}</span>
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-start justify-between group">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3 group-hover:text-gray-700 transition-colors">
                {stat.label}
              </p>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                {stat.value}
              </h3>
            </div>
            <div className="w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-gray-500 rounded-lg shrink-0 group-hover:border-green-200 group-hover:bg-green-50 group-hover:text-green-600 transition-all duration-200">
              <Icon name={stat.icon} size={24} variant="outline" />
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">
            {t.charts.revenue}
          </h3>
          <div className="flex-1 w-full h-[300px]">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400">
                {t.empty.chart}
              </div>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">
            {t.charts.status}
          </h3>
          <div className="flex-1 w-full h-[300px] flex items-center justify-center">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusChartData} cx="50%" cy="45%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">
                    {statusChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: 'none', fontWeight: 'bold', fontSize: '12px' }}
                    itemStyle={{ color: '#111827' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-xs font-bold text-gray-600 ml-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400">
                {t.empty.chart}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW (Tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              {t.recentOrders.title}
            </h3>
            <button className="text-[10px] font-bold text-green-600 hover:text-green-700 uppercase tracking-widest transition-all duration-200 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white">
              {t.recentOrders.viewAll}
            </button>
          </div>
          <div className="overflow-x-auto no-scrollbar flex-1">
            <table className="w-full text-sm text-left">
              <thead className={`text-[10px] uppercase tracking-widest text-gray-500 bg-gray-50 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <tr>
                  <th className="px-6 py-4 font-bold">{t.recentOrders.orderId}</th>
                  <th className="px-6 py-4 font-bold">{t.recentOrders.customer}</th>
                  <th className="px-6 py-4 font-bold">{t.recentOrders.date}</th>
                  <th className="px-6 py-4 font-bold">{t.recentOrders.status}</th>
                  <th className="px-6 py-4 font-bold">{t.recentOrders.total}</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-gray-200 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <tr key={order.id || index} className="hover:bg-gray-50 transition-all duration-200 bg-white group cursor-default">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        #{order.id?.substring(0, 8).toUpperCase() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{order.customer_name || 'Guest'}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium text-xs">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {t.status[order.status?.toLowerCase()] || order.status || t.status.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.total_amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-gray-400 bg-white">
                      {t.empty.orders}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-200">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              {t.inventory.title}
            </h3>
            <button className="text-[10px] font-bold text-gray-600 hover:text-gray-900 uppercase tracking-widest transition-all duration-200 px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 hover:bg-white">
              {t.inventory.viewInventory}
            </button>
          </div>
          <div className="divide-y divide-gray-200 flex-1 bg-white">
            {inventoryAlerts.length > 0 ? (
              inventoryAlerts.map((product, idx) => (
                <div key={product.id || idx} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-all duration-200">
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0">
                      <Icon name="CubeIcon" size={18} className="text-gray-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {product.name || 'Unknown Product'}
                      </p>
                      <p className="text-xs font-mono text-gray-500 mt-0.5 truncate">
                        {product.sku || 'No SKU'}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest shrink-0 ${product.stock === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                    {product.stock === 0 ? t.inventory.outOfStock : `${product.stock} ${t.inventory.lowStock}`}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <Icon name="CheckCircleIcon" size={24} className="text-green-500" />
                </div>
                <p className="text-sm font-medium text-gray-500">{t.empty.stock}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}