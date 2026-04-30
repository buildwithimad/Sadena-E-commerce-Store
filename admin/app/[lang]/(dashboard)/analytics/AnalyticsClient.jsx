'use client';

import Icon from '@/components/ui/AppIcon';

export default function AnalyticsClient({ lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // ------------------------
  // 🌍 Internal Translations
  // ------------------------
  const translations = {
    en: {
      title: 'Analytics & Reports',
      export: 'Export Report',
      dateRange: 'Last 30 Days',
      kpi: {
        revenue: 'Total Revenue',
        conversion: 'Conversion Rate',
        aov: 'Average Order Value',
        visits: 'Store Visits',
      },
      charts: {
        revenueOverview: 'Revenue Overview',
        topProducts: 'Top Selling Products',
        traffic: 'Traffic Sources',
      },
      trafficLabels: {
        direct: 'Direct',
        social: 'Social Media',
        organic: 'Organic Search',
        referral: 'Referral'
      }
    },
    ar: {
      title: 'التحليلات والتقارير',
      export: 'تصدير التقرير',
      dateRange: 'آخر 30 يوماً',
      kpi: {
        revenue: 'إجمالي الإيرادات',
        conversion: 'معدل التحويل',
        aov: 'متوسط قيمة الطلب',
        visits: 'زيارات المتجر',
      },
      charts: {
        revenueOverview: 'نظرة عامة على الإيرادات',
        topProducts: 'المنتجات الأكثر مبيعاً',
        traffic: 'مصادر الزيارات',
      },
      trafficLabels: {
        direct: 'مباشر',
        social: 'شبكات التواصل',
        organic: 'بحث عضوي',
        referral: 'إحالة'
      }
    }
  };

  const t = translations[lang] || translations.en;

  // Mock KPI Data
  const kpis = [
    { label: t.kpi.revenue, value: lang === 'ar' ? '١٢٨,٤٥٠ ر.س' : 'SAR 128,450', trend: '+14.5%', isPositive: true, icon: 'BanknotesIcon', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { label: t.kpi.conversion, value: '3.2%', trend: '+0.8%', isPositive: true, icon: 'ChartBarIcon', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { label: t.kpi.aov, value: lang === 'ar' ? '٢٤٥ ر.س' : 'SAR 245', trend: '-1.2%', isPositive: false, icon: 'ShoppingCartIcon', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: t.kpi.visits, value: '45,231', trend: '+22.4%', isPositive: true, icon: 'UsersIcon', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
  ];

  // Mock Top Products
  const topProducts = [
    { name: lang === 'ar' ? 'تمور العجوة الفاخرة' : 'Premium Ajwa Dates', sales: 342, revenue: 'SAR 41,040' },
    { name: lang === 'ar' ? 'عسل سدر طبيعي' : 'Organic Sidr Honey', sales: 215, revenue: 'SAR 38,700' },
    { name: lang === 'ar' ? 'زيت زيتون بكر ممتاز' : 'Extra Virgin Olive Oil', sales: 189, revenue: 'SAR 17,955' },
    { name: lang === 'ar' ? 'مكسرات مشوية عضوية' : 'Organic Roasted Nuts', sales: 145, revenue: 'SAR 12,325' },
  ];

  // Mock Traffic Sources
  const trafficSources = [
    { label: t.trafficLabels.direct, percentage: 45, color: 'bg-emerald-500' },
    { label: t.trafficLabels.social, percentage: 30, color: 'bg-blue-500' },
    { label: t.trafficLabels.organic, percentage: 15, color: 'bg-amber-500' },
    { label: t.trafficLabels.referral, percentage: 10, color: 'bg-purple-500' },
  ];

  // Mock Chart Bars (CSS representation)
  const chartBars = [40, 65, 45, 80, 55, 90, 70, 100, 60, 85, 50, 75];

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
          {t.title}
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl cursor-default">
            <Icon name="CalendarIcon" size={16} className="text-gray-400" />
            {t.dateRange}
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-green-700 transition-all duration-300 active:scale-95 shadow-sm shadow-green-600/20">
            <Icon name="ArrowDownTrayIcon" size={16} />
            {t.export}
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-6 border border-gray-200 rounded-2xl flex flex-col justify-between hover:border-gray-300 transition-colors group cursor-default">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${kpi.bg} ${kpi.color}`}>
                <Icon name={kpi.icon} size={20} />
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${kpi.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                <Icon name={kpi.isPositive ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'} size={12} />
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {kpi.label}
              </p>
              <h3 className="font-display text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                {kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* REVENUE CHART (Pure CSS Placeholder) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              {t.charts.revenueOverview}
            </h3>
            <Icon name="EllipsisHorizontalIcon" size={24} className="text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
          </div>
          
          {/* CSS Bar Chart */}
          <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-64 mt-auto border-b border-gray-100 pb-2">
            {chartBars.map((height, idx) => (
              <div key={idx} className="w-full flex flex-col justify-end h-full group relative">
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none transition-opacity whitespace-nowrap z-10">
                  SAR {(height * 1500).toLocaleString()}
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-green-100 group-hover:bg-green-500 rounded-t-md transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          {/* X-Axis Labels */}
          <div className="flex items-center justify-between mt-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* SIDE COLUMN */}
        <div className="space-y-6">
          
          {/* TOP PRODUCTS */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">
              {t.charts.topProducts}
            </h3>
            <div className="space-y-5">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-xs text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</p>
                      <p className="text-[11px] font-medium text-gray-500 mt-0.5">{product.sales} {lang === 'ar' ? 'مبيعات' : 'sales'}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{product.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TRAFFIC SOURCES */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">
              {t.charts.traffic}
            </h3>
            <div className="space-y-5">
              {trafficSources.map((source, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">{source.label}</span>
                    <span className="text-xs font-bold text-gray-900">{source.percentage}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${source.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}