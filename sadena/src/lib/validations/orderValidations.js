export function validateOrder(body) {
  const errors = [];

  const {
    items,
    subtotal,
    shipping,
    total,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    shipping_street,
    shipping_city,
    shipping_country,
  } = body;

  // =========================
  // ITEMS
  // =========================
  if (!Array.isArray(items) || items.length === 0) {
    errors.push("Items are required");
  } else {
    for (const item of items) {
      if (!item.id || !item.name) {
        errors.push("Invalid item structure");
      }

      if (typeof item.price !== "number" || item.price < 0) {
        errors.push("Invalid item price");
      }

      if (typeof item.quantity !== "number" || item.quantity <= 0) {
        errors.push("Invalid item quantity");
      }
    }
  }

  // =========================
  // PRICES
  // =========================
  if (typeof subtotal !== "number" || subtotal < 0) {
    errors.push("Invalid subtotal");
  }

  if (typeof shipping !== "number" || shipping < 0) {
    errors.push("Invalid shipping");
  }

  if (typeof total !== "number" || total <= 0) {
    errors.push("Invalid total");
  }

  const calculatedTotal = subtotal + shipping;

  if (Math.abs(calculatedTotal - total) > 1) {
    errors.push("Total mismatch");
  }

  // =========================
  // CUSTOMER
  // =========================
  if (!customer_first_name || customer_first_name.length < 2) {
    errors.push("First name is required");
  }

  if (!customer_last_name || customer_last_name.length < 2) {
    errors.push("Last name is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer_email || !emailRegex.test(customer_email)) {
    errors.push("Invalid email");
  }

  if (!customer_phone || customer_phone.length < 8) {
    errors.push("Invalid phone number");
  }

  // =========================
  // ADDRESS
  // =========================
  if (!shipping_street || shipping_street.length < 5) {
    errors.push("Street address is required");
  }

  if (!shipping_city) {
    errors.push("City is required");
  }

  if (!shipping_country) {
    errors.push("Country is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}