import Login from "@/components/Login/Login";
import { notFound } from "next/navigation";

const validLangs = ["en", "ar"];

export const revalidate = 3600;

// ------------------------
// Metadata
// ------------------------
export async function generateMetadata({ params }) {
  const { lang } = await params;

  return {
    title: lang === "ar" ? "تسجيل الدخول" : "Login",
  };
}

// ------------------------
// Page
// ------------------------
export default async function HomePage({ params }) {
  const { lang } = await params;

  if (!validLangs.includes(lang)) {
    notFound();
  }

  return (
    <main>
      <Login lang={lang} />
    </main>
  );
}