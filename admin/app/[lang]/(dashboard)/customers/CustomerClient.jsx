'use client';

import Icon from '@/components/ui/AppIcon';

export default function CustomersClient({ lang = 'en' }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // ------------------------
  // 🌍 Internal Translations
  // ------------------------
  const translations = {
    en: {
      title: 'Customers',
      export: 'Export CSV',
      search: 'Search customers by name, email or phone...',
      filterStatus: 'All Statuses',
      table: {
        customer: 'Customer',
        phone: 'Phone',
        orders: 'Total Orders',
        spent: 'Total Spent',
        registered: 'Registered',
        status: 'Status',
        action: 'Action',
      },
      status: {
        active: 'Active',
        inactive: 'Inactive',
      },
      pagination: {
        showing: 'Showing',
        to: 'to',
        of: 'of',
        results: 'results',
        prev: 'Previous',
        next: 'Next',
      }
    },
    ar: {
      title: 'العملاء',
      export: 'تصدير CSV',
      search: 'البحث عن عميل بالاسم، البريد أو الهاتف...',
      filterStatus: 'جميع الحالات',
      table: {
        customer: 'العميل',
        phone: 'رقم الهاتف',
        orders: 'إجمالي الطلبات',
        spent: 'إجمالي الإنفاق',
        registered: 'تاريخ التسجيل',
        status: 'الحالة',
        action: 'إجراء',
      },
      status: {
        active: 'نشط',
        inactive: 'غير نشط',
      },
      pagination: {
        showing: 'عرض',
        to: 'إلى',
        of: 'من',
        results: 'نتائج',
        prev: 'السابق',
        next: 'التالي',
      }
    }
  };

  const t = translations[lang] || translations.en;

  // Mock Data for Customers List
  const customersData = [
    { id: 1, name: 'Sarah Ahmed', email: 'sarah.ahmed@example.com', phone: '+966 50 123 4567', orders: 12, spent: 'SAR 4,500', registered: '2025-11-12', status: 'active', color: 'bg-emerald-100 text-emerald-700' },
    { id: 2, name: 'Mohammed Ali', email: 'm.ali99@example.com', phone: '+966 55 987 6543', orders: 4, spent: 'SAR 1,200', registered: '2026-01-05', status: 'active', color: 'bg-blue-100 text-blue-700' },
    { id: 3, name: 'Fatima Khalid', email: 'fatima.k@example.com', phone: '+966 53 111 2222', orders: 0, spent: 'SAR 0', registered: '2026-03-20', status: 'inactive', color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'Omar Hassan', email: 'omar.h@example.com', phone: '+966 54 333 4444', orders: 24, spent: 'SAR 8,950', registered: '2024-08-15', status: 'active', color: 'bg-amber-100 text-amber-700' },
    { id: 5, name: 'Noura Saad', email: 'noura.saad@example.com', phone: '+966 56 777 8888', orders: 2, spent: 'SAR 540', registered: '2026-04-10', status: 'active', color: 'bg-rose-100 text-rose-700' },
    { id: 6, name: 'Faisal Al-Dosari', email: 'faisal@example.com', phone: '+966 50 999 0000', orders: 8, spent: 'SAR 3,100', registered: '2025-06-22', status: 'active', color: 'bg-indigo-100 text-indigo-700' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700';
      case 'inactive': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div dir={dir} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900 tracking-tight">
          {t.title}
        </h1>
        <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-300 active:scale-95">
          <Icon name="ArrowDownTrayIcon" size={16} />
          {t.export}
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Modern Search */}
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-300">
          <Icon name="MagnifyingGlassIcon" size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder={t.search}
            className="bg-transparent border-none outline-none text-sm px-3 w-full text-gray-900 placeholder:text-gray-400"
          />
        </div>
        {/* Status Filter */}
        <div className="sm:w-56 flex items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 hover:border-gray-300 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all duration-300 relative cursor-pointer group">
          <select className="w-full bg-transparent border-none outline-none text-sm text-gray-700 appearance-none cursor-pointer z-10">
            <option value="all">{t.filterStatus}</option>
            <option value="active">{t.status.active}</option>
            <option value="inactive">{t.status.inactive}</option>
          </select>
          <Icon name="ChevronDownIcon" size={16} className={`text-gray-400 group-hover:text-gray-600 transition-colors absolute pointer-events-none ${dir === 'rtl' ? 'left-4' : 'right-4'}`} />
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className={`text-[11px] uppercase tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <tr>
                <th className="px-6 py-5 font-bold">{t.table.customer}</th>
                <th className="px-6 py-5 font-bold">{t.table.phone}</th>
                <th className="px-6 py-5 font-bold">{t.table.orders}</th>
                <th className="px-6 py-5 font-bold">{t.table.spent}</th>
                <th className="px-6 py-5 font-bold">{t.table.registered}</th>
                <th className="px-6 py-5 font-bold">{t.table.status}</th>
                <th className="px-6 py-5 font-bold text-center">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-100 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {customersData.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/80 transition-all duration-200 group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {/* Customer Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${customer.color}`}>
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors leading-tight">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-mono text-xs font-medium text-gray-500" dir="ltr">{customer.phone}</td>
                  <td className="px-6 py-5 font-bold text-gray-900">{customer.orders}</td>
                  <td className="px-6 py-5 font-bold text-gray-900">{customer.spent}</td>
                  <td className="px-6 py-5 font-medium text-gray-500">{customer.registered}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${getStatusBadge(customer.status)}`}>
                      {t.status[customer.status]}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 outline-none">
                        <Icon name="EnvelopeIcon" size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 outline-none">
                        <Icon name="EyeIcon" size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <p className="text-xs text-gray-500 font-medium">
            {t.pagination.showing} <span className="font-bold text-gray-900">1</span> {t.pagination.to} <span className="font-bold text-gray-900">6</span> {t.pagination.of} <span className="font-bold text-gray-900">128</span> {t.pagination.results}
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 active:scale-95">
              {t.pagination.prev}
            </button>
            <button className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 active:scale-95">
              {t.pagination.next}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}