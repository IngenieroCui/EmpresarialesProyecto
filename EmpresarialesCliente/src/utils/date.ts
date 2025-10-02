/**
 * Formats a Date object to the API expected format: "YYYY-MM-DD HH:mm:ss"
 */
export function formatToApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parses an API date string to a Date object
 */
export function parseApiDate(dateString: string): Date {
  // Convert "YYYY-MM-DD HH:mm:ss" to a format that Date can parse
  const isoString = dateString.replace(' ', 'T') + '.000Z';
  return new Date(isoString);
}

/**
 * Gets current date in API format
 */
export function getCurrentApiDate(): string {
  return formatToApiDate(new Date());
}
