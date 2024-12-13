export function cn(...inputs: any[]) {
  return inputs.join(' ');
}

export const formatNumber: (value: number | bigint) => string = new Intl.NumberFormat().format;

export const getStatusColor = {
  CANCELLED:" text-red-500",
  DELIVERED:" text-green-500",
  PENDING: " text-yellow-500",
  PROCESSING: " text-yellow-500",
  SHIPPED: " text-[#9fbe00]",
}