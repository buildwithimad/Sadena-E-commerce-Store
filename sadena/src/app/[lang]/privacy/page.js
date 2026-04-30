

export async function generateMetadata({ params }) {
  const { lang = 'en' } = await params;
  return {
    title: lang === 'ar' ? 'سياسة الخصوصية — سادينا' : 'Privacy Policy — Sadena',
    description: lang === 'ar' ? 'سياسة الخصوصية لمتجر سادينا.' : 'Sadena privacy policy and terms of service.',
  };
}

export default async function PrivacyPage({ params }) {
  const { lang = 'en' } = await params;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const sections = lang === 'ar' ? [
    { title: 'المعلومات التي نجمعها', body: 'نجمع المعلومات التي تقدمها مباشرة لنا، مثل اسمك وعنوان بريدك الإلكتروني وعنوان الشحن عند إجراء عملية شراء أو التواصل معنا.' },
    { title: 'كيف نستخدم معلوماتك', body: 'نستخدم المعلومات التي نجمعها لمعالجة طلباتك وإرسال تأكيدات الطلبات وتقديم خدمة العملاء وتحسين تجربة التسوق لديك.' },
    { title: 'مشاركة المعلومات', body: 'نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف خارجية. يشمل ذلك شركاء الموقع والشركات التابعة لنا.' },
    { title: 'الأمان', body: 'نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف.' },
    { title: 'تواصل معنا', body: 'إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر صفحة الاتصال.' },
  ] : [
    { title: 'Information We Collect', body: 'We collect information you provide directly to us, such as your name, email address, and shipping address when making a purchase or contacting us.' },
    { title: 'How We Use Your Information', body: 'We use the information we collect to process your orders, send order confirmations, provide customer service, and improve your shopping experience.' },
    { title: 'Information Sharing', body: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This includes website partners and our affiliates.' },
    { title: 'Security', body: 'We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.' },
    { title: 'Contact Us', body: 'If you have questions about this privacy policy, please contact us through our contact page.' },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-background pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            {lang === 'ar' ? 'آخر تحديث: أبريل 2026' : 'Last updated: April 2026'}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
            {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
        </div>

        <div className="prose prose-neutral max-w-none space-y-10">
          {sections?.map((section, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-medium text-foreground mb-3">{section?.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-base">{section?.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}