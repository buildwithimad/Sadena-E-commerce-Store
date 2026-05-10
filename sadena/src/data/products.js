/**
 * Data layer for the demo storefront.
 * Keep this file framework-agnostic so it can be imported from Server Components.
 */

export const CATEGORY_IDS = /** @type {const} */ ([
  'natural-care',
  'henna-products',
  'natural-oils',
  'skin-care',
  'kids-products',
  'offers',
]);

export const CATEGORIES = [
  {
    id: 'natural-care',
    label: 'Natural Care',
    labelAr: 'العناية الطبيعية',
    description: 'Daily essentials made from nature-first ingredients.',
    descriptionAr: 'أساسيات يومية بمكونات طبيعية.',
    image:
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'henna-products',
    label: 'Henna Products',
    labelAr: 'منتجات الحناء',
    description: 'Traditional henna blends for hair & hands.',
    descriptionAr: 'خلطات حناء تقليدية للشعر واليدين.',
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'natural-oils',
    label: 'Natural Oils',
    labelAr: 'الزيوت الطبيعية',
    description: 'Cold‑pressed oils for scalp, skin, and body.',
    descriptionAr: 'زيوت معصورة على البارد لفروة الرأس والبشرة.',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'skin-care',
    label: 'Skin Care',
    labelAr: 'العناية بالبشرة',
    description: 'Gentle routines that glow — no harsh extras.',
    descriptionAr: 'روتين لطيف لبشرة أكثر إشراقاً.',
    image:
      'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'kids-products',
    label: 'Kids Products',
    labelAr: 'منتجات الأطفال',
    description: 'Mild, fragrance‑light formulas for little ones.',
    descriptionAr: 'تركيبات لطيفة وخفيفة للأطفال.',
    image:
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 'offers',
    label: 'Offers',
    labelAr: 'العروض',
    description: 'Bundles and seasonal discounts.',
    descriptionAr: 'باقات وخصومات موسمية.',
    image:
      'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=1200&q=80&auto=format&fit=crop',
  },
];

/** @type {Record<string, (typeof CATEGORIES)[number]>} */
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} description
 * @property {string} shortDescription
 * @property {number} price
 * @property {number=} discountPrice
 * @property {"SAR"} currency
 * @property {string[]} images
 * @property {string} category
 * @property {string[]} tags
 * @property {number} stock
 * @property {string} sku
 * @property {number} rating
 * @property {number} reviewsCount
 * @property {string[]} benefits
 * @property {string[]} usage
 * @property {string[]=} ingredients
 * @property {boolean} isFeatured
 * @property {boolean} isBestSeller
 * @property {boolean} isOnSale
 * @property {Date} createdAt
 */



export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aisha Al‑Harbi',
    location: 'Riyadh',
    rating: 5,
    text: 'The henna is super fine and easy to mix. The stain came out even and the hair felt softer after rinsing.',
    product: 'Pure Henna Powder',
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
  {
    id: 2,
    name: 'Noor Ahmed',
    location: 'Jeddah',
    rating: 5,
    text: 'Black seed oil has become a weekly staple. A few drops go a long way and it’s not heavy.',
    product: 'Black Seed Oil',
    avatar: 'https://i.pravatar.cc/100?img=11',
  },
  {
    id: 3,
    name: 'Sara Saleh',
    location: 'Dammam',
    rating: 5,
    text: 'The bundle is perfect for starting a routine. Love the premium feel and fast delivery.',
    product: 'Henna + Oils Bundle',
    avatar: 'https://i.pravatar.cc/100?img=31',
  },
];

