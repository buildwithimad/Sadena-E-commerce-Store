import AnalyticsClient from './AnalyticsClient';

export const metadata = {
  title: 'Analytics | Admin Panel',
};

// In Next.js 15, params is a Promise
export default async function AnalyticsPage({ params }) {
  const { lang } = await params;

  return <AnalyticsClient lang={lang} />;
}