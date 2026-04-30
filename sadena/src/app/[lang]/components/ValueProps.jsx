import Icon from '@/components/ui/AppIcon';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function ValueProps({ lang, t }) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Data extracted directly from the provided image
  const props = [
    { 
      icon: 'CreditCardIcon', 
      title: t?.valueProps?.payment?.title || 'Multiple payment options',
      desc: t?.valueProps?.payment?.desc || 'Mada, Stc Pay, Apple Pay, MasterCard, Visa'
    },
    { 
      icon: 'ChatBubbleLeftRightIcon', 
      title: t?.valueProps?.contact?.title || 'Contact us',
      desc: t?.valueProps?.contact?.desc || 'WhatsApp is dedicated to 24-hour customer service.'
    },
    { 
      icon: 'MapPinIcon', 
      title: t?.valueProps?.coverage?.title || 'We cover all cities in the Kingdom of Saudi Arabia',
      desc: t?.valueProps?.coverage?.desc || 'Delivery to all regions of the Kingdom in record time'
    },
    { 
      icon: 'CheckBadgeIcon', // Or 'LeafIcon' if available in your AppIcon set
      title: t?.valueProps?.genuine?.title || '100% genuine products',
      desc: t?.valueProps?.genuine?.desc || 'We only deal in guaranteed and genuine products.'
    },
    { 
      icon: 'PhoneIcon', 
      title: t?.valueProps?.support?.title || 'Customer Service',
      desc: t?.valueProps?.support?.desc || 'We are at your service around the clock.'
    },
    { 
      icon: 'TruckIcon', 
      title: t?.valueProps?.shipping?.title || 'Shipping and Delivery',
      desc: t?.valueProps?.shipping?.desc || 'We have fast and reliable shipping and delivery methods.'
    },
  ];

  return (
    <section 
      dir={dir} 
      // Very light background so the white cards pop cleanly
      className="py-16 sm:py-24 bg-[var(--secondary)]/30 relative z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID: 1 on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {props?.map((prop, i) => (
            <RevealOnScroll 
              key={prop?.title} 
              delay={i + 1} 
              // Flat white card, no rounded corners to match the clean aesthetic
              className="group flex flex-col items-center text-center p-8 sm:p-10 bg-white rounded-none border border-[var(--border)]/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)]"
            >
              
              {/* Green Icon Circle */}
              <div className="w-14 h-14 bg-[var(--primary)] text-white rounded-full flex items-center justify-center mb-6 shadow-sm transition-transform duration-500 group-hover:scale-110">
                <Icon name={prop?.icon} size={24} variant="outline" />
              </div>
              
              {/* Typography */}
              <div>
                <h3 className="text-[15px] sm:text-base font-semibold text-[var(--foreground)] tracking-wide mb-2.5">
                  {prop?.title}
                </h3>
                <p className="text-[13px] sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-[280px] mx-auto">
                  {prop?.desc}
                </p>
              </div>

            </RevealOnScroll>
          ))}
        </div>
        
      </div>
    </section>
  );
}