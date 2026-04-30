import WarehouseClient from './WarehouseClient';
import { getWarehouses } from '@/services/wareHousesService';


export const metadata = {
  title: 'Warehouse | Admin Panel',
};

export default async function WarehousePage({ params }) {
  const { lang } = await params;
  
 const warehouses = await getWarehouses();
  

  return <WarehouseClient lang={lang} warehouses={warehouses} />;
}