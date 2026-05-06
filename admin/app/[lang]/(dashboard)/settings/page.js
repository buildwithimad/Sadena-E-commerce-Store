import SettingsClient from './SettingClient';


export const revalidate = 0;

export const metadata = {
  title: 'Settings | Sadena Admin',
};

export default async function SettingsPage({ params }) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-white">
      <SettingsClient lang={lang} />
    </div>
  );
}