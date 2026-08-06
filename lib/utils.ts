export const formatPrice = (
  amount: number,
  currency: string = "INR",
): string => {
  const locale = currency === "INR" ? "en-IN" : undefined; // Default locale for other currencies

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
