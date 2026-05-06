import ProfileClient from './ProfileClient';

export const revalidate = 0;

export default async function ProfilePage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';

  // We let the Client Component handle fetching the user using your supabaseClient
  return <ProfileClient lang={lang} />;
}