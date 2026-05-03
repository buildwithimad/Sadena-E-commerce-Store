"use client";

export default function TestOrderButton() {
  const testOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ id: "p1", name: "Test", price: 100, quantity: 1 }],
        subtotal: 100,
        shipping: 10,
        total: 110,
        customer_first_name: "User",
        customer_last_name: "Test",
        customer_email: "user@test.com",
        customer_phone: "0300",
        shipping_street: "Street",
        shipping_city: "City",
        shipping_country: "PK"
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  return <button onClick={testOrder}>Test Order</button>;
}