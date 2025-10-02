import type { Carro, CarroCreateData, CarroUpdateData, CarroFilter } from '../types/Carro';
import { buildQuery } from '../utils/query';

// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');
const API_USERNAME = import.meta.env.VITE_API_USERNAME || 'admin';
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD || 'admin';
const API_ENDPOINT = `${API_BASE_URL}/api/carro`;

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
    mode: 'cors', // Explicitly set CORS mode
    credentials: 'omit', // Don't send cookies, use Authorization header instead
    headers: {
      ...createAuthHeaders(),
      ...(options?.headers || {}),
    },
    ...options,
  };

  // Debug logging
  console.log('🚀 API Request:', {
    url,
    method: defaultOptions.method || 'GET',
    headers: defaultOptions.headers,
    body: defaultOptions.body
  });

  try {
    const response = await fetch(url, defaultOptions);
    
    // Debug logging for response
    console.log('📡 API Response:', {
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
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Check for specific network errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Error de conexión: No se puede conectar al servidor. Verifica que el backend esté ejecutándose en http://localhost:8080');
    }
    
    if (error instanceof TypeError && error.message.includes('CORS')) {
      throw new Error('Error CORS: El servidor no permite peticiones desde este origen');
    }
    
    // Network or other errors
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List carros with optional filters (unified list/search)
 */
export async function listCarros(params?: CarroFilter): Promise<Carro[]> {
  try {
    const queryString = params ? buildQuery(params) : '';
    const url = `${API_ENDPOINT}${queryString}`;
    
    console.log('📋 Fetching carros list:', { params, url });
    
    // Para el controlador Java unificado, mapear los nombres de campos si es necesario
    const mappedParams: Record<string, unknown> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        switch (key) {
          case 'tieneAireAcondicionado':
            mappedParams['aire_acondicionado'] = value;
            break;
          case 'numeroPuertas':
            mappedParams['numero_puertas'] = value;
            break;
          case 'tipoTransmision':
            mappedParams['transmision'] = value;
            break;
          case 'fechaDesde':
            // Convertir a formato que espera el backend: "yyyy-MM-dd HH:mm:ss"
            if (typeof value === 'string') {
              const date = new Date(value);
              mappedParams['fechadesde'] = date.toISOString().slice(0, 19).replace('T', ' ');
            }
            break;
          case 'fechaHasta':
            // Convertir a formato que espera el backend: "yyyy-MM-dd HH:mm:ss"
            if (typeof value === 'string') {
              const date = new Date(value);
              mappedParams['fechahasta'] = date.toISOString().slice(0, 19).replace('T', ' ');
            }
            break;
          default:
            mappedParams[key] = value;
        }
      });
    }
    
    const finalQueryString = Object.keys(mappedParams).length > 0 ? buildQuery(mappedParams) : '';
    const finalUrl = `${API_ENDPOINT}${finalQueryString}`;
    
    console.log('🔄 Mapped params for Java backend:', mappedParams);
    console.log('🌐 Final URL:', finalUrl);
    
    const result = await apiFetch<Carro[]>(finalUrl);
    
    // Ensure we always return an array
    if (!Array.isArray(result)) {
      console.warn('⚠️ Expected array but got:', typeof result, result);
      return [];
    }
    
    console.log('✅ Carros fetched successfully:', result.length, 'items');
    console.log('📊 Sample carro:', result[0]);
    return result;
  } catch (error) {
    console.error('❌ Error fetching carros:', error);
    throw new Error(`Error al obtener la lista de carros: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

/**
 * Get a single carro by placa (individual search)
 */
export async function getCarroByPlaca(placa: string): Promise<Carro | null> {
  if (!placa.trim()) {
    throw new Error('Placa is required');
  }
  
  const carros = await listCarros({ placa: placa.trim() });
  return carros.length > 0 ? carros[0] : null;
}

/**
 * Create a new carro
 */
export async function createCarro(data: CarroCreateData): Promise<Carro> {
  return await apiFetch<Carro>(API_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing carro
 */
export async function updateCarro(placa: string, data: CarroUpdateData): Promise<Carro> {
  if (!placa.trim()) {
    throw new Error('Placa is required');
  }
  
  const url = `${API_ENDPOINT}/${encodeURIComponent(placa.trim())}`;
  
  return await apiFetch<Carro>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Delete a carro by placa
 */
export async function deleteCarro(placa: string): Promise<void> {
  if (!placa.trim()) {
    throw new Error('Placa is required');
  }
  
  const url = `${API_ENDPOINT}/${encodeURIComponent(placa.trim())}`;
  
  await apiFetch<void>(url, {
    method: 'DELETE',
  });
}

/**
 * Test function for debugging API connectivity
 * Call this from browser console: window.testApiConnection()
 */
export async function testApiConnection(): Promise<void> {
  console.log('🔧 Testing API connection with Java Spring Boot backend...');
  console.log('📍 API_BASE_URL:', API_BASE_URL);
  console.log('👤 API_USERNAME:', API_USERNAME);
  console.log('🔑 Credentials encoded:', btoa(`${API_USERNAME}:${API_PASSWORD}`));
  console.log('🎯 Expected endpoint: /api/carro');
  
  try {
    // Test 1: Health check
    console.log('\n🏥 Test 1: Health check...');
    const healthResponse = await apiFetch<string>(`${API_BASE_URL}/api/carro/healthCheck`);
    console.log('✅ Health check:', healthResponse);
    
    // Test 2: List all carros
    console.log('\n📋 Test 2: List all carros...');
    const carros = await listCarros();
    console.log('✅ Success! Retrieved', carros.length, 'carros');
    
    if (carros.length > 0) {
      console.log('📊 First carro:', carros[0]);
      console.log('🏷️ Expected fields present:');
      console.log('  - placa:', carros[0].placa);
      console.log('  - marca:', carros[0].marca);
      console.log('  - numeroPuertas:', carros[0].numeroPuertas);
      console.log('  - tieneAireAcondicionado:', carros[0].tieneAireAcondicionado);
    }
    
    // Test 3: Search by placa
    if (carros.length > 0) {
      const placaTest = carros[0].placa;
      console.log('\n🔍 Test 3: Search by placa:', placaTest);
      const carroEncontrado = await getCarroByPlaca(placaTest);
      console.log('✅ Found carro:', carroEncontrado?.placa);
    }
    
    console.log('\n🎉 All tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify backend is running on http://localhost:8080');
    console.log('2. Check if Spring Security is properly configured');
    console.log('3. Verify CORS settings allow requests from http://localhost:5173');
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  const w = window as typeof window & { 
    testApiConnection: typeof testApiConnection;
    debugFetch: () => Promise<void>;
  };
  w.testApiConnection = testApiConnection;
  
  // Simple debug function
  w.debugFetch = async () => {
    console.clear();
    console.log('🚀 DEBUG: Testing fetch to Java backend...');
    
    const credentials = btoa('admin:admin');
    const headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('📋 Headers:', headers);
    
    try {
      // Use proxy endpoint in development
      const url = import.meta.env.DEV ? '/api/carro' : 'http://localhost:8080/api/carro';
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ SUCCESS! Data received:', data);
        console.log('📊 Number of carros:', data.length);
      } else {
        console.error('❌ Response not OK:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
    }
  };
}

export { ApiError };
