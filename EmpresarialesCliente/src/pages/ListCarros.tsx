import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Carro } from '../types/Carro';
import { listCarros } from '../services/carroApi';

/**
 * Componente ListCarros
 * Caso de uso: SOLO LISTAR todos los carros sin filtros
 * Cumple con el requisito del PDF: "Cada ventana debe implementar UN SOLO caso de uso"
 */
export default function ListCarros() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  const navigate = useNavigate();
  const location = useLocation();

  // Check for messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage({
        text: location.state.message,
        type: location.state.type || 'success'
      });
      
      setTimeout(() => setMessage({ text: '', type: 'success' }), 5000);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Load all carros on component mount
  useEffect(() => {
    loadCarros();
  }, []);

  const loadCarros = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await listCarros();
      setCarros(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los carros';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (placa: string) => {
    navigate(`/carros/update/${placa}`);
  };

  const handleDelete = (placa: string) => {
    navigate(`/carros/delete/${placa}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Listar Todos los Carros</h1>
        <p className="text-gray-600">Visualiza el inventario completo de vehículos</p>
      </div>

      {/* Success/Error Messages */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => navigate('/carros/create')}
          className="btn-primary"
        >
          ➕ Crear Nuevo Carro
        </button>
        <button
          onClick={() => navigate('/carros/search')}
          className="btn-secondary"
        >
          🔍 Buscar con Filtros
        </button>
        <button
          onClick={loadCarros}
          disabled={isLoading}
          className="btn-secondary"
        >
          🔄 Recargar
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando carros...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">❌ Error al cargar los carros:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="mb-4 text-gray-600">
          <strong>{carros.length}</strong> {carros.length === 1 ? 'carro encontrado' : 'carros encontrados'}
        </div>
      )}

      {/* Carros Grid */}
      {!isLoading && !error && carros.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No hay carros registrados en el sistema</p>
          <button
            onClick={() => navigate('/carros/create')}
            className="mt-4 btn-primary"
          >
            Crear Primer Carro
          </button>
        </div>
      )}

      {!isLoading && !error && carros.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca / Modelo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Año
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transmisión
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Combustible
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puertas
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    A/C
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carros.map((carro) => (
                  <tr key={carro.placa} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                      {carro.placa}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{carro.marca}</div>
                      <div className="text-gray-500">{carro.modelo}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {carro.anio}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {carro.color}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
                      ${carro.precio?.toLocaleString('es-CO') || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        carro.estado === 'NUEVO' ? 'bg-green-100 text-green-800' :
                        carro.estado === 'USADO' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {carro.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      {carro.tipoTransmision}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      {carro.combustible}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      {carro.numeroPuertas}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {carro.tieneAireAcondicionado ? (
                        <span className="text-green-600">✅</span>
                      ) : (
                        <span className="text-gray-400">❌</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(carro.placa)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(carro.placa)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
            Mostrando {carros.length} carro(s)
          </div>
        </div>
      )}
    </div>
  );
}
