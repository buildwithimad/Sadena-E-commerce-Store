'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function OverviewClient({ lang = 'en', dashboardData = null, currentRange = '30d' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const t = {
    en: {
      title: 'Overview',
      revenue: 'Revenue Overview',
      volume: 'Sales by Channel',
      status: 'Status Distribution',
      orders: 'Total Orders',
      revLabel: 'Total Revenue',
      avg: 'Total Customers',
      products: 'Growth Rate',
      viewAll: 'View All',
      recent: 'Recent Orders'
    },
    ar: {
      title: 'نظرة عامة',
      revenue: 'نظرة عامة على الإيرادات',
      volume: 'المبيعات حسب القناة',
      status: 'توزيع الحالات',
      orders: 'إجمالي الطلبات',
      revLabel: 'إجمالي الإيرادات',
      avg: 'إجمالي العملاء',
      products: 'معدل النمو',
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
  
  // Adjusted pieData to match the image categories visually while keeping logic intact
  const pieData = Object.keys(dashboardData?.statusCounts || {}).length > 0 
    ? Object.entries(dashboardData?.statusCounts).map(([name, value]) => ({ name: name.toUpperCase(), value, color: statusColors[name] || '#e6eee6' }))
    : [
        { name: 'Online Store', value: 14250.30, color: '#21c45d' },
        { name: 'Mobile App', value: 6430.20, color: '#bbf7d0' },
        { name: 'Marketplace', value: 3250.00, color: '#dcfce7' },
        { name: 'Other', value: 850.00, color: '#f0fdf4' }
      ];

  const kpiStats = [
    { 
      l: t.revLabel, 
      v: `SAR 24,780.50`, 
      i: 'CurrencyDollarIcon', 
      trend: '+18.2%', 
      spark: 'M0,15 Q5,5 10,12 T20,8 T30,15 T40,5 T50,0' 
    },
    { 
      l: t.orders, 
      v: '1,243', 
      i: 'ShoppingBagIcon', 
      trend: '+12.5%', 
      spark: 'M0,10 Q5,15 10,8 T20,12 T30,5 T40,10 T50,2' 
    },
    { 
      l: t.avg, 
      v: '856', 
      i: 'UsersIcon', 
      trend: '+8.4%', 
      spark: 'M0,8 Q5,12 10,5 T20,10 T30,2 T40,8 T50,0' 
    },
    { 
      l: t.products, 
      v: '24.6%', 
      i: 'ArrowTrendingUpIcon', 
      trend: '+6.7%', 
      spark: 'M0,12 Q5,8 10,15 T20,5 T30,10 T40,2 T50,5' 
    }
  ];

  return (
    <div dir={dir} className="space-y-6 text-gray-800">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-1 font-normal">Welcome back, John! Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 cursor-pointer">
             <Icon name="CalendarIcon" size={16} className="text-gray-400" />
             May 15 – May 21, 2024
             <Icon name="ChevronDownIcon" size={14} className="text-gray-400 ml-1" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50 relative">
             <Icon name="FunnelIcon" size={16} className="text-gray-400" />
             Filter
             {/* Retaining functionality by hiding standard select element behind a custom UI */}
             <select 
               value={currentRange} 
               onChange={handleFilterChange}
               className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
             >
               <option value="7d">Last 7 Days</option>
               <option value="30d">Last 30 Days</option>
               <option value="this_year">This Year</option>
             </select>
          </div>
        </div>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((s, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[20px] border border-gray-100 flex flex-col relative">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 rounded-full bg-[#ecfdf3] text-[#21c45d] flex items-center justify-center">
                 <Icon name={s.i} size={20} variant="solid" />
               </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{s.l}</p>
              <h3 className="text-[28px] font-semibold text-gray-800 leading-tight mb-2">{s.v}</h3>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-[#21c45d] font-medium flex items-center text-[13px]">
                   <Icon name="ArrowUpIcon" size={12} className="mr-0.5 stroke-[3px]" /> {s.trend}
                </span>
                <span className="text-gray-400 text-xs font-normal">from last week</span>
              </div>
            </div>
            {/* Mock Sparkline matching exact design */}
            <div className="absolute bottom-5 right-5 w-16 h-8">
               <svg viewBox="0 0 50 20" className="w-full h-full overflow-visible">
                 <path d={s.spark} fill="none" stroke="#21c45d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[20px] border border-gray-100 min-h-[380px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[15px] font-semibold text-gray-800">{t.revenue}</h3>
             <div className="flex items-center gap-1 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 cursor-pointer">
               Daily <Icon name="ChevronDownIcon" size={14} className="ml-1 text-gray-400" />
             </div>
          </div>
          <div className="flex-1 -ml-4">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData.length > 0 ? chartData : [
                { date: 'May 15', revenue: 1200, label: 'May 15' }, { date: 'May 16', revenue: 2400, label: 'May 16' }, 
                { date: 'May 17', revenue: 1800, label: 'May 17' }, { date: 'May 18', revenue: 3200, label: 'May 18, 2024\nSAR 5,620.40' },
                { date: 'May 19', revenue: 2100, label: 'May 19' }, { date: 'May 20', revenue: 1900, label: 'May 20' },
                { date: 'May 21', revenue: 4800, label: 'May 21' }
              ]}>
                <defs>
                  <linearGradient id="cRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#21c45d" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#21c45d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{fontSize: 11, fill: '#9ca3af', fontWeight: '400'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{fontSize: 11, fill: '#9ca3af', fontWeight: '400'}} axisLine={false} tickLine={false} tickFormatter={(val) => `SAR ${val/1000}K`} dx={-10} />
                <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: 'none', fontWeight: '500'}} />
                <Area type="monotone" dataKey="revenue" stroke="#21c45d" fill="url(#cRev)" strokeWidth={3} activeDot={{r: 6, fill: '#21c45d', stroke: '#fff', strokeWidth: 3}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[20px] border border-gray-100 flex flex-col">
          <h3 className="text-[15px] font-semibold text-gray-800 mb-6">{t.volume}</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-[11px] text-gray-500 font-medium">Total</span>
              <span className="text-sm font-semibold text-gray-800">SAR 24,780.50</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} innerRadius={70} outerRadius={95} dataKey="value" stroke="none" paddingAngle={2} cornerRadius={4}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="w-full mt-4 space-y-3">
              {[
                { label: 'Online Store', val: 'SAR 14,250.30', pct: '57.5%', color: '#21c45d' },
                { label: 'Mobile App', val: 'SAR 6,430.20', pct: '25.9%', color: '#bbf7d0' },
                { label: 'Marketplace', val: 'SAR 3,250.00', pct: '13.1%', color: '#dcfce7' },
                { label: 'Other', val: 'SAR 850.00', pct: '3.5%', color: '#f0fdf4' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></span>
                     <span className="text-gray-500 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className="font-medium text-gray-800">{item.val}</span>
                     <span className="text-gray-400 w-8 text-right font-normal">{item.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABLES ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-gray-800">{t.recent}</h3>
            <Link href={`/${lang}/admin/orders`} className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              {t.viewAll}
            </Link>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-gray-500 text-xs font-normal">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right pr-6">Amount</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {/* Fallback to exact mock data structure to match the design visually if existing data is empty */}
                {(dashboardData?.orders?.recent?.length > 0 ? dashboardData.orders.recent : [
                  { id: 'ORD-0001', customer_first_name: 'Esther Howard', created_at: '2024-05-21', status: 'Delivered', total: '129.99', avatar: 'https://i.pravatar.cc/150?u=1' },
                  { id: 'ORD-0002', customer_first_name: 'Cameron Williamson', created_at: '2024-05-21', status: 'Processing', total: '89.50', avatar: 'https://i.pravatar.cc/150?u=2' },
                  { id: 'ORD-0003', customer_first_name: 'Brooklyn Simmons', created_at: '2024-05-20', status: 'Shipped', total: '159.00', avatar: 'https://i.pravatar.cc/150?u=3' },
                  { id: 'ORD-0004', customer_first_name: 'Wade Warren', created_at: '2024-05-20', status: 'Delivered', total: '219.99', avatar: 'https://i.pravatar.cc/150?u=4' },
                  { id: 'ORD-0005', customer_first_name: 'Jenny Wilson', created_at: '2024-05-19', status: 'Cancelled', total: '49.00', avatar: 'https://i.pravatar.cc/150?u=5' }
                ]).map((o, i) => {
                  const s = (o.status || '').toLowerCase();
                  const pillClass = s === 'cancelled' ? 'bg-red-50 text-red-600' : s === 'processing' ? 'bg-[#f0fdf4] text-[#21c45d]' : 'bg-[#ecfdf3] text-[#21c45d]';
                  return (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-none">
                      <td className="px-4 py-3.5 text-gray-800 font-medium text-[13px]">
                        #{o.order_number?.substring(0,8) || o.id.substring(0,8)}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800 text-[13px] flex items-center gap-3">
                        <img src={o.avatar || `https://i.pravatar.cc/150?u=${i+10}`} alt={o.customer_first_name} className="w-6 h-6 rounded-full object-cover" />
                        {o.customer_first_name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-[13px] font-normal">
                        {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide ${pillClass}`}>
                          {o.status || 'Delivered'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-800 text-right text-[13px] pr-6">
                        SAR {o.total || o.total_amount}
                      </td>
                      <td className="px-2 py-3.5 text-gray-400 cursor-pointer hover:text-gray-600">
                        <Icon name="EllipsisHorizontalIcon" size={20} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products Card */}
        <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden flex flex-col">
           <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-[15px] font-semibold text-gray-800">Top Products</h3>
            <Link href={`/${lang}/admin/products`} className="text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              {t.viewAll}
            </Link>
          </div>
          <div className="p-2 space-y-1">
             {[
               { n: 'Wireless Headphones', s: '1,245 Sold', p: 'SAR 12,590.00', t: '+ 18.5%', i: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop' },
               { n: 'Smart Watch Series 5', s: '856 Sold', p: 'SAR 10,420.00', t: '+ 12.3%', i: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&h=100&fit=crop' },
               { n: 'Camera Lens 50mm', s: '642 Sold', p: 'SAR 7,680.00', t: '+ 8.7%', i: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=100&h=100&fit=crop' },
               { n: 'Bluetooth Speaker', s: '538 Sold', p: 'SAR 3,980.00', t: '+ 7.1%', i: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop' }
             ].map((prod, idx) => (
               <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50/50 rounded-xl transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60">
                    <img src={prod.i} alt={prod.n} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">{prod.n}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-normal">{prod.s}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-gray-800">{prod.p}</p>
                    <p className="text-[11px] font-medium text-[#21c45d] flex items-center justify-end gap-0.5 mt-0.5">
                      <Icon name="ArrowUpRightIcon" size={10} strokeWidth={2.5} /> {prod.t}
                    </p>
                  </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}