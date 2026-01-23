/**
 * Price formatting utilities for consistent display across the application
 */

import { UAE_DIRHAM_CODE } from './constants';

/**
 * Format a price amount with the appropriate currency symbol
 * @param amount - The price amount as a string or number
 * @param currencyCode - The currency code (defaults to AED)
 * @returns Formatted price string
 */
export function formatPrice(amount: string | number, currencyCode: string = UAE_DIRHAM_CODE): string {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(price)) {
    return currencyCode === UAE_DIRHAM_CODE ? 'د.إ 0.00' : `${currencyCode} 0.00`;
  }

  if (currencyCode === UAE_DIRHAM_CODE) {
    const formattedNumber = new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    
    return `د.إ ${formattedNumber}`;
  }

  // Fallback for other currencies
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
  }).format(price);
}

/**
 * Format a price range with the appropriate currency symbol
 * @param min - Minimum price
 * @param max - Maximum price
 * @param currencyCode - The currency code (defaults to AED)
 * @returns Formatted price range string
 */
export function formatPriceRange(
  min: string | number, 
  max: string | number, 
  currencyCode: string = UAE_DIRHAM_CODE
): string {
  const minPrice = typeof min === 'string' ? parseFloat(min) : min;
  const maxPrice = typeof max === 'string' ? parseFloat(max) : max;
  
  if (isNaN(minPrice) || isNaN(maxPrice)) {
    return currencyCode === UAE_DIRHAM_CODE ? 'د.إ 0.00 - د.إ 0.00' : `${currencyCode} 0.00 - ${currencyCode} 0.00`;
  }

  if (currencyCode === UAE_DIRHAM_CODE) {
    const formattedMin = new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(minPrice);
    
    const formattedMax = new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(maxPrice);
    
    return `د.إ ${formattedMin} - د.إ ${formattedMax}`;
  }

  // Fallback for other currencies
  return `${formatPrice(minPrice, currencyCode)} - ${formatPrice(maxPrice, currencyCode)}`;
}

/**
 * Get the currency symbol for a given currency code
 * @param currencyCode - The currency code
 * @returns The currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode) {
    case UAE_DIRHAM_CODE:
      return 'د.إ';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    default:
      return currencyCode;
  }
}

/**
 * Check if a price is valid
 * @param amount - The price amount
 * @returns True if the price is valid
 */
export function isValidPrice(amount: string | number): boolean {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(price) && price >= 0;
}
