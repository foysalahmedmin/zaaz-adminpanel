/**
 * Utility functions for price display
 */

/**
 * Get price display based on location.
 * Prices are stored in USD (base currency). Exchange rates are applied at checkout.
 */
export const getPriceDisplay = (
  price: number | { USD: number; BDT: number },
  isBangladesh: boolean | null,
): { mode: "BOTH" | "SINGLE"; primary: string; secondary?: string } => {
  // Normalize: if price is the old object format, extract USD
  const usdAmount =
    typeof price === "number" ? price : (price?.USD ?? 0);

  const formatUSD = (amount: number): string => {
    const isRoundNumber = amount % 1 === 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: isRoundNumber ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (isBangladesh === true) {
    // Show USD base price with BDT conversion note at checkout
    return {
      mode: "SINGLE",
      primary: formatUSD(usdAmount),
    };
  }

  // Non-Bangladesh or location unknown: show USD
  return {
    mode: "SINGLE",
    primary: formatUSD(usdAmount),
  };
};

