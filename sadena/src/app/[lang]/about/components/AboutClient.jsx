'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function AboutClient({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Fallback content in case translations aren't fully set up in your data file yet
  const content = {
    heading: t?.about?.heading || (lang === 'ar' ? 'قصتنا' : 'Our Story'),
    sub: t?.about?.sub || (lang === 'ar' ? 'نؤمن بجمال الطبيعة وقوتها.' : 'We believe in the power and beauty of nature.'),
    missionTitle: t?.about?.missionTitle || (lang === 'ar' ? 'مهمتنا' : 'Our Mission'),
    missionText: t?.about?.missionText || (lang === 'ar' 
      ? 'في سادينا، نكرس جهودنا لتقديم أنقى منتجات العناية بالبشرة والشعر. كل منتج نصنعه يخلو من المواد الكيميائية الضارة، ومصمم لتغذية جمالك الطبيعي.'
      : 'At Sadena, we are dedicated to providing the purest skin and hair care products. Everything we create is free from harmful chemicals, designed to nourish your natural beauty.'),
    missionText2: t?.about?.missionText2 || (lang === 'ar'
      ? 'نحن نستورد مكوناتنا من أفضل المزارع العضوية، لنضمن لك جودة لا تضاهى ونتائج ملموسة من قلب الطبيعة.'
      : 'We source our ingredients from the finest organic farms, ensuring unmatched quality and visible results straight from the heart of nature.'),
    valuesHeading: t?.about?.valuesHeading || (lang === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'),
  };

  const values = [
    {
      icon: 'LeafIcon', // Or 'SparklesIcon'
      title: lang === 'ar' ? 'عضوي 100%' : '100% Organic',
      desc: lang === 'ar' ? 'مكونات طبيعية نقية خالية من الإضافات الكيميائية.' : 'Pure natural ingredients free from chemical additives.',
    },
    {
      icon: 'GlobeEuropeAfricaIcon',
      title: lang === 'ar' ? 'صديق للبيئة' : 'Eco-Friendly',
      desc: lang === 'ar' ? 'تغليف وممارسات مستدامة لحماية كوكبنا.' : 'Sustainable packaging and practices to protect our planet.',
    },
    {
      icon: 'HeartIcon',
      title: lang === 'ar' ? 'لم يجرب على الحيوانات' : 'Cruelty-Free',
      desc: lang === 'ar' ? 'نحن نحب الحيوانات، منتجاتنا آمنة وأخلاقية.' : 'We love animals; our products are ethical and never tested on them.',
    },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)] pt-24 pb-16 overflow-hidden mt-20">
      
      {/* BREADCRUMB */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <nav className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-[var(--muted-foreground)]">
          <Link href={`/${lang}`} className="hover:text-[var(--foreground)] transition-colors">
            {t?.nav?.home || (lang === 'ar' ? 'الرئيسية' : 'Home')}
          </Link>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)]">
            {content.heading}
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
              {content.heading}
            </h1>
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={1}>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base mt-8 text-center max-w-2xl font-medium tracking-wide uppercase">
            {content.sub}
          </p>
        </RevealOnScroll>
      </div>

      {/* STORY SECTION - Split Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-24 sm:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-stretch border border-[var(--border)]">
          
          {/* Text Side */}
          <div className="flex flex-col justify-center p-8 sm:p-16 lg:p-20 bg-[var(--secondary)]/30">
            <RevealOnScroll>
              <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--primary)] mb-6">
                {content.missionTitle}
              </h2>
              <p className="font-display text-3xl sm:text-4xl font-medium text-[var(--foreground)] leading-[1.3] mb-8">
                {lang === 'ar' ? 'الجمال الحقيقي يبدأ من الطبيعة.' : 'True beauty begins with nature.'}
              </p>
              <div className="space-y-6 text-[15px] sm:text-base text-[var(--muted-foreground)] leading-relaxed">
                <p>{content.missionText}</p>
                <p>{content.missionText2}</p>
              </div>
            </RevealOnScroll>
          </div>

          {/* Image Side - Sharp Edges */}
          <div className="relative min-h-[400px] lg:min-h-[600px] w-full bg-[var(--secondary)]">
            <Image
              src="https://images.pexels.com/photos/6724391/pexels-photo-6724391.jpeg" // Aesthetic organic skincare image
              alt="Sadena Natural Products"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          
        </div>
      </div>

      {/* CORE VALUES - Flat Minimalist Grid */}
      <div className="bg-[var(--secondary)]/20 py-24 sm:py-32 border-y border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll className="mb-16 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[var(--foreground)] tracking-tight">
              {content.valuesHeading}
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <RevealOnScroll key={i} delay={i + 1}>
                {/* Flat card, no shadow, sharp edges */}
                <div className="h-full bg-white border border-[var(--border)] p-10 flex flex-col items-center text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-[var(--primary)]">
                  <div className="w-16 h-16 rounded-none bg-[var(--secondary)] flex items-center justify-center mb-8 text-[var(--primary)]">
                    {/* Fallback to SparklesIcon if Leaf/Globe aren't in your AppIcon map */}
                    <Icon name="SparklesIcon" size={32} variant="outline" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-4 tracking-wide">
                    {val.title}
                  </h3>
                  <p className="text-[15px] text-[var(--muted-foreground)] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <RevealOnScroll>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-[var(--foreground)] mb-6">
            {lang === 'ar' ? 'جاهزة لتجربة الفرق؟' : 'Ready to experience the difference?'}
          </h2>
          <p className="text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto">
            {lang === 'ar' 
              ? 'تصفحي منتجاتنا العضوية وابدأي رحلتك نحو بشرة وشعر أكثر صحة.' 
              : 'Browse our organic products and start your journey to healthier skin and hair.'}
          </p>
          <Link
            href={`/${lang}/products`}
            className="inline-flex items-center justify-center gap-3 bg-[var(--primary)] text-white px-12 py-5 text-sm font-bold tracking-widest uppercase rounded-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1a4a31] hover:-translate-y-1"
          >
            {t?.hero?.cta || (lang === 'ar' ? 'تسوقي الآن' : 'Shop Now')}
            <Icon name="ArrowRightIcon" size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </Link>
        </RevealOnScroll>
      </div>

    </div>
  );
}