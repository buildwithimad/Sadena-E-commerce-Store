"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useUser } from "@/context/UserContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useUser();
  const supabase = createClient();

  const [wishlist, setWishlist] = useState([]);

  // =========================
  // 🔥 LOAD WISHLIST
  // =========================
  const loadWishlist = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id, products(*)")
        .eq("user_id", user.id);

      if (error) {
        console.error("Wishlist load error:", error);
        return;
      }

      const items = data?.map((i) => i.products) || [];
      setWishlist(items);
    } else {
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlist(local);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  // =========================
  // 🔥 SYNC LOCAL → DB ON LOGIN
  // =========================
  useEffect(() => {
    if (!user) return;

    const syncWishlist = async () => {
      const local = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (!local.length) return;

      try {
        for (const item of local) {
          await supabase.from("wishlist").upsert(
            {
              user_id: user.id,
              product_id: item.id,
            },
            {
              onConflict: "user_id,product_id",
            }
          );
        }

        localStorage.removeItem("wishlist");

        // 🔥 Reload from DB after sync
        await loadWishlist();
      } catch (err) {
        console.error("Wishlist sync error:", err);
      }
    };

    syncWishlist();
  }, [user]);

  // =========================
  // ➕ ADD TO WISHLIST
  // =========================
  const addToWishlist = async (product) => {
    if (user) {
      try {
        await supabase.from("wishlist").upsert(
          {
            user_id: user.id,
            product_id: product.id,
          },
          {
            onConflict: "user_id,product_id",
          }
        );

        setWishlist((prev) => {
          if (prev.find((i) => i.id === product.id)) return prev;
          return [...prev, product];
        });
      } catch (err) {
        console.error("Add wishlist error:", err);
      }
    } else {
      const exists = wishlist.find((i) => i.id === product.id);
      if (exists) return;

      const updated = [...wishlist, product];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlist(updated);
    }
  };

  // =========================
  // ❌ REMOVE FROM WISHLIST
  // =========================
  const removeFromWishlist = async (id) => {
    if (user) {
      try {
        await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", id);

        setWishlist((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error("Remove wishlist error:", err);
      }
    } else {
      const updated = wishlist.filter((i) => i.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setWishlist(updated);
    }
  };

  // =========================
  // ❤️ CHECK IF IN WISHLIST
  // =========================
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);