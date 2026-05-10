"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/store/useCartStore";

export default function OrderSuccessClient() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_id");

  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!orderNumber) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/status?order_id=${orderNumber}`);
        
        if (!res.ok) throw new Error("Failed to fetch order status");
        
        const data = await res.json();
        console.log("Status:", data);
        
        if (data?.payment_status) {
  setStatus(data.payment_status);

 if (data.payment_status === "paid") {
  clearCart();
}
} else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Status check error:", error);
        setStatus("error");
      }
    };

    checkStatus();
  }, [orderNumber]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12  mt-20">
      <div className="max-w-md w-full bg-white   p-8 md:p-10 border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* State: Missing or Invalid Order */}
        {!orderNumber && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-gray-50 rounded-[20px] border border-gray-100 flex items-center justify-center mb-2">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Order Not Found</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
              We couldn't find the order details. The link might be invalid or expired.
            </p>
            <div className="w-full pt-4">
              <button 
                onClick={() => window.location.href = '/'} 
                className="w-full px-4 py-3.5 bg-gray-900 text-white text-[13px] font-bold uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
              >
                Return to Shop
              </button>
            </div>
          </div>
        )}

        {/* State: Checking / Loading */}
        {orderNumber && status === "checking" && (
          <div className="flex flex-col items-center space-y-5 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 flex items-center justify-center mb-2">
              <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#21c45d] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Confirming Payment</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
                Please wait a moment while we securely process and verify your order.
              </p>
            </div>
          </div>
        )}

        {/* State: Payment Successful */}
        {orderNumber && status === "paid" && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20  rounded-[20px] flex items-center justify-center mb-2 shadow-sm shadow-[#21c45d]/10 border border-[#21c45d]/10">
              <svg className="w-10 h-10 text-[#21c45d]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Payment Successful!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Thank you for your purchase. Your order <br />
              <span className="font-mono font-bold text-gray-900 bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg mt-2 inline-block tracking-wide">
                {orderNumber}
              </span> <br />
              has been confirmed.
            </p>
            <div className="w-full pt-6">
              <a 
                href="/" 
                className="flex items-center justify-center w-full px-4 py-3.5 bg-[#21c45d] text-white text-[13px] font-bold uppercase tracking-wider  hover:bg-[#1eb053] transition-all active:scale-95 shadow-[#21c45d]/20 outline-none"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        )}

        {/* State: Payment Failed or Error */}
        {orderNumber && (status === "failed" || status === "error") && (
          <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 rounded-[20px] flex items-center justify-center mb-2 border border-red-100">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Payment Failed</h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
              We encountered an issue processing your payment for order <span className="font-mono font-bold text-gray-900">{orderNumber}</span>.
            </p>
            <div className="w-full pt-6 space-y-3">
              <button 
                onClick={() => window.location.href = '/checkout'} 
                className="w-full px-4 py-3.5 bg-red-500 text-white text-[13px] font-bold uppercase tracking-wider rounded-xl hover:bg-red-600 transition-all active:scale-95 shadow-sm shadow-red-500/20 outline-none"
              >
                Try Payment Again
              </button>
              <button 
                onClick={() => window.location.href = '/contact'} 
                className="w-full px-4 py-3.5 bg-white text-gray-600 text-[13px] font-bold uppercase tracking-wider rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95 outline-none"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}