export function validateOrder(body) {
  const errors = {};

  // =========================
  // HELPERS
  // =========================
  const isEmpty = (value) => {
    return value === undefined || value === null || String(value).trim() === "";
  };

  const isValidNumber = (value) => {
    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      !Number.isNaN(value)
    );
  };

  // =========================
  // EXTRACT
  // =========================
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
    shipping_state,
    shipping_zip, // ✅ Added ZIP code
    shipping_country,

    payment_method,
  } = body;

  // =========================
  // ITEMS
  // =========================
  if (!Array.isArray(items) || items.length === 0) {
    errors.items = "Cart is empty";
  }

  // =========================
  // PRICES
  // =========================
  if (!isValidNumber(subtotal) || subtotal < 0) {
    errors.subtotal = "Invalid subtotal";
  }

  if (!isValidNumber(shipping) || shipping < 0) {
    errors.shipping = "Invalid shipping";
  }

  if (!isValidNumber(total) || total <= 0) {
    errors.total = "Invalid total";
  }

  if (
    isValidNumber(subtotal) &&
    isValidNumber(shipping) &&
    isValidNumber(total)
  ) {
    const calculatedTotal = subtotal + shipping;
    if (Math.abs(calculatedTotal - total) > 1) {
      errors.total = "Total mismatch";
    }
  }

  // =========================
  // CUSTOMER
  // =========================
  if (isEmpty(customer_first_name)) {
    errors.customer_first_name = "First name is required";
  } else if (customer_first_name.trim().length < 2 || customer_first_name.trim().length > 50) {
    errors.customer_first_name = "First name must be between 2 and 50 characters";
  }

  if (isEmpty(customer_last_name)) {
    errors.customer_last_name = "Last name is required";
  } else if (customer_last_name.trim().length < 2 || customer_last_name.trim().length > 50) {
    errors.customer_last_name = "Last name must be between 2 and 50 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (isEmpty(customer_email)) {
    errors.customer_email = "Email is required";
  } else if (!emailRegex.test(customer_email) || customer_email.trim().length > 255) {
    errors.customer_email = "Invalid email format";
  }

  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  if (isEmpty(customer_phone)) {
    errors.customer_phone = "Phone number is required";
  } else if (!phoneRegex.test(customer_phone)) {
    errors.customer_phone = "Invalid phone format";
  }

  // =========================
  // ADDRESS
  // =========================
  if (isEmpty(shipping_street)) {
    errors.shipping_street = "Street address is required";
  } else if (shipping_street.trim().length < 5 || shipping_street.trim().length > 255) {
    errors.shipping_street = "Street address must be at least 5 characters";
  }

  if (isEmpty(shipping_city)) {
    errors.shipping_city = "City is required";
  } else if (shipping_city.trim().length < 2 || shipping_city.trim().length > 100) {
    errors.shipping_city = "City name must be at least 2 characters";
  }

  // ✅ ZIP CODE REQUIRED VALIDATION
  if (isEmpty(shipping_zip)) {
    errors.shipping_zip = "ZIP Code is required";
  } else if (shipping_zip.trim().length < 3 || shipping_zip.trim().length > 20) {
    errors.shipping_zip = "Invalid ZIP Code";
  }

  if (isEmpty(shipping_country)) {
    errors.shipping_country = "Country is required";
  } else if (shipping_country.trim().length < 2 || shipping_country.trim().length > 100) {
    errors.shipping_country = "Invalid country";
  }

  // =========================
  // PAYMENT METHOD
  // =========================
  if (isEmpty(payment_method)) {
    errors.payment_method = "Payment method is required";
  } else if (!["cod", "card"].includes(payment_method)) {
    errors.payment_method = "Invalid payment method";
  }

  // =========================
  // RESULT
  // =========================
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}