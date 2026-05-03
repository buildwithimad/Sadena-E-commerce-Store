"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // 🔥 Get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setIsLoading(false);
    };

    getUser();

    // 🔥 Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Logout
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}