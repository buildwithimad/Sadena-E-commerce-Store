'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function OverviewClient({ lang = 'en', dashboardData = null, currentRange = '30d' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const t = {
    en: {
      title: 'Analytics Overview',
      revenue: 'Revenue Trend',
      volume: 'Order Volume',
      status: 'Status Distribution',
      orders: 'Period Orders',
      revLabel: 'Period Revenue',
      avg: 'Avg Order Value',
      products: 'Total Products',
      viewAll: 'VIEW ALL',
      recent: 'Recent Orders'
    },
    ar: {
      title: 'نظرة عامة والتحليلات',
      revenue: 'اتجاه الإيرادات',
      volume: 'حجم الطلبات',
      status: 'توزيع الحالات',
      orders: 'طلبات الفترة',
      revLabel: 'إيرادات الفترة',
      avg: 'متوسط الطلب',
      products: 'إجمالي المنتجات',
      viewAll: 'عرض الكل',
      recent: 'أحدث الطلبات'
    }
  }[lang];

  const chartData = dashboardData?.chartData || [];
  const statsData = dashboardData?.stats || {};

  const handleFilterChange = (e) => {
    const newRange = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('range', newRange);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const formatChartDate = (str) => {
    const date = new Date(str.length === 7 ? `${str}-02` : str);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      ...(str.length === 10 ? { day: 'numeric' } : {})
    }).format(date);
  };

  const statusColors = { placed: '#88a88f', pending: '#b38a22', processing: '#4a6b50', shipped: '#3b6b9e', delivered: '#2d4d33', cancelled: '#c95252' };
  const pieData = Object.entries(dashboardData?.statusCounts || {}).map(([name, value]) => ({
    name: name.toUpperCase(),
    value,
    color: statusColors[name] || '#e6eee6'
  }));

  return (
    <div dir={dir} className="space-y-6 pb-12 bg-[#f8fbf8] min-h-screen text-[#0a1f10]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 px-4 sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
        <select 
          value={currentRange} 
          onChange={handleFilterChange}
          className="bg-white border border-[#e6eee6] px-4 py-2 rounded-md text-xs font-bold uppercase outline-none focus:border-[#5c8b5d] cursor-pointer"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      <div className="px-4 sm:px-8 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: t.revLabel, v: `SAR ${statsData.totalRevenue?.toLocaleString()}`, i: 'BanknotesIcon' },
            { l: t.orders, v: statsData.totalOrders, i: 'ShoppingBagIcon' },
            { l: t.avg, v: `SAR ${Math.round(statsData.avgOrderValue)?.toLocaleString()}`, i: 'ChartBarIcon' },
            { l: t.products, v: statsData.totalProducts, i: 'CubeIcon' }
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-[#e6eee6] flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#6b8e70] uppercase mb-2">{s.l}</p>
                <h3 className="text-2xl font-bold">{s.v}</h3>
              </div>
              <div className="p-2 bg-[#f0f6f0] rounded-lg text-[#5c8b5d]"><Icon name={s.i} size={20} /></div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#e6eee6] min-h-[380px] flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-8">{t.revenue}</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="cRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5c8b5d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5c8b5d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f6f0" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#5c8b5d" fill="url(#cRev)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#e6eee6] min-h-[380px] flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-8">{t.volume}</h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f6f0" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{fill: '#f0f6f0'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                  <Bar dataKey="orders" fill="#88a88f" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* RECENT & DONUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#e6eee6] flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">{t.status}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={85} dataKey="value" stroke="none" paddingAngle={5}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-[#e6eee6] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#e6eee6] flex justify-between items-center bg-[#fcfdfc]">
              <h3 className="text-xs font-bold uppercase tracking-widest">{t.recent}</h3>
              <Link href={`/${lang}/admin/orders`} className="text-[10px] font-bold text-[#5c8b5d] border border-[#d9e6d9] px-3 py-1 rounded-md">{t.viewAll}</Link>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-[#e6eee6]">
                {dashboardData?.orders?.recent.map((o, i) => (
                  <tr key={i} className="hover:bg-[#fbfcfb]">
                    <td className="px-6 py-4 font-mono text-xs font-bold">#{o.order_number?.substring(0,8) || o.id.substring(0,8)}</td>
                    <td className="px-6 py-4 font-medium">{o.customer_first_name}</td>
                    <td className="px-6 py-4 text-[#6b8e70] text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-right">SAR {o.total || o.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}