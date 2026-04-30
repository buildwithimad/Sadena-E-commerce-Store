export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const langs = ['en', 'ar'];
  const routes = ['', '/products', '/contact', '/privacy'];

  const urls = [];

  langs?.forEach((lang) => {
    routes?.forEach((route) => {
      urls?.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route === '/products' ? 0.8 : 0.5,
      });
    });
  });

  return urls;
}