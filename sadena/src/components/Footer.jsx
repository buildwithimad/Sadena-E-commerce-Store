import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { TRANSLATIONS } from '@/data/products';
import TestOrderButton from '@/components/TestOrderButton';

export default function Footer({ lang = 'en' }) {
  const t = TRANSLATIONS?.[lang]?.footer || TRANSLATIONS?.en?.footer;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <footer dir={dir} className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${lang}`} className="flex items-center gap-2.5 mb-4">
              <AppLogo size={102} className="brightness-0 invert" />
            </Link>
            <TestOrderButton />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {t?.tagline}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">{t?.shop}</h3>
            <ul className="space-y-3">
              {[
                { label: t?.links?.products, href: `/${lang}/products` },
                { label: t?.links?.offers, href: `/${lang}/products?category=offers` },
              ]?.map((l) => (
                <li key={l?.href}>
                  <Link href={l?.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">{t?.help}</h3>
            <ul className="space-y-3">
              {[
                { label: t?.links?.contact, href: `/${lang}/contact` },
              ]?.map((l) => (
                <li key={l?.label}>
                  <Link href={l?.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">{t?.legal}</h3>
            <ul className="space-y-3">
              {[
                { label: t?.links?.privacy, href: `/${lang}/privacy` },
                { label: t?.links?.terms, href: `/${lang}/privacy` },
              ]?.map((l) => (
                <li key={l?.label}>
                  <Link href={l?.href} className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {l?.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/30">{t?.copyright}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">Visa</span>
            <span className="text-xs text-white/30">Mastercard</span>
            <span className="text-xs text-white/30">PayPal</span>
            <span className="text-xs text-white/30">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}