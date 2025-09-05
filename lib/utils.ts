import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (amount: number, currency_code: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency_code,
  })
  .format(amount)
}
