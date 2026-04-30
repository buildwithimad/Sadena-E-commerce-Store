import OverviewClient from './OverviewClient';

// In Next.js 15, params is a Promise
export default async function OverviewHome({ params }) {
  const { lang } = await params;

  return <OverviewClient lang={lang} />;
}