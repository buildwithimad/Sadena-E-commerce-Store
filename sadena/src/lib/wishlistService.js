// Simulated DB-ready service

const STORAGE_KEY = 'sadena-wishlist';

// Toggle item
export async function toggleWishlistItem(productId, user) {
  if (user) {
    // 🔒 Future: call API here
    console.log('TODO: send to DB', productId);
    // Return current wishlist for optimistic updates
    return await getWishlist(user);
  }

  // LOCAL MODE
  const current = getLocalWishlist();

  let updated;
  if (current.includes(productId)) {
    updated = current.filter((id) => id !== productId);
  } else {
    updated = [...current, productId];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Get wishlist
export async function getWishlist(user) {
  if (user) {
    // 🔒 Future: fetch from API
    console.log('TODO: fetch from DB');
    return [];
  }

  return getLocalWishlist();
}

// Clear
export async function clearWishlist(user) {
  if (user) {
    console.log('TODO: clear DB');
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

// Helper
function getLocalWishlist() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
