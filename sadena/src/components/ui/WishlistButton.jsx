"use client";

import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import Icon from "@/components/ui/AppIcon";

export default function WishlistButton({ product, size = 18, className = "" }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const isActive = isInWishlist(product?.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (isActive) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group flex items-center justify-center outline-none transition-transform duration-200 active:scale-90 ${className}`}
      aria-label="Toggle Wishlist"
    >
      <Icon
        name="HeartIcon"
        size={size}
        variant={isActive ? "solid" : "outline"}
        className={`
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isAnimating ? "scale-125 -rotate-6 text-red-500" : "scale-100 rotate-0"}
          ${isActive && !isAnimating ? "text-red-500 drop-shadow-sm" : ""}
          ${!isActive && !isAnimating ? "text-gray-400 group-hover:text-red-400 group-hover:scale-110" : ""}
        `}
      />
    </button>
  );
}