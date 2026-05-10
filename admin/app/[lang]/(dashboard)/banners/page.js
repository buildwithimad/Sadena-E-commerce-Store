import BannerClient from "./BannerClient";
import { getBanners } from "@/services/bannersService";

export const metadata = {
  title: "Banners | Admin Panel",
};

export default async function BannerPage({ params }) {
  const { lang } = await params;

  const banners = await getBanners();

  return <BannerClient lang={lang} initialBanners={banners} />;
}