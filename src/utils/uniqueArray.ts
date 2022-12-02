/**
 * Create copy of array with unique values.
 */
export const uniqueArray = <T>(arr: T[]) => [...new Set(arr)];
