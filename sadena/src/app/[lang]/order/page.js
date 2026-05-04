import OrdersClient from "./OrdersClient";

export default function OrdersPage({ params }) {
  const { lang = "en" } = params;

  return <OrdersClient lang={lang} />;
}