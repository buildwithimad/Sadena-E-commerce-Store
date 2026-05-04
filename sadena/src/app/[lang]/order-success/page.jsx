import OrderSuccessClient from "./OrderSuccessClient";

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;

  const orderNumber = params?.orderNumber; // ✅ FIX HERE
  const token = params?.token;

  if (!orderNumber || !token) {
    return <div className="p-10 text-center">Invalid order</div>;
  }

  return (
    <OrderSuccessClient
      orderNumber={orderNumber}
      token={token}
    />
  );
}