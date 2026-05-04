import OrderDetailsClient from './OrdersClientDetails';
import { getOrderById } from '@/services/ordersService';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Order Details | Admin Panel',
};

export default async function OrderDetailsPage({ params }) {
  const { lang, id } = await params;

    const order = await getOrderById(id);

    console.log("Order from Order details Page", order)

  return <OrderDetailsClient lang={lang} order={order} />;
}