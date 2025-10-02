import type { Carro, CarroCreateData, CarroUpdateData, CarroFilter } from '../types/Carro';
import { buildQuery } from '../utils/query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_ENDPOINT = `${API_BASE_URL}/api/carro`;

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
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If response is not JSON, use status text
      }
      
      throw new ApiError(response.status, errorMessage, response);
    }

    // Handle empty responses (like DELETE)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return undefined as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * List carros with optional filters (unified list/search)
 */
export async function listCarros(params?: CarroFilter): Promise<Carro[]> {
  const queryString = params ? buildQuery(params) : '';
  const url = `${API_ENDPOINT}${queryString}`;
  
  return await apiFetch<Carro[]>(url);
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

export { ApiError };
