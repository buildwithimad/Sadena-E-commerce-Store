import OrderDetailsClient from './OrdersClientDetails';
import { getOrderById } from '@/services/ordersService';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Order Details | Admin Panel',
};

export default async function OrderDetailsPage({ params }) {
  const { lang, id } = await params;

    const order = await getOrderById(id);

  return <OrderDetailsClient lang={lang} order={order} />;
}