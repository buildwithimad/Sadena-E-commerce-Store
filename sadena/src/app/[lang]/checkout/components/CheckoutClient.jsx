'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/useCartStore';
import Icon from '@/components/ui/AppIcon';
import { formatPriceSAR } from '@/data/products';

const FREE_SHIPPING_THRESHOLD = 199;

export default function CheckoutClient({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const { items, totalPrice, clearCart } = useCart();
  const totalPriceValue = totalPrice();
  const [step, setStep] = useState(1);
  const [guestOrAccount, setGuestOrAccount] = useState('guest');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingFree = totalPriceValue >= FREE_SHIPPING_THRESHOLD;
  const shipping = shippingFree ? 0 : 25;
  const orderTotal = totalPriceValue + shipping;

  const handlePlaceOrder = (e) => {
    e?.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div
        dir={dir}
        className="min-h-screen bg-background pt-20 flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md py-16">
          <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckIcon" size={32} variant="outline" className="text-accent" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground mb-3">
            {lang === 'ar' ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
          </h1>
          <p className="text-muted-foreground mb-2">
            {lang === 'ar'
              ? 'شكراً لتسوقك مع سادينا. ستتلقى تأكيداً عبر البريد الإلكتروني قريباً.'
              : "Thank you for shopping with Sadena. You'll receive a confirmation email shortly."}
          </p>
          <p className="text-xs text-muted-foreground mb-8">
            {lang === 'ar' ? 'رقم الطلب: #SD-2026-' : 'Order #SD-2026-'}
            {Math.floor(Math.random() * 90000) + 10000}
          </p>
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
          >
            {lang === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <div
        dir={dir}
        className="min-h-screen bg-background pt-20 flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md py-16">
          <Icon
            name="ShoppingBagIcon"
            size={48}
            variant="outline"
            className="text-muted-foreground mx-auto mb-6"
          />
          <h1 className="font-display text-3xl font-medium text-foreground mb-3">
            {lang === 'ar' ? 'سلتك فارغة' : 'Your cart is empty'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {lang === 'ar'
              ? 'أضف بعض المنتجات قبل إتمام الشراء.'
              : 'Add some items before checking out.'}
          </p>
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm font-semibold tracking-widest uppercase rounded-md hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            {lang === 'ar' ? 'تسوق الآن' : 'Shop Now'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="border-b border-border py-6 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
            {lang === 'ar' ? 'إتمام الشراء' : 'Checkout'}
          </h1>
          {/* Step Indicators */}
          <div className="flex items-center gap-3 mt-4">
            {[1, 2, 3]?.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-border text-muted-foreground'
                  }`}
                >
                  {step > s ? <Icon name="CheckIcon" size={12} variant="outline" /> : s}
                </div>
                <span
                  className={`text-xs font-medium ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {s === 1
                    ? lang === 'ar'
                      ? 'المعلومات'
                      : 'Information'
                    : s === 2
                      ? lang === 'ar'
                        ? 'الشحن'
                        : 'Shipping'
                      : lang === 'ar'
                        ? 'الدفع'
                        : 'Payment'}
                </span>
                {s < 3 && (
                  <Icon
                    name="ChevronRightIcon"
                    size={12}
                    variant="outline"
                    className={`text-muted-foreground ${dir === 'rtl' ? 'rotate-180' : ''}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Guest / Account Toggle */}
            <div className="bg-secondary rounded-md p-5">
              <p className="text-sm font-medium text-foreground mb-3">
                {lang === 'ar' ? 'طريقة الشراء' : 'Checkout as'}
              </p>
              <div className="flex gap-3">
                {['guest', 'account']?.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGuestOrAccount(mode)}
                    className={`flex-1 py-2.5 text-sm font-medium border rounded-md transition-all duration-200 ${
                      guestOrAccount === mode
                        ? 'border-foreground bg-foreground text-primary-foreground'
                        : 'border-border text-foreground hover:border-foreground'
                    }`}
                  >
                    {mode === 'guest'
                      ? lang === 'ar'
                        ? 'زائر'
                        : 'Guest'
                      : lang === 'ar'
                        ? 'إنشاء حساب'
                        : 'Create Account'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Contact */}
              <div>
                <h2 className="font-display text-xl font-medium text-foreground mb-4">
                  {lang === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder={lang === 'ar' ? 'نادية' : 'Nadia'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {lang === 'ar' ? 'اسم العائلة' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder={lang === 'ar' ? 'أوكافور' : 'Okafor'}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder={lang === 'ar' ? 'example@email.com' : 'nadia@example.com'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="font-display text-xl font-medium text-foreground mb-4">
                  {lang === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'العنوان' : 'Street Address'}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder={lang === 'ar' ? '123 شارع الرئيسي' : '123 Main Street'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'الشقة / الوحدة (اختياري)' : 'Apt / Suite (optional)'}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {lang === 'ar' ? 'المدينة' : 'City'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder={lang === 'ar' ? 'نيويورك' : 'New York'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {lang === 'ar' ? 'الولاية' : 'State'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {lang === 'ar' ? 'الرمز البريدي' : 'ZIP Code'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'الدولة' : 'Country'}
                    </label>
                    <select className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>United Arab Emirates</option>
                      <option>Saudi Arabia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="font-display text-xl font-medium text-foreground mb-4">
                  {lang === 'ar' ? 'معلومات الدفع' : 'Payment'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'رقم البطاقة' : 'Card Number'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                      />
                      <Icon
                        name="CreditCardIcon"
                        size={18}
                        variant="outline"
                        className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${dir === 'rtl' ? 'left-3' : 'right-3'}`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        {lang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                      </label>
                      <input
                        type="text"
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="MM / YY"
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                      {lang === 'ar' ? 'اسم حامل البطاقة' : 'Cardholder Name'}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-border bg-background text-foreground px-4 py-3 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder={lang === 'ar' ? 'نادية أوكافور' : 'Nadia Okafor'}
                    />
                  </div>
                </div>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 text-sm font-semibold tracking-widest uppercase rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <Icon name="ShieldCheckIcon" size={16} variant="outline" />
                {lang === 'ar' ? 'تأكيد الطلب' : 'Place Order'} — {formatPriceSAR(orderTotal, lang)}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                {lang === 'ar'
                  ? 'بالنقر على تأكيد الطلب، أنت توافق على شروط الخدمة وسياسة الخصوصية.'
                  : 'By placing your order, you agree to our Terms of Service and Privacy Policy.'}
              </p>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-secondary rounded-md p-6 sticky top-24">
              <h2 className="font-display text-xl font-medium text-foreground mb-5">
                {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Items */}
              <ul className="space-y-4 mb-5 max-h-64 overflow-y-auto no-scrollbar">
                {items?.map((item) => (
                  <li key={`${item?.id}-${item?.sku || ''}`} className="flex gap-3 items-start">
                    <div className="w-14 h-16 bg-background rounded-md overflow-hidden relative shrink-0">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-primary text-primary-foreground text-[9px] font-bold rounded-full leading-none px-1">
                        {item?.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item?.name}</p>
                      {item?.sku && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item?.sku}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-foreground shrink-0">
                      {formatPriceSAR(item?.price * item?.quantity, lang)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'المجموع الجزئي' : 'Subtotal'}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatPriceSAR(totalPriceValue, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {lang === 'ar' ? 'الشحن' : 'Shipping'}
                  </span>
                  <span
                    className={`font-medium ${shippingFree ? 'text-accent' : 'text-foreground'}`}
                  >
                    {shippingFree
                      ? lang === 'ar'
                        ? 'مجاني'
                        : 'FREE'
                      : formatPriceSAR(shipping, lang)}
                  </span>
                </div>
                {!shippingFree && (
                  <p className="text-xs text-muted-foreground">
                    {lang === 'ar'
                      ? `أضف ${formatPriceSAR(Math.max(0, FREE_SHIPPING_THRESHOLD - totalPriceValue), lang)} للشحن المجاني`
                      : `Add ${formatPriceSAR(Math.max(0, FREE_SHIPPING_THRESHOLD - totalPriceValue), lang)} for free shipping`}
                  </p>
                )}
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-semibold text-foreground">
                    {lang === 'ar' ? 'الإجمالي' : 'Total'}
                  </span>
                  <span className="font-bold text-xl text-foreground">
                    {formatPriceSAR(orderTotal, lang)}
                  </span>
                </div>
              </div>

              {/* Trust */}
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="LockClosedIcon" size={12} variant="solid" className="text-accent" />
                {lang === 'ar' ? 'دفع آمن ومشفر' : 'Secure & encrypted checkout'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
