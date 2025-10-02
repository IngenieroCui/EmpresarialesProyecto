/**
 * Builds a query string from parameters object, ignoring undefined/empty values
 */
export function buildQuery(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean') {
        searchParams.append(key, String(value));
      } else if (typeof value === 'number') {
        searchParams.append(key, String(value));
      } else if (typeof value === 'string') {
        if (value.trim()) {
          searchParams.append(key, value);
        }
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Extracts query parameters from URL search params
 */
export function parseQueryParams(searchParams: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}
