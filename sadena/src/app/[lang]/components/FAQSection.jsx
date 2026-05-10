"use client";

import { useState } from 'react';

export default function FAQSection({ lang, t }) {
  const [openIndex, setOpenIndex] = useState(null);

  const title = lang === 'ar' ? 'كل ما تحتاجين معرفته' : 'Everything You Need to Know';

  // Exact questions from the PDF requirements
  const faqs = [
    {
      q: lang === 'ar' ? 'هل منتجات سادينا مرخصة وآمنة؟' : 'Are Sadina products safe and certified?',
      a: lang === 'ar' ? 'نعم، جميع منتجاتنا مرخصة وآمنة للاستخدام اليومي.' : 'Yes, all our products are certified and safe for daily use.'
    },
    {
      q: lang === 'ar' ? 'هل منتجاتكم مصنوعة من مكونات طبيعية؟' : 'Are your products made from natural ingredients?',
      a: lang === 'ar' ? 'نعم، نعتمد على أفضل المكونات الطبيعية.' : 'Yes, we rely on the finest natural ingredients.'
    },
    {
      q: lang === 'ar' ? 'كم يستغرق التوصيل داخل السعودية؟' : 'How long does delivery take inside Saudi Arabia?',
      a: lang === 'ar' ? 'يستغرق التوصيل عادة من 2 إلى 5 أيام عمل.' : 'Delivery typically takes 2 to 5 business days.'
    },
    {
      q: lang === 'ar' ? 'هل يمكنني إرجاع أو استبدال المنتجات؟' : 'Can I return or exchange products?',
      a: lang === 'ar' ? 'نعم، يرجى مراجعة سياسة الاسترجاع الخاصة بنا.' : 'Yes, please review our return and exchange policy.'
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-100 rounded-[20px] overflow-hidden transition-all duration-200"
          >
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-start focus:outline-none"
            >
              <span className="font-bold text-gray-900">{faq.q}</span>
              <span className={`text-[#21c45d] text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            <div 
              className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-gray-500 text-sm">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}