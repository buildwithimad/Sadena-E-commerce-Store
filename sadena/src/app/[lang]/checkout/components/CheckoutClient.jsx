'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCartStore';
import Icon from '@/components/ui/AppIcon';
import { formatPriceSAR } from '@/data/products';
import { useUser } from "@/context/UserContext";
import AuthModal from '@/components/AuthModal';

const FREE_SHIPPING_THRESHOLD = 199;

export default function CheckoutClient({ lang, t }) {
  const { user } = useUser();
  const router = useRouter(); 
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // --- 1. Form State & Error State ---
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "Saudi Arabia",
  });

  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({}); // Populated ONLY by the backend now
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // --- 2. ZUSTAND CART ONLY ---
  const { items, clearCart } = useCart();

  const totalPriceValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const [step, setStep] = useState(1);
  const [guestOrAccount, setGuestOrAccount] = useState('guest');

  const shippingFree = totalPriceValue >= FREE_SHIPPING_THRESHOLD;
  const shipping = shippingFree ? 0 : 25;
  const orderTotal = totalPriceValue + shipping;

  const missingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPriceValue);
  const progressPercent = Math.min(100, (totalPriceValue / FREE_SHIPPING_THRESHOLD) * 100);

  // =========================
  // AUTO FILL EMAIL & TOGGLE ACCOUNT
  // =========================
  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
      setGuestOrAccount('account');
    }
  }, [user]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the specific error when the user starts typing again
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // =========================
  // SUBMIT ORDER (Strictly relies on Backend Validation)
  // =========================
  const handlePlaceOrder = async (e) => {
    e?.preventDefault();
    setApiError(null);
    setErrors({}); // Clear previous errors before sending to backend

    if (!items?.length) return;

    try {
      setLoading(true);

      const orderData = {
        items,
        subtotal: totalPriceValue,
        shipping,
        total: orderTotal,
        customer_first_name: form.firstName,
        customer_last_name: form.lastName,
        customer_email: form.email,
        customer_phone: form.phone,
        shipping_street: form.street,
        shipping_apt: form.apt,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_zip: form.zip,
        shipping_country: form.country,
        payment_method: paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      // ✅ HANDLE BACKEND VALIDATION ERRORS
      if (!res.ok) {
        if (data.details) {
          const mappedErrors = {};
          let hasFieldErrors = false;

          // Map backend keys directly to frontend state keys
          if (data.details.customer_first_name) { mappedErrors.firstName = data.details.customer_first_name; hasFieldErrors = true; }
          if (data.details.customer_last_name) { mappedErrors.lastName = data.details.customer_last_name; hasFieldErrors = true; }
          if (data.details.customer_email) { mappedErrors.email = data.details.customer_email; hasFieldErrors = true; }
          if (data.details.customer_phone) { mappedErrors.phone = data.details.customer_phone; hasFieldErrors = true; }
          if (data.details.shipping_street) { mappedErrors.street = data.details.shipping_street; hasFieldErrors = true; }
          if (data.details.shipping_city) { mappedErrors.city = data.details.shipping_city; hasFieldErrors = true; }
          if (data.details.shipping_zip) { mappedErrors.zip = data.details.shipping_zip; hasFieldErrors = true; }
          if (data.details.shipping_country) { mappedErrors.country = data.details.shipping_country; hasFieldErrors = true; }

          if (hasFieldErrors) {
            setErrors(mappedErrors);
          }

          // Security check: Catch cart tampering errors from backend
          if (data.details.items || data.details.total || data.details.subtotal) {
            setApiError(lang === 'ar' ? 'حدث خطأ في سلة المشتريات. يرجى تحديث الصفحة.' : 'Cart validation failed. Please refresh the page.');
          }

          setLoading(false);
          // Scroll up so user sees the newly populated backend errors
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return; // Stop execution here
        }

        // Catch 500s or generic errors not caught by validation
        throw new Error(data.error || "Failed to place order");
      }

      // ✅ COD FLOW
      if (paymentMethod === "cod") {
        clearCart();
        const oNumber = data.order?.order_number || data.orderNumber || '';
        const oToken = data.order?.access_token || '';
        router.push(`/${lang}/order-success?orderNumber=${oNumber}&token=${oToken}`);
        return;
      }

      // ✅ CARD FLOW
      if (paymentMethod === "card") {
        const payment = data.payment;

        if (!payment) throw new Error("Payment initialization failed");

        const PAYMENT_URL = process.env.NEXT_PUBLIC_AVAPAY_URL;
        if (!PAYMENT_URL) throw new Error("Payment gateway is not configured yet");

        const formElement = document.createElement("form");
        formElement.method = "POST";
        formElement.action = PAYMENT_URL;

        const fields = {
          merchant_id: payment.merchant_id,
          merchant_password: payment.merchant_password,
          order_id: payment.order_id,
          amount: payment.amount,
          currency: payment.currency,
          callback_url: payment.callback_url,
        };

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          formElement.appendChild(input);
        });

        document.body.appendChild(formElement);
        formElement.submit();
      }

    } catch (err) {
      console.error(err);
      setApiError(err.message || "Something went wrong");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName) => `w-full bg-gray-50 border ${
    errors[fieldName] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-[#21c45d] focus:ring-[#21c45d]/20'
  } rounded-xl px-4 py-3 text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-200 placeholder:text-gray-400`;

  const labelClass = "block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2";

  // --- Empty Cart UI ---
  if (items?.length === 0) {
    return (
      <div dir={dir} className="min-h-screen bg-[#f9fafb] pt-20 flex items-center justify-center px-4 ">
        <div className="text-center max-w-md py-16 animate-in fade-in bg-white p-10 rounded-3xl border border-gray-100 shadow-sm">
          <Icon name="ShoppingBagIcon" size={48} variant="outline" className="text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
          </h1>
          <p className="text-gray-500 mb-8 font-medium">
            {lang === 'ar' ? 'أضف بعض المنتجات قبل إتمام الشراء.' : 'Add some items before checking out.'}
          </p>
          <Link href={`/${lang}/products`} className="inline-flex items-center justify-center gap-2 bg-[#21c45d] text-white px-8 py-3.5 text-sm font-semibold rounded-xl hover:bg-[#1eb053] transition-all duration-200 shadow-sm shadow-[#21c45d]/20">
            {lang === 'ar' ? 'تسوق الآن' : 'Shop Now'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-[#f9fafb] text-gray-900 pb-24">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sm:px-10 flex justify-between items-center sticky top-0 z-30">
        <Link href={`/${lang}`} className="flex items-center gap-2 outline-none">
          <div className="w-8 h-8 rounded-lg bg-[#21c45d] text-white flex items-center justify-center shadow-sm">
            <Icon name="ShoppingBagIcon" size={18} variant="solid" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Shoppex</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <Icon name="LockClosedIcon" size={14} className="mb-0.5 text-gray-400" />
          {lang === 'ar' ? 'دفع آمن' : 'Secure Checkout'}
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        
        {/* Header & Steps */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold tracking-tight text-gray-900 mb-4">
            {lang === 'ar' ? 'إتمام الشراء' : 'Checkout'}
          </h1>
         

          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 sm:gap-6 mt-6 max-w-2xl mx-auto">
            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-[#21c45d]' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${step >= 1 ? 'bg-[#21c45d] text-white shadow-sm' : 'border-2 border-gray-200 text-gray-400'}`}>
                {step > 1 ? <Icon name="CheckIcon" size={14} strokeWidth={3} /> : '1'}
              </div>
              {lang === 'ar' ? 'المعلومات' : 'Information'}
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gray-200" />
            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-[#21c45d]' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${step >= 2 ? 'bg-[#21c45d] text-white shadow-sm' : 'border-2 border-gray-200 text-gray-400'}`}>
                {step > 2 ? <Icon name="CheckIcon" size={14} strokeWidth={3} /> : '2'}
              </div>
              {lang === 'ar' ? 'الشحن' : 'Shipping'}
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gray-200" />
            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 3 ? 'text-[#21c45d]' : 'text-gray-400'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] ${step >= 3 ? 'bg-[#21c45d] text-white shadow-sm' : 'border-2 border-gray-200 text-gray-400'}`}>
                {step > 3 ? <Icon name="CheckIcon" size={14} strokeWidth={3} /> : '3'}
              </div>
              {lang === 'ar' ? 'الدفع' : 'Payment'}
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* LEFT COLUMN: FORM */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-10">
              
              {/* API Error Banner */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3 text-red-600 text-sm font-semibold items-center">
                  <Icon name="ExclamationTriangleIcon" size={20} className="shrink-0" />
                  {apiError}
                </div>
              )}

              {/* Guest / Account Toggle - HIDES COMPLETELY IF USER IS LOGGED IN */}
              {!user && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">
                    {lang === 'ar' ? 'طريقة الشراء' : 'Checkout as'}
                  </p>
                  <div className="flex gap-3">
                    {['guest', 'account']?.map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => {
                          if (mode === 'account') {
                            setAuthModalOpen(true); // Open modal instead of switching toggle
                          } else {
                            setGuestOrAccount(mode);
                          }
                        }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 shadow-sm border ${
                          guestOrAccount === mode
                            ? 'border-[#21c45d] bg-[#ecfdf3] text-[#21c45d]'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {mode === 'guest' ? (lang === 'ar' ? 'زائر' : 'Guest') : (lang === 'ar' ? 'تسجيل الدخول' : 'Login')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf3] text-[#21c45d] flex items-center justify-center">
                    <Icon name="UserIcon" size={16} variant="outline" />
                  </div>
                  {lang === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{lang === 'ar' ? 'الاسم الأول' : 'First Name'} *</label>
                    <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className={getInputClass('firstName')} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'ar' ? 'اسم العائلة' : 'Last Name'} *</label>
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className={getInputClass('lastName')} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.lastName}</p>}
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <label className={labelClass}>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className={getInputClass('email')} dir="ltr" />
                    {errors.email && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2 md:col-span-1">
                    <label className={labelClass}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *</label>
                    <div className="flex gap-2">
                      <select name="phoneCode" value={form.phoneCode || '+966'} onChange={handleChange} className="w-[100px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-900 focus:bg-white focus:border-[#21c45d] focus:ring-2 focus:ring-[#21c45d]/20 outline-none transition-all cursor-pointer font-medium appearance-none">
                        <option value="+966">+966</option>
                      </select>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className={`flex-1 ${getInputClass('phone')}`} dir="ltr" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Shipping Address */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf3] text-[#21c45d] flex items-center justify-center">
                    <Icon name="MapPinIcon" size={16} variant="outline" />
                  </div>
                  {lang === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>{lang === 'ar' ? 'العنوان' : 'Street Address'} *</label>
                    <input type="text" name="street" value={form.street} onChange={handleChange} className={getInputClass('street')} />
                    {errors.street && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.street}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>{lang === 'ar' ? 'الشقة / الوحدة (اختياري)' : 'Apartment, suite, etc. (Optional)'}</label>
                    <input type="text" name="apt" value={form.apt} onChange={handleChange} className={getInputClass()} />
                  </div>
                  <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className={labelClass}>{lang === 'ar' ? 'المدينة' : 'City'} *</label>
                      <input type="text" name="city" value={form.city} onChange={handleChange} className={getInputClass('city')} />
                      {errors.city && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.city}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>{lang === 'ar' ? 'المنطقة' : 'State / Region'}</label>
                      <input type="text" name="state" value={form.state} onChange={handleChange} className={getInputClass('state')} />
                    </div>
                    <div>
                      <label className={labelClass}>{lang === 'ar' ? 'الرمز البريدي' : 'Zip / Postal Code'} *</label>
                      <input type="text" name="zip" value={form.zip} onChange={handleChange} className={getInputClass('zip')} dir="ltr" />
                      {errors.zip && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.zip}</p>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>{lang === 'ar' ? 'الدولة' : 'Country'} *</label>
                    <select name="country" value={form.country} onChange={handleChange} className={`${getInputClass(errors.country)} cursor-pointer font-medium appearance-none`}>
                      <option value="Saudi Arabia">{lang === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</option>
                      <option value="United Arab Emirates">{lang === 'ar' ? 'الإمارات العربية المتحدة' : 'United Arab Emirates'}</option>
                      <option value="Bahrain">{lang === 'ar' ? 'البحرين' : 'Bahrain'}</option>
                      <option value="Kuwait">{lang === 'ar' ? 'الكويت' : 'Kuwait'}</option>
                      <option value="Oman">{lang === 'ar' ? 'عمان' : 'Oman'}</option>
                      <option value="Qatar">{lang === 'ar' ? 'قطر' : 'Qatar'}</option>
                    </select>
                    {errors.country && <p className="text-red-500 text-xs mt-1.5 font-semibold">{errors.country}</p>}
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Payment Method */}
              <div>
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf3] text-[#21c45d] flex items-center justify-center">
                    <Icon name="CreditCardIcon" size={16} variant="outline" />
                  </div>
                  {lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* COD Card */}
                  <label
                    className={`relative p-5 rounded-xl border-2 cursor-pointer flex flex-col transition-all duration-300 ${
                      paymentMethod === "cod"
                        ? "border-[#21c45d] bg-[#ecfdf3] shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-[#21c45d] bg-white' : 'border-gray-300 bg-white'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#21c45d]" />}
                      </div>
                      <span className="font-bold text-gray-900 text-[14px]">
                        {lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                      </span>
                    </div>
                    <p className={`text-[12px] pl-8 font-medium ${paymentMethod === 'cod' ? 'text-[#21c45d]/80' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'ادفع عند استلام طلبك' : 'Pay when you receive your order'}
                    </p>
                    <Icon name="BanknotesIcon" size={26} className={`absolute ${dir === 'rtl' ? 'left-5' : 'right-5'} bottom-5 ${paymentMethod === 'cod' ? 'text-[#21c45d]' : 'text-gray-300'}`} variant="outline" strokeWidth={1.5} />
                  </label>

                  {/* Card Card */}
                  <label
                    className={`relative p-5 rounded-xl border-2 cursor-pointer flex flex-col transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "border-[#21c45d] bg-[#ecfdf3] shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[#21c45d] bg-white' : 'border-gray-300 bg-white'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#21c45d]" />}
                      </div>
                      <span className="font-bold text-gray-900 text-[14px]">
                        {lang === 'ar' ? 'الدفع بالبطاقة' : 'Card Payment'}
                      </span>
                    </div>
                    <p className={`text-[12px] pl-8 font-medium ${paymentMethod === 'card' ? 'text-[#21c45d]/80' : 'text-gray-500'}`}>
                      {lang === 'ar' ? 'ادفع بأمان باستخدام بطاقتك' : 'Pay securely using your card'}
                    </p>
                    <div className={`absolute ${dir === 'rtl' ? 'left-4' : 'right-4'} bottom-4 flex items-center gap-1.5`}>
                      <span className="text-[10px] font-black italic bg-[#142c8e] text-white px-2 py-0.5 rounded tracking-wider shadow-sm">VISA</span>
                      <div className="flex items-center relative w-[22px] h-4">
                        <div className="w-4 h-4 rounded-full bg-[#eb001b] absolute left-0 mix-blend-multiply opacity-90"></div>
                        <div className="w-4 h-4 rounded-full bg-[#f79e1b] absolute right-0 mix-blend-multiply opacity-90"></div>
                      </div>
                      <span className="text-[10px] font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">mada</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-[#21c45d] text-white py-4 rounded-xl font-semibold text-[15px] transition-all duration-300 hover:bg-[#1eb053] disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-[#21c45d]/20"
                >
                  {loading ? <Icon name="ArrowPathIcon" size={20} className="animate-spin" /> : null}
                  {lang === 'ar' ? 'تأكيد الطلب' : 'Place Order'} &bull; {formatPriceSAR(orderTotal, lang)}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400">
                  <Icon name="ShieldCheckIcon" size={14} variant="solid" className="text-gray-300" />
                  {lang === 'ar' ? 'بياناتك محمية بتشفير 256-bit SSL' : 'Your data is protected with 256-bit SSL encryption'}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SUMMARY */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              
              {/* Order Summary Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#ecfdf3] flex items-center justify-center text-[#21c45d]">
                    <Icon name="ShoppingBagIcon" size={16} variant="outline" />
                  </div>
                  {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                </h2>
                
                <div className="space-y-5 mb-8 max-h-[40vh] overflow-y-auto no-scrollbar">
                  {items?.map((item) => (
                    <div key={`${item.id}-${item.sku || ''}`} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center">
                        <img src={item.image || '/placeholder.png'} className="w-full h-full object-cover mix-blend-multiply rounded-xl" alt={item.name} />
                        <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-[3px] border-white shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 truncate leading-tight">{item.name}</p>
                        {item.sku && <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mt-1">SKU: {item.sku}</p>}
                      </div>
                      <div className="text-[14px] font-bold text-gray-900 shrink-0">
                        {formatPriceSAR(item.price * item.quantity, lang)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4 mb-6">
                  <div className="flex justify-between items-center text-[13px] font-bold">
                    <span className="text-gray-900">{lang === 'ar' ? 'المجموع الجزئي' : 'Subtotal'}</span>
                    <span className="text-gray-900">{formatPriceSAR(totalPriceValue, lang)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-bold">
                    <span className="text-gray-900">{lang === 'ar' ? 'رسوم الشحن' : 'Shipping Fee'}</span>
                    <span className="text-gray-900">{formatPriceSAR(shipping, lang)}</span>
                  </div>
                </div>

                {/* Shipping Promo */}
                <div className="bg-[#ecfdf3]/50 rounded-xl p-4 mb-6 border border-[#21c45d]/20">
                  <p className="text-[12px] font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                    <Icon name="TruckIcon" size={16} className="text-[#21c45d]" />
                    {shippingFree ? (
                        <span>You got <span className="font-bold text-[#21c45d]">FREE</span> shipping!</span>
                    ) : (
                        <span>Add <span className="font-bold text-gray-900">{formatPriceSAR(missingForFree, lang)}</span> more for <span className="font-bold text-[#21c45d]">FREE</span> shipping!</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#21c45d] rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-[#21c45d]">{Math.floor(progressPercent)}%</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-6 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-[#21c45d]">{formatPriceSAR(orderTotal, lang)}</span>
                </div>
              </div>

              {/* Secure Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#ecfdf3] flex items-center justify-center text-[#21c45d] border border-[#21c45d]/10">
                    <Icon name="ShieldCheckIcon" size={20} variant="outline" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-[14px]">Secure & Encrypted</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">Your payment information is safe with us.</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-[#ecfdf3]/50 rounded-xl flex items-center justify-center">
                  <Icon name="CheckBadgeIcon" size={28} className="text-[#21c45d]/30" variant="solid" />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm flex-col sm:flex-row text-center sm:text-left">
                  <Icon name="ArrowUturnLeftIcon" size={20} className="text-gray-400" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Free Returns</p>
                    <p className="text-[9px] text-gray-500 mt-0.5 font-medium">7 days return policy</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm flex-col sm:flex-row text-center sm:text-left">
                  <Icon name="TruckIcon" size={20} className="text-gray-400" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">Fast Delivery</p>
                    <p className="text-[9px] text-gray-500 mt-0.5 font-medium">2-3 business days</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm flex-col sm:flex-row text-center sm:text-left">
                  <Icon name="ShieldCheckIcon" size={20} className="text-[#21c45d]" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">100% Secure</p>
                    <p className="text-[9px] text-gray-500 mt-0.5 font-medium">Encrypted payment</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </form>
      </div>

      {/* RENDER AUTH MODAL HERE */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        lang={lang} 
      />
    </div>
  );
}