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

/** @type {Product[]} */
export const PRODUCTS = [
  {
    id: 'P-1001',
    name: 'Pure Henna Powder',
    nameAr: 'مسحوق الحناء النقي',
    slug: 'pure-henna-powder',
    shortDescription: '100% natural henna powder for hair and hands.',
    shortDescriptionAr: 'مسحوق حناء طبيعي 100% للشعر واليدين.',
    description:
      'Finely sifted, single‑origin henna powder with a smooth stain and an even application. Ideal for hair conditioning, natural tinting, and traditional body art.',
    descriptionAr:
      'مسحوق حناء منخول جيداً من مصدر واحد مع صبغة ناعمة وتطبيق متساوي. مثالي لترطيب الشعر والصبغة الطبيعية وفن الجسم التقليدي.',
    price: 39,
    discountPrice: 29,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1620916566393-1c6a7d0f775f?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80&auto=format&fit=crop',
    ],
    category: 'henna-products',
    tags: ['henna', 'hair', 'traditional'],
    stock: 48,
    sku: 'SAD-HEN-001',
    rating: 4.8,
    reviewsCount: 312,
    benefits: ['Natural conditioning', 'Smooth, even stain', 'Finely sifted for easy mixing'],
    benefitsAr: ['ترطيب طبيعي', 'صبغة ناعمة متساوية', 'منخول جيداً للخلط السهل'],
    usage: [
      'Mix with warm water to a yogurt-like texture.',
      'Rest paste 30–60 minutes.',
      'Apply to hair/skin and rinse after desired time.',
    ],
    usageAr: [
      'اخلط مع الماء الدافئ للحصول على قوام الزبادي.',
      'اترك العجينة 30-60 دقيقة.',
      'ضع على الشعر أو الجلد واغسل بعد الوقت المرغوب.',
    ],
    ingredients: ['Lawsonia inermis (Henna) leaf powder'],
    ingredientsAr: ['مسحوق أوراق الحناء (Lawsonia inermis)'],
    isFeatured: true,
    isBestSeller: true,
    isOnSale: true,
    createdAt: new Date('2026-02-10'),
  },
  {
    id: 'P-1002',
    name: 'Black Seed Oil (Cold‑Pressed)',
    nameAr: 'زيت الحبة السوداء (معصور بارداً)',
    slug: 'black-seed-oil-cold-pressed',
    shortDescription: 'Nourishing oil for scalp, skin, and beard care.',
    shortDescriptionAr: 'زيت مغذي لرعاية فروة الرأس والبشرة واللحية.',
    description:
      'Cold‑pressed Nigella sativa oil with a rich, herbal aroma. A few drops help support a healthy-looking scalp and soften dry skin.',
    descriptionAr:
      'زيت النيجيلا ساتيفا المعصور بارداً برائحة عشبية غنية. بضع قطرات تساعد في دعم فروة رأس صحية وتلطيف البشرة الجافة.',
    price: 55,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1615486364462-ef6363ad90d5?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1200&q=80&auto=format&fit=crop',
    ],
    category: 'natural-oils',
    tags: ['oil', 'scalp', 'skin'],
    stock: 32,
    sku: 'SAD-OIL-002',
    rating: 4.7,
    reviewsCount: 184,
    benefits: ['Deep nourishment', 'Supports scalp comfort', 'Multipurpose for hair & skin'],
    benefitsAr: ['تغذية عميقة', 'يدعم راحة فروة الرأس', 'متعدد الاستخدامات للشعر والبشرة'],
    usage: [
      'Warm 2–3 drops between palms.',
      'Massage into scalp or apply to dry areas.',
      'Use 3–4 times per week.',
    ],
    usageAr: [
      'سخن 2-3 قطرات بين راحتي اليدين.',
      'ادهن على فروة الرأس أو ضع على المناطق الجافة.',
      'استخدم 3-4 مرات أسبوعياً.',
    ],
    ingredients: ['Nigella sativa (Black seed) oil'],
    ingredientsAr: ['زيت الحبة السوداء (Nigella sativa)'],
    isFeatured: true,
    isBestSeller: false,
    isOnSale: false,
    createdAt: new Date('2026-01-22'),
  },
  {
    id: 'P-1003',
    name: 'Herbal Hair Mask Blend',
    nameAr: 'خلطة قناع الشعر العشبي',
    slug: 'herbal-hair-mask-blend',
    shortDescription: 'A plant-based mask for soft, shiny hair.',
    shortDescriptionAr: 'قناع نباتي لشعر ناعم ولامع.',
    description:
      'A balanced blend of botanicals traditionally used for hair softness and shine. Mix with water, yogurt, or oil and apply weekly for a stronger, smoother feel.',
    descriptionAr:
      'خلطة متوازنة من النباتات المستخدمة تقليدياً لنعومة الشعر ولمعانه. اخلط مع الماء أو الزبادي أو الزيت وضع أسبوعياً لإحساس أقوى وأنعم.',
    price: 49,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1615396899839-c99c121888b0?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80&auto=format&fit=crop',
    ],
    category: 'natural-care',
    tags: ['hair', 'mask', 'herbal'],
    stock: 24,
    sku: 'SAD-CARE-003',
    rating: 4.6,
    reviewsCount: 97,
    benefits: ['Softens and smooths', 'Weekly reset for dull hair', 'Easy to mix'],
    benefitsAr: ['ينعم ويسهل', 'إعادة ضبط أسبوعية للشعر الباهت', 'سهل الخلط'],
    usage: [
      'Mix 2 tbsp with warm water.',
      'Apply to damp hair 20–30 min.',
      'Rinse thoroughly and shampoo if needed.',
    ],
    usageAr: [
      'اخلط 2 ملعقة كبيرة مع الماء الدافئ.',
      'ضع على الشعر الرطب 20-30 دقيقة.',
      'اغسل جيداً واستخدم الشامبو إذا لزم الأمر.',
    ],
    ingredients: ['Herbal botanical blend (see label)'],
    ingredientsAr: ['خلطة نباتية عشبية (انظر الملصق)'],
    isFeatured: false,
    isBestSeller: true,
    isOnSale: false,
    createdAt: new Date('2026-03-05'),
  },
  {
    id: 'P-1004',
    name: 'Gentle Facial Cleanser',
    nameAr: 'منظف وجه لطيف',
    slug: 'gentle-facial-cleanser',
    shortDescription: 'A mild daily cleanser that doesn’t strip the skin.',
    shortDescriptionAr: 'منظف يومي خفيف لا يجرد البشرة.',
    description:
      'A low-foam cleanser designed to remove sunscreen and daily buildup while keeping the skin comfortable. Best for normal to dry skin.',
    descriptionAr:
      'منظف منخفض الرغوة مصمم لإزالة واقي الشمس والتراكم اليومي مع الحفاظ على راحة البشرة. الأفضل للبشرة العادية إلى الجافة.',
    price: 62,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1612810436541-336e99f49b11?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228724-4b5b0ecb9d0a?w=1200&q=80&auto=format&fit=crop',
    ],
    category: 'skin-care',
    tags: ['cleanser', 'skin', 'daily'],
    stock: 19,
    sku: 'SAD-SKIN-004',
    rating: 4.5,
    reviewsCount: 64,
    benefits: ['Comfortable cleanse', 'Non-stripping feel', 'Works with sensitive routines'],
    benefitsAr: ['تنظيف مريح', 'إحساس غير مجرد', 'يعمل مع الروتينات الحساسة'],
    usage: [
      'Massage onto damp skin 30–45 seconds.',
      'Rinse with lukewarm water.',
      'Follow with moisturizer.',
    ],
    usageAr: ['ادهن على البشرة الرطبة 30-45 ثانية.', 'اغسل بالماء الفاتر.', 'اتبع بمرطب.'],
    ingredients: ['Aqua', 'Glycerin', 'Coco-glucoside', 'Panthenol'],
    ingredientsAr: ['الماء', 'الجليسرين', 'كوكو جلوكوزيد', 'بانثينول'],
    isFeatured: true,
    isBestSeller: false,
    isOnSale: false,
    createdAt: new Date('2026-03-14'),
  },
  {
    id: 'P-1005',
    name: 'Kids Soothing Body Lotion',
    nameAr: 'لوشن جسم مهدئ للأطفال',
    slug: 'kids-soothing-body-lotion',
    shortDescription: 'Light, fast-absorbing moisture for delicate skin.',
    shortDescriptionAr: 'ترطيب خفيف سريع الامتصاص للبشرة الحساسة.',
    description:
      'A gentle lotion made for everyday use. Lightweight texture that absorbs quickly and leaves the skin soft—ideal after bath time.',
    descriptionAr:
      'لوشن لطيف مصنوع للاستخدام اليومي. قوام خفيف يمتص بسرعة ويترك البشرة ناعمة — مثالي بعد وقت الاستحمام.',
    price: 44,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228724-4b5b0ecb9d0a?w=1200&q=80&auto=format&fit=crop',
    ],
    category: 'kids-products',
    tags: ['kids', 'lotion', 'daily'],
    stock: 28,
    sku: 'SAD-KIDS-005',
    rating: 4.7,
    reviewsCount: 41,
    benefits: ['Fast absorption', 'Soft feel', 'Everyday gentle moisture'],
    benefitsAr: ['امتصاص سريع', 'إحساس ناعم', 'ترطيب لطيف يومي'],
    usage: ['Apply to clean, dry skin.', 'Use after bath or as needed.'],
    usageAr: ['ضع على البشرة النظيفة الجافة.', 'استخدم بعد الاستحمام أو حسب الحاجة.'],
    ingredients: ['Aqua', 'Shea butter', 'Oat extract', 'Panthenol'],
    ingredientsAr: ['الماء', 'زبدة الشيا', 'مستخلص الشوفان', 'بانثينول'],
    isFeatured: false,
    isBestSeller: false,
    isOnSale: false,
    createdAt: new Date('2026-02-25'),
  },
  {
    id: 'P-1006',
    name: 'Henna + Oils Bundle',
    nameAr: 'باقة الحناء + الزيوت',
    slug: 'henna-oils-bundle',
    shortDescription: 'A simple bundle for hair rituals: henna + oil.',
    shortDescriptionAr: 'باقة بسيطة لطقوس الشعر: حناء + زيت.',
    description:
      'A value bundle combining Pure Henna Powder and Black Seed Oil. Great for starting a weekly hair ritual with nature-first staples.',
    descriptionAr:
      'باقة قيمة تجمع مسحوق الحناء النقي وزيت الحبة السوداء. رائعة لبدء طقوس الشعر الأسبوعية بأساسيات طبيعية.',
    price: 94,
    discountPrice: 79,
    currency: 'SAR',
    images: [
      'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615486364462-ef6363ad90d5?w=1200&q=80&auto=format&fit=crop',
    ],
    category: 'offers',
    tags: ['bundle', 'offer', 'henna', 'oil'],
    stock: 12,
    sku: 'SAD-OFF-006',
    rating: 4.9,
    reviewsCount: 58,
    benefits: ['Bundle savings', 'Great starter ritual', 'Best-selling staples'],
    benefitsAr: ['توفير الباقات', 'طقوس مبتدئة رائعة', 'أساسيات الأكثر مبيعاً'],
    usage: ['Use oil 2–3 times weekly.', 'Use henna every 2–4 weeks as desired.'],
    usageAr: ['استخدم الزيت 2-3 مرات أسبوعياً.', 'استخدم الحناء كل 2-4 أسابيع حسب الرغبة.'],
    ingredients: ['Varies by included products'],
    ingredientsAr: ['تختلف حسب المنتجات المضمنة'],
    isFeatured: true,
    isBestSeller: true,
    isOnSale: true,
    createdAt: new Date('2026-04-01'),
  },
];

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
      headline: 'Simple rituals. Real results.',
      sub: 'Nature-first care for hair, skin, and the whole family — curated for daily use in Saudi Arabia.',
      cta: 'Shop Best Sellers',
      ctaSecondary: 'Browse Categories',
    },
    categories: {
      heading: 'Shop by Category',
      sub: 'Curated natural care — no clutter.',
    },
    bestSellers: {
      heading: 'Best Sellers',
      sub: 'Loved staples customers reorder.',
    },
    featured: {
      heading: 'Featured',
      sub: 'Editor picks for a balanced routine.',
      addToCart: 'Add to Cart',
      quickAdd: 'Quick Add',
      viewAll: 'View all products',
    },
    valueProps: {
      shipping: { title: 'Fast delivery', desc: 'Delivery across Saudi Arabia' },
      returns: { title: 'Easy returns', desc: 'Simple returns policy' },
      quality: { title: 'Quality first', desc: 'Carefully selected products' },
      support: { title: 'Support', desc: 'We’re here to help' },
    },
    offers: {
      heading: 'Offers',
      sub: 'Bundles and seasonal savings.',
    },
    testimonials: {
      heading: 'Customer stories',
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
      tagline: 'Natural care, thoughtfully curated.',
      shop: 'Shop',
      help: 'Help',
      legal: 'Legal',
      links: {
        products: 'All products',
        offers: 'Offers',
        contact: 'Contact',
        privacy: 'Privacy policy',
        terms: 'Terms of service',
      },
      copyright: '© 2026 Sadena. All rights reserved.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      products: 'منتجات',
      contact: 'تواصل معنا',
      cart: 'السلة',
      wishlist: 'المفضلة',
    },
    hero: {
      eyebrow: 'أساسيات الجمال الطبيعي',
      headline: 'روتين بسيط. نتائج ملموسة.',
      sub: 'عناية طبيعية للشعر والبشرة والعائلة — مختارة للاستخدام اليومي في السعودية.',
      cta: 'تسوق الأكثر مبيعاً',
      ctaSecondary: 'تصفح الفئات',
    },
    categories: {
      heading: 'تسوق حسب الفئة',
      sub: 'عناية طبيعية مختارة بدون ازدحام.',
    },
    bestSellers: {
      heading: 'الأكثر مبيعاً',
      sub: 'أساسيات يعيد العملاء طلبها.',
    },
    featured: {
      heading: 'مختاراتنا',
      sub: 'ترشيحات لبناء روتين متوازن.',
      addToCart: 'أضف إلى السلة',
      quickAdd: 'إضافة سريعة',
      viewAll: 'عرض جميع المنتجات',
    },
    valueProps: {
      shipping: { title: 'توصيل سريع', desc: 'توصيل داخل المملكة' },
      returns: { title: 'إرجاع سهل', desc: 'سياسة إرجاع بسيطة' },
      quality: { title: 'جودة أولاً', desc: 'منتجات مختارة بعناية' },
      support: { title: 'دعم', desc: 'نساعدك بكل سرور' },
    },
    offers: {
      heading: 'العروض',
      sub: 'باقات وتوفير موسمي.',
    },
    testimonials: {
      heading: 'تجارب العملاء',
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
      tagline: 'عناية طبيعية مختارة بعناية.',
      shop: 'المتجر',
      help: 'مساعدة',
      legal: 'قانوني',
      links: {
        products: 'جميع المنتجات',
        offers: 'العروض',
        contact: 'تواصل معنا',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
      },
      copyright: '© 2026 سادينا. جميع الحقوق محفوظة.',
    },
  },
};
