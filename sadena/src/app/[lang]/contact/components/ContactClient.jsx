'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function ContactClient({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setSubmitted(true);
  };

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-20">
      
      {/* BREADCRUMB */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <nav className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          <Link href={`/${lang}`} className="hover:text-[var(--foreground)] transition-colors">
            {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)]">
            {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </span>
        </nav>
      </div>

      {/* HEADER: Brush Stroke Style */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24 flex flex-col items-center">
        <RevealOnScroll className="flex justify-center">
          <div className="relative inline-flex items-center justify-center px-16 py-4">
            <div className="absolute inset-0 bg-[#93bfa2] opacity-60 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-[3px]" />
            <div className="absolute inset-1 bg-[#7eb08d] opacity-80 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] blur-[2px] transform -rotate-1" />
            <div className="absolute inset-2 bg-[#6b9e7a] opacity-90 rounded-[40%_60%_50%_50%/40%_50%_40%_60%] blur-[1px]" />
            
            <h1 className="relative z-10 font-display text-4xl sm:text-5xl font-bold text-black tracking-tight text-center">
              {lang === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
            </h1>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={1}>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-8 text-center max-w-2xl font-medium tracking-wide">
            {lang === 'ar' 
              ? 'نحن هنا لمساعدتك. فريقنا متاح من الاثنين إلى الجمعة، ونرد عادةً خلال يوم عمل واحد.' 
              : 'We are here to help. Our team is available Monday to Friday, and we typically respond within one business day.'}
          </p>
        </RevealOnScroll>
      </div>

      {/* MAIN CONTENT - Split Layout */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: Contact Information */}
          <div className="flex-1 lg:max-w-sm">
            <RevealOnScroll>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)] mb-8 border-b border-[var(--border)] pb-4">
                {lang === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
              </h2>
              
              <div className="space-y-10">
                {/* Email */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-none bg-[var(--secondary)]/50 flex items-center justify-center shrink-0 border border-[var(--border)]">
                    <Icon name="EnvelopeIcon" size={20} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-[var(--foreground)] mb-1">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {lang === 'ar' ? 'للاستفسارات العامة والدعم:' : 'For general inquiries & support:'}<br/>
                      <a href="mailto:support@sadena.com" className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium transition-colors">
                        support@sadena.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-none bg-[var(--secondary)]/50 flex items-center justify-center shrink-0 border border-[var(--border)]">
                    <Icon name="PhoneIcon" size={20} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-[var(--foreground)] mb-1">
                      {lang === 'ar' ? 'الهاتف' : 'Phone'}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {lang === 'ar' ? 'من الاثنين إلى الجمعة، ٩ ص - ٦ م:' : 'Mon-Fri, 9am - 6pm:'}<br/>
                      <a href="tel:+966501234567" className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium transition-colors" dir="ltr">
                        +966 50 123 4567
                      </a>
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-none bg-[var(--secondary)]/50 flex items-center justify-center shrink-0 border border-[var(--border)]">
                    <Icon name="MapPinIcon" size={20} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-lg text-[var(--foreground)] mb-1">
                      {lang === 'ar' ? 'المقر الرئيسي' : 'Headquarters'}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {lang === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}<br/>
                      {lang === 'ar' ? 'طريق الملك فهد' : 'King Fahd Road'}
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="flex-[1.5]">
            <RevealOnScroll delay={1}>
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center py-20 px-8 bg-[var(--secondary)]/30 border border-[var(--border)] text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-6">
                    <Icon name="CheckCircleIcon" size={40} variant="solid" className="text-[var(--primary)]" />
                  </div>
                  <h2 className="font-display text-3xl font-medium text-[var(--foreground)] mb-3">
                    {lang === 'ar' ? 'شكراً لتواصلك معنا!' : 'Message Received!'}
                  </h2>
                  <p className="text-[var(--muted-foreground)] mb-8 max-w-sm">
                    {lang === 'ar' ? 'لقد استلمنا رسالتك وسنرد عليك في أقرب وقت ممكن (عادة خلال يوم عمل واحد).' : "We have received your message and will get back to you as soon as possible (usually within one business day)."}
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold uppercase tracking-widest text-[var(--primary)] hover:text-[var(--foreground)] transition-colors border-b-2 border-[var(--primary)] hover:border-[var(--foreground)] pb-1"
                  >
                    {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                        {lang === 'ar' ? 'الاسم الأول' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-transparent border border-[var(--border)] text-[var(--foreground)] px-4 py-3.5 text-sm rounded-none focus:outline-none focus:border-[var(--primary)] transition-colors"
                        placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full bg-transparent border border-[var(--border)] text-[var(--foreground)] px-4 py-3.5 text-sm rounded-none focus:outline-none focus:border-[var(--primary)] transition-colors"
                        placeholder={lang === 'ar' ? 'example@email.com' : 'you@example.com'}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                      {lang === 'ar' ? 'الموضوع' : 'Subject'}
                    </label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-transparent border border-[var(--border)] text-[var(--foreground)] px-4 py-3.5 text-sm rounded-none focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer">
                        <option>{lang === 'ar' ? 'استفسار عن طلب' : 'Order Inquiry'}</option>
                        <option>{lang === 'ar' ? 'الإرجاع والاستبدال' : 'Returns & Exchanges'}</option>
                        <option>{lang === 'ar' ? 'معلومات المنتج' : 'Product Information'}</option>
                        <option>{lang === 'ar' ? 'أخرى' : 'Other'}</option>
                      </select>
                      <Icon name="ChevronDownIcon" size={14} className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none text-[var(--muted-foreground)]" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">
                      {lang === 'ar' ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full bg-transparent border border-[var(--border)] text-[var(--foreground)] px-4 py-3.5 text-sm rounded-none focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                      placeholder={lang === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-[var(--primary)] text-white py-4 text-xs font-bold tracking-widest uppercase rounded-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1a4a31] hover:-translate-y-1"
                    >
                      {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </RevealOnScroll>
          </div>

        </div>
      </div>
    </div>
  );
}