export function formatPriceSAR(amount, lang = 'en') {
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProductById(id) {
  return PRODUCTS?.find((p) => p?.id === String(id)) || null;
}

export function getProductBySlug(slug) {
  return PRODUCTS?.find((p) => p?.slug === String(slug)) || null;
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS?.filter((p) => p?.category === category);
}

export function getBestSellers(limit = 4) {
  return PRODUCTS?.filter((p) => p?.isBestSeller)?.slice(0, limit);
}

export function getFeatured(limit = 4) {
  return PRODUCTS?.filter((p) => p?.isFeatured)?.slice(0, limit);
}

export function getOffers(limit = 4) {
  return PRODUCTS?.filter((p) => p?.isOnSale)?.slice(0, limit);
}

export const TRANSLATIONS = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      contact: 'Contact',
      cart: 'Cart',
      wishlist: 'Wishlist',
    },
    hero: {
      eyebrow: 'Natural beauty essentials',
      headline: 'Your Natural Beauty Starts with Sadina',
      sub: 'Safe, original products designed to care for your skin without harmful ingredients',
      cta: 'Shop Now',
      ctaSecondary: 'Discover More',
    },
    categories: {
      heading: 'Shop by Your Needs',
      sub: 'Curated natural care — no clutter.',
    },
    newArrivals: {
      heading: 'New from Sadina',
      sub: 'Discover the latest additions carefully selected for your beauty routine',
      cta: 'Get Started',
    },
    weeklyOffer: {
      heading: "This Week's Special",
      sub: 'A featured product at an exclusive price for a limited time',
    },
    bestSellers: {
      heading: 'Loved by Our Customers',
      sub: 'Top-selling and highest-rated trusted choices for real results',
    },
    featured: {
      heading: "Sadina's Picks",
      sub: 'Handpicked products we recommend for you',
      addToCart: 'Add to Cart',
      quickAdd: 'Quick Add',
      viewAll: 'View all products',
    },
    specialSelections: {
      heading: 'Special Selections',
      sub: 'A unique collection for a premium care experience',
    },
    valueProps: {
      shipping: { title: 'Delivery across Saudi Arabia', desc: 'Fast and reliable shipping to all regions' },
      returns: { title: '100% original products', desc: 'Guaranteed authentic selections' },
      quality: { title: 'Secure payment options', desc: 'Mada, Visa, MasterCard, Apple Pay, STC Pay' },
      support: { title: 'Dedicated customer support', desc: 'Available around the clock to assist you' },
    },
    offers: {
      heading: "Offers You Don't Want to Miss",
      sub: "Limited-time deals grab them before they're gone",
    },
    testimonials: {
      heading: 'What Our Customers Say',
    },
    faq: {
      heading: 'Everything You Need to Know',
    },
    blogs: {
      heading: 'Beauty Tips from Sadina',
      sub: 'Learn how to care for your skin and choose what suits you best',
      cta: 'Read More',
    },
    wishlist: {
      heading: 'My Wishlist',
      sub: "Products you've saved for later.",
      empty: 'Your wishlist is empty',
      emptyDesc: 'Save products you like for easy access later.',
      addToCart: 'Add to Cart',
      remove: 'Remove',
      continueShopping: 'Continue Shopping',
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptyDesc: 'Add a few essentials to get started.',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      shippingFree: 'FREE',
      checkout: 'Checkout',
      continueShopping: 'Continue shopping',
      remove: 'Remove',
      orderTotal: 'Total',
      freeShippingQualified: 'You qualify for free shipping!',
      addMoreForFreeShipping: 'Add {amount} more for free shipping',
    },
    products: {
      heading: 'Shop all products',
      sub: 'Natural care for hair, skin, and daily routines.',
      filter: 'Filter',
      sort: 'Sort',
      sortOptions: {
        featured: 'Featured',
        priceLow: 'Price: low to high',
        priceHigh: 'Price: high to low',
        newest: 'Newest',
        rating: 'Top rated',
      },
      allCategories: 'All categories',
      showing: 'Showing',
      products: 'products',
    },
    productDetail: {
      addToCart: 'Add to Cart',
      addedToCart: 'Added',
      quantity: 'Quantity',
      description: 'Description',
      benefits: 'Benefits',
      usage: 'How to use',
      ingredients: 'Ingredients',
      reviews: 'Reviews',
      relatedProducts: 'You may also like',
      inStock: 'In stock',
      outOfStock: 'Out of stock',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
    },
    footer: {
      tagline: 'Sadina is your destination for natural beauty care. We offer carefully selected, original products designed to give you a safe and effective self-care experience that enhances your natural beauty with confidence.',
      shop: 'Shop',
      help: 'Help',
      legal: 'Legal',
      links: {
        products: 'All products',
        offers: 'Offers',
        contact: 'Contact Us',
        privacy: 'Privacy Policy',
        terms: 'Return & Exchange Policy',
      },
      copyright: '© 2026 Sadina. All rights reserved.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      contact: 'تواصل معنا',
      cart: 'السلة',
      wishlist: 'المفضلة',
    },
    hero: {
      eyebrow: 'أساسيات الجمال الطبيعي',
      headline: 'أفضل المنتجات من سادينا',
      sub: 'اكتشفي منتجات سادينا الخالية من المواد الكيميائية الضارة',
      cta: 'تسوق الآن',
      ctaSecondary: 'اكتشفي المزيد',
    },
    categories: {
      heading: 'تسوقي حسب احتياجك',
      sub: 'عناية طبيعية مختارة بعناية.',
    },
    newArrivals: {
      heading: 'جديد سادينا',
      sub: 'اكتشفي أحدث الإضافات المختارة بعناية لروتين جمالك',
      cta: 'ابدئي الآن',
    },
    weeklyOffer: {
      heading: 'عرض هذا الأسبوع',
      sub: 'منتج مميز بسعر حصري لفترة محدودة',
    },
    bestSellers: {
      heading: 'الأكثر طلباً من عملائنا',
      sub: 'الخيارات الأكثر مبيعاً والأعلى تقييماً لنتائج حقيقية',
    },
    featured: {
      heading: 'مختارات سادينا',
      sub: 'منتجات نوصي بها خصيصاً لك',
      addToCart: 'أضف إلى السلة',
      quickAdd: 'إضافة سريعة',
      viewAll: 'عرض جميع المنتجات',
    },
    specialSelections: {
      heading: 'مختارات خاصة',
      sub: 'مجموعة فريدة لتجربة عناية فاخرة',
    },
    valueProps: {
      shipping: { title: 'نغطي جميع مدن المملكة', desc: 'التوصيل لجميع مناطق المملكة في وقت قياسي' },
      returns: { title: 'منتجات أصلية 100%', desc: 'نتعامل فقط مع المنتجات المضمونة والأصلية' },
      quality: { title: 'خيارات دفع متعددة', desc: 'مدى، فيزا، ماستركارد، آبل باي، STC Pay' },
      support: { title: 'خدمة عملاء', desc: 'تخدمك بعيوننا على مدار 24 ساعة' },
    },
    offers: {
      heading: 'عروض لا تفوتك',
      sub: 'صفقات لفترة محدودة، احصلي عليها قبل نفادها',
    },
    testimonials: {
      heading: 'آراء العملاء',
    },
    faq: {
      heading: 'كل ما تحتاجين معرفته',
    },
    blogs: {
      heading: 'نصائح الجمال من سادينا',
      sub: 'تعلمي كيفية العناية ببشرتك واختيار ما يناسبك',
      cta: 'اقرأ المزيد',
    },
    wishlist: {
      heading: 'مفضلتي',
      sub: 'المنتجات التي حفظتها لاحقاً.',
      empty: 'مفضلتك فارغة',
      emptyDesc: 'احفظ المنتجات التي تعجبك للوصول السهل لاحقاً.',
      addToCart: 'أضف إلى السلة',
      remove: 'حذف',
      continueShopping: 'متابعة التسوق',
    },
    cart: {
      title: 'سلتك',
      empty: 'سلتك فارغة',
      emptyDesc: 'أضف بعض الأساسيات للبدء.',
      subtotal: 'المجموع',
      shipping: 'الشحن',
      shippingFree: 'مجاني',
      checkout: 'إتمام الشراء',
      continueShopping: 'مواصلة التسوق',
      remove: 'حذف',
      orderTotal: 'الإجمالي',
      freeShippingQualified: 'أنت مؤهل للشحن المجاني!',
      addMoreForFreeShipping: 'أضف {amount} للحصول على الشحن المجاني',
    },
    products: {
      heading: 'تسوق جميع المنتجات',
      sub: 'عناية طبيعية للشعر والبشرة والروتين اليومي.',
      filter: 'تصفية',
      sort: 'ترتيب',
      sortOptions: {
        featured: 'مميز',
        priceLow: 'السعر: من الأقل',
        priceHigh: 'السعر: من الأعلى',
        newest: 'الأحدث',
        rating: 'الأعلى تقييماً',
      },
      allCategories: 'جميع الفئات',
      showing: 'عرض',
      products: 'منتج',
    },
    productDetail: {
      addToCart: 'أضف إلى السلة',
      addedToCart: 'تمت الإضافة',
      quantity: 'الكمية',
      description: 'الوصف',
      benefits: 'الفوائد',
      usage: 'طريقة الاستخدام',
      ingredients: 'المكونات',
      reviews: 'التقييمات',
      relatedProducts: 'قد يعجبك أيضاً',
      inStock: 'متوفر',
      outOfStock: 'غير متوفر',
      addToWishlist: 'أضف إلى المفضلة',
      removeFromWishlist: 'حذف من المفضلة',
    },
    footer: {
      tagline: 'في سادينا نقدم لكم مجموعة متميزة من المنتجات التجميلية الطبيعية والمختارة بعناية لمنحك تجربة عناية آمنة وفعالة، تبرز جمالك الطبيعي بكل ثقة.',
      shop: 'المتجر',
      help: 'روابط مهمة',
      legal: 'قانوني',
      links: {
        products: 'المنتجات',
        offers: 'عروض خاصة',
        contact: 'تواصل معنا',
        privacy: 'سياسة الخصوصية',
        terms: 'سياسة الاستبدال والإسترجاع',
      },
      copyright: '© 2026 سادينا. جميع الحقوق محفوظة.',
    },
  },
};