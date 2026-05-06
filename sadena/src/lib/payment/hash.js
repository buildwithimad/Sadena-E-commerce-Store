import crypto from "crypto";

export function generateHash({ order_id, amount, email, password }) {
  const raw = `${order_id}${amount}${email}${password}`;

  return crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");
}