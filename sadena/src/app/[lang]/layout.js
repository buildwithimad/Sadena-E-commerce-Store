import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { WishlistProvider } from '@/context/WishlistContext';
import { UserProvider } from '@/context/UserContext';
import { getCategories } from '@/service/categoriesService';

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ar' }];
}

export default async function LangLayout({ children, params }) {
  const { lang = 'en' } = await params;
  
  // 🔥 FIX: Move this line inside the function
  const categories = await getCategories(lang); 

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const fontClass = lang === 'ar' ? 'lang-ar' : 'lang-en';

  return (
    <UserProvider>
      <WishlistProvider>
        <div dir={dir} lang={lang} className={`min-h-screen flex flex-col ${fontClass}`}>
          {/* Now categories is defined and safe to pass */}
          <Navbar lang={lang} categories={categories} />
          <CartDrawer lang={lang} />
          <main className="flex-1">{children}</main>
          <Footer lang={lang} />
        </div>
      </WishlistProvider>
    </UserProvider>
  );
}