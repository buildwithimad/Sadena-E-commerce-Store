import crypto from "crypto";

export function generateHash({
  order_id,
  amount,
  currency,
  description,
  password,
}) {
  const string = `${order_id}${amount}${currency}${description}${password}`;

  const md5 = crypto
    .createHash("md5")
    .update(string.toUpperCase())
    .digest("hex");

  const sha1 = crypto.createHash("sha1").update(md5).digest("hex");

  return sha1;
}