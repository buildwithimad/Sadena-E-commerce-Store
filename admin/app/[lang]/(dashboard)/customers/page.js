import CustomersClient from './CustomerClient';

export const metadata = {
  title: 'Customers | Admin Panel',
};

// In Next.js 15, params is a Promise
export default async function CustomersPage({ params }) {
  const { lang } = await params;

  return <CustomersClient lang={lang} />;
}