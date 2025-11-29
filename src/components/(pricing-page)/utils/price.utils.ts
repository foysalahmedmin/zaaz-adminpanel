/**
 * Utility functions for price display
 */

/**
 * Get price display based on location
 */
export const getPriceDisplay = (
  price: { USD: number; BDT: number },
  isBangladesh: boolean | null,
): { mode: "BOTH" | "SINGLE"; primary: string; secondary?: string } => {
  const formatPrice = (amount: number, currency: string): string => {
    const isRoundNumber = amount % 1 === 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: isRoundNumber ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isBangladesh === true) {
    return {
      mode: "SINGLE",
      primary: formatPrice(price.BDT, "BDT"),
    };
  }
  if (isBangladesh === false) {
    return {
      mode: "SINGLE",
      primary: formatPrice(price.USD, "USD"),
    };
  }
  // null - show both
  return {
    mode: "BOTH",
    primary: formatPrice(price.USD, "USD"),
    secondary: formatPrice(price.BDT, "BDT"),
  };
};


