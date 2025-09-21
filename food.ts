export interface FoodItem {
  id: string;
  name: string;
  category: string;
  expiryDate: string; // YYYY-MM-DD format
  addedDate: string;  // YYYY-MM-DD format
}

export type ExpiryStatus = "fresh" | "expiring" | "expired";

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "expiring";
  return "fresh";
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}