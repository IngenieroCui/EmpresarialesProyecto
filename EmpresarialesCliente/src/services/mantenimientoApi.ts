import type {
  Mantenimiento,
  MantenimientoCreateData,
  MantenimientoUpdateData,
  MantenimientoFilter,
  MantenimientoEstadisticas
} from '../types/Mantenimiento';
import { buildQuery } from '../utils/query';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
const API_USERNAME = import.meta.env.VITE_API_USERNAME || 'admin';
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD || 'admin';
const API_ENDPOINT = `${API_BASE_URL}/api/mantenimiento`;

// Create Basic Auth header
const createAuthHeaders = (): HeadersInit => {
  const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

class ApiError extends Error {
  public status: number;
  public response?: Response;

  constructor(status: number, message: string, response?: Response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

/**
 * Generic fetch wrapper with error handling and JSON parsing
 */
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const defaultOptions: RequestInit = {
    mode: 'cors',
    credentials: 'omit',
    headers: {
      ...createAuthHeaders(),
      ...(options?.headers || {}),
    },
    ...options,
  };

  console.log('🚀 API Request (Mantenimiento):', {
    url,
    method: defaultOptions.method || 'GET',
    headers: defaultOptions.headers,
    body: defaultOptions.body
  });

  try {
    const response = await fetch(url, defaultOptions);

    console.log('📡 API Response (Mantenimiento):', {
      url,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      if (response.status === 401) {
        errorMessage = 'Error de autenticación: Credenciales inválidas';
      } else if (response.status === 403) {
        errorMessage = 'Error de autorización: Acceso denegado';
      } else {
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // If response is not JSON, use status text
        }
      }

      throw new ApiError(response.status, errorMessage, response);
    }

    // Handle empty responses (like DELETE)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('✅ Empty response (no JSON content)');
      return undefined as T;
    }

    const data = await response.json();
    console.log('✅ API Success (Mantenimiento):', data);
    return data;
  } catch (error) {
    console.error('❌ API Error (Mantenimiento):', error);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Error de conexión: No se puede conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:8080');
    }

    if (error instanceof TypeError && error.message.includes('CORS')) {
      throw new Error('Error CORS: El servidor no permite peticiones desde este origen');
    }

    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List mantenimientos with optional filters
 */
export async function listMantenimientos(params?: MantenimientoFilter): Promise<Mantenimiento[]> {
  try {
    const mappedParams: Record<string, unknown> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        // Los nombres de parámetros ya coinciden con el backend
        mappedParams[key] = value;
      });
    }

    const queryString = Object.keys(mappedParams).length > 0 ? buildQuery(mappedParams) : '';
    const url = `${API_ENDPOINT}${queryString}`;

    console.log('📋 Fetching mantenimientos list:', { params, url });

    const result = await apiFetch<Mantenimiento[]>(url);

    if (!Array.isArray(result)) {
      console.warn('⚠️ Expected array but got:', typeof result, result);
      return [];
    }

    console.log('✅ Mantenimientos fetched successfully:', result.length, 'items');
    return result;
  } catch (error) {
    console.error('❌ Error fetching mantenimientos:', error);
    throw new Error(`Error al obtener la lista de mantenimientos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Get a single mantenimiento by ID
 */
export async function getMantenimientoById(id: string): Promise<Mantenimiento | null> {
  if (!id.trim()) {
    throw new Error('ID is required');
  }

  const mantenimientos = await listMantenimientos({ id: id.trim() });
  return mantenimientos.length > 0 ? mantenimientos[0] : null;
}

/**
 * Get mantenimientos by carro placa
 */
export async function getMantenimientosPorCarro(placaCarro: string): Promise<Mantenimiento[]> {
  if (!placaCarro.trim()) {
    throw new Error('Placa is required');
  }

  const url = `${API_ENDPOINT}/carro/${encodeURIComponent(placaCarro.trim())}`;
  return await apiFetch<Mantenimiento[]>(url);
}

/**
 * Get urgent mantenimientos
 */
export async function getMantenimientosUrgentes(): Promise<Mantenimiento[]> {
  const url = `${API_ENDPOINT}?action=urgentes`;
  return await apiFetch<Mantenimiento[]>(url);
}

/**
 * Get mantenimiento statistics
 */
export async function getEstadisticas(): Promise<MantenimientoEstadisticas> {
  const url = `${API_ENDPOINT}?action=estadisticas`;
  return await apiFetch<MantenimientoEstadisticas>(url);
}

/**
 * Create a new mantenimiento
 */
export async function createMantenimiento(data: MantenimientoCreateData): Promise<Mantenimiento> {
  return await apiFetch<Mantenimiento>(API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing mantenimiento
 */
export async function updateMantenimiento(id: string, data: MantenimientoUpdateData): Promise<Mantenimiento> {
  if (!id.trim()) {
    throw new Error('ID is required');
  }

  const url = `${API_ENDPOINT}/${encodeURIComponent(id.trim())}`;

  return await apiFetch<Mantenimiento>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a mantenimiento by ID
 */
export async function deleteMantenimiento(id: string): Promise<void> {
  if (!id.trim()) {
    throw new Error('ID is required');
  }

  const url = `${API_ENDPOINT}/${encodeURIComponent(id.trim())}`;

  await apiFetch<void>(url, {
    method: 'DELETE',
  });
}

/**
 * Test function for debugging API connectivity
 */
export async function testMantenimientoApiConnection(): Promise<void> {
  console.log('🔧 Testing Mantenimiento API connection...');
  console.log('📍 API_ENDPOINT:', API_ENDPOINT);

  try {
    // Test 1: Health check
    console.log('\n🏥 Test 1: Health check...');
    const healthResponse = await apiFetch<string>(`${API_BASE_URL}/api/mantenimiento/healthCheck`);
    console.log('✅ Health check:', healthResponse);

    // Test 2: List all mantenimientos
    console.log('\n📋 Test 2: List all mantenimientos...');
    const mantenimientos = await listMantenimientos();
    console.log('✅ Success! Retrieved', mantenimientos.length, 'mantenimientos');

    if (mantenimientos.length > 0) {
      console.log('📊 First mantenimiento:', mantenimientos[0]);
    }

    // Test 3: Get statistics
    console.log('\n📊 Test 3: Get statistics...');
    const stats = await getEstadisticas();
    console.log('✅ Statistics:', stats);

    console.log('\n🎉 All tests passed! Mantenimiento API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  const w = window as typeof window & {
    testMantenimientoApiConnection: typeof testMantenimientoApiConnection;
  };
  w.testMantenimientoApiConnection = testMantenimientoApiConnection;
}

export { ApiError };
