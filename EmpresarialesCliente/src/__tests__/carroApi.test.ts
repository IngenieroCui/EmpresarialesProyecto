import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listCarros, getCarroByPlaca, createCarro, updateCarro, deleteCarro } from '../services/carroApi';
import type { Carro, CarroCreateData } from '../types/Carro';

// Mock fetch globally
const mockFetch = vi.fn();
Object.defineProperty(globalThis, 'fetch', {
  value: mockFetch,
  writable: true
});

describe('carroApi', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
      headers: new Headers({ 'content-type': 'application/json' })
    });
  });

  describe('listCarros', () => {
    it('should call fetch with correct URL when no filters provided', async () => {
      await listCarros();
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      );
    });

    it('should build query string with filters', async () => {
      const filters = {
        placa: 'ABC-123',
        marca: 'Toyota',
        anio: 2023
      };

      await listCarros(filters);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro?placa=ABC-123&marca=Toyota&anio=2023',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      );
    });

    it('should ignore empty and undefined filter values', async () => {
      const filters = {
        placa: 'ABC-123',
        marca: '',
        color: undefined,
        anio: 2023
      };

      await listCarros(filters);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro?placa=ABC-123&anio=2023',
        expect.any(Object)
      );
    });

    it('should handle boolean values correctly', async () => {
      const filters = {
        tieneAireAcondicionado: true
      };

      await listCarros(filters);
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro?tieneAireAcondicionado=true',
        expect.any(Object)
      );
    });

    it('should return parsed JSON response', async () => {
      const mockCarros: Carro[] = [{
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        anio: 2023,
        estado: 'NUEVO',
        combustible: 'GASOLINA',
        numeroPuertas: 4,
        tieneAireAcondicionado: true,
        precio: 50000000,
        fechaRegistro: '2023-10-01 12:00:00',
        tipoTransmision: 'MANUAL'
      }];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCarros),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await listCarros();
      expect(result).toEqual(mockCarros);
    });
  });

  describe('getCarroByPlaca', () => {
    it('should call listCarros with placa filter', async () => {
      const mockCarros: Carro[] = [{
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        anio: 2023,
        estado: 'NUEVO',
        combustible: 'GASOLINA',
        numeroPuertas: 4,
        tieneAireAcondicionado: true,
        precio: 50000000,
        fechaRegistro: '2023-10-01 12:00:00',
        tipoTransmision: 'MANUAL'
      }];

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCarros),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await getCarroByPlaca('ABC-123');
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro?placa=ABC-123',
        expect.any(Object)
      );
      expect(result).toEqual(mockCarros[0]);
    });

    it('should return null when no carro found', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await getCarroByPlaca('XYZ-999');
      expect(result).toBeNull();
    });

    it('should throw error for empty placa', async () => {
      await expect(getCarroByPlaca('')).rejects.toThrow('Placa is required');
      await expect(getCarroByPlaca('   ')).rejects.toThrow('Placa is required');
    });
  });

  describe('createCarro', () => {
    it('should make POST request with correct data', async () => {
      const carroData: CarroCreateData = {
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Blanco',
        anio: 2023,
        estado: 'NUEVO',
        combustible: 'GASOLINA',
        numeroPuertas: 4,
        tieneAireAcondicionado: true,
        precio: 50000000,
        fechaRegistro: '2023-10-01 12:00:00',
        tipoTransmision: 'MANUAL'
      };

      const mockResponse = { ...carroData, tipoVehiculo: 'Sedan' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await createCarro(carroData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(carroData)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCarro', () => {
    it('should make PUT request with correct data and URL', async () => {
      const placa = 'ABC-123';
      const carroData: CarroCreateData = {
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        color: 'Negro',
        anio: 2023,
        estado: 'USADO',
        combustible: 'GASOLINA',
        numeroPuertas: 4,
        tieneAireAcondicionado: true,
        precio: 45000000,
        fechaRegistro: '2023-10-01 12:00:00',
        tipoTransmision: 'MANUAL'
      };

      const mockResponse = { ...carroData, tipoVehiculo: 'Sedan' };
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      const result = await updateCarro(placa, carroData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro/ABC-123',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(carroData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should encode placa in URL', async () => {
      const placa = 'ABC-123/TEST';
      const carroData = {} as CarroCreateData;
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
        headers: new Headers({ 'content-type': 'application/json' })
      });

      await updateCarro(placa, carroData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro/ABC-123%2FTEST',
        expect.any(Object)
      );
    });

    it('should throw error for empty placa', async () => {
      const carroData = {} as CarroCreateData;
      await expect(updateCarro('', carroData)).rejects.toThrow('Placa is required');
    });
  });

  describe('deleteCarro', () => {
    it('should make DELETE request with correct URL', async () => {
      const placa = 'ABC-123';
      
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/plain' })
      });

      await deleteCarro(placa);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/carro/ABC-123',
        expect.objectContaining({
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
      );
    });

    it('should throw error for empty placa', async () => {
      await expect(deleteCarro('')).rejects.toThrow('Placa is required');
      await expect(deleteCarro('   ')).rejects.toThrow('Placa is required');
    });
  });

  describe('Error handling', () => {
    it('should throw ApiError for non-2xx responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Carro no encontrado' })
      });

      await expect(listCarros()).rejects.toThrow('Carro no encontrado');
    });

    it('should throw generic error for network failures', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(listCarros()).rejects.toThrow('Network error: Network error');
    });

    it('should handle non-JSON error responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Invalid JSON'))
      });

      await expect(listCarros()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });
});
