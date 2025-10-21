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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carros.map((carro) => (
            <div
              key={carro.placa}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                <h3 className="text-xl font-bold">🚗 {carro.marca} {carro.modelo}</h3>
                <p className="text-blue-100 text-sm">{carro.anio}</p>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600 text-sm">Placa:</span>
                  <span className="font-semibold text-gray-800">{carro.placa}</span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600 text-sm">Color:</span>
                  <span className="font-medium text-gray-800">{carro.color}</span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600 text-sm">Precio:</span>
                  <span className="font-bold text-green-600">
                    ${carro.precio?.toLocaleString('es-CO') || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600 text-sm">Transmisión:</span>
                  <span className="text-gray-800">{carro.tipoTransmision}</span>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600 text-sm">Combustible:</span>
                  <span className="text-gray-800">{carro.combustible}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">A/C:</span>
                  <span className={carro.tieneAireAcondicionado ? 'text-green-600' : 'text-gray-400'}>
                    {carro.tieneAireAcondicionado ? '✅ Sí' : '❌ No'}
                  </span>
                </div>
              </div>

              {/* Card Footer - Actions */}
              <div className="px-6 py-4 bg-gray-50 flex gap-2">
                <button
                  onClick={() => handleEdit(carro.placa)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(carro.placa)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
