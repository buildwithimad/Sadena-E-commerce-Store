"use client";

import { useWishlist } from "@/context/WishlistContext";
import Icon from "@/components/ui/AppIcon";

export default function WishlistButton({ product, size = 18, className = "" }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const isActive = isInWishlist(product.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isActive) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center
        transition-all duration-300
        ${className}
      `}
      aria-label="Toggle Wishlist"
    >
      <Icon
        name="HeartIcon"
        size={size}
        variant={isActive ? "solid" : "outline"}
        className={`transition-all duration-300 ${
          isActive
            ? "text-red-500 scale-110"
            : "text-[var(--muted-foreground)] hover:text-red-400"
        }`}
      />
    </button>
  );
}