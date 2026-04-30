import OrdersClient from './OrdersClient';
import { getOrders } from '@/services/ordersService'; // Adjust path to where getOrders is located

export const metadata = {
  title: 'Orders | Admin Panel',
};

export default async function OrdersPage({ params, searchParams }) {
  const { lang } = await params;
  const page = Number((await searchParams)?.page) || 1;
  const limit = 10;

  // Fetch data server-side
  const { orders, total, totalPages } = await getOrders({ page, limit });

  return (
    <OrdersClient 
      lang={lang} 
      orders={orders || []} 
      total={total || 0}
      currentPage={page}
      totalPages={totalPages || 1}
      limit={limit}
    />
  );
}