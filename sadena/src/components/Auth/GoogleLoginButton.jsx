"use client";

import { createClient } from "@/lib/supabaseClient";

export default function GoogleLoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full border py-3 font-semibold"
    >
      Continue with Google
    </button>
  );
}