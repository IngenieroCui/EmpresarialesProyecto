import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarroForm from '../components/CarroForm';
import type { CarroCreateData } from '../types/Carro';
import { createCarro } from '../services/carroApi';
import { getCurrentApiDate } from '../utils/date';

export default function CreateCarro() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [lastRequest, setLastRequest] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (data: CarroCreateData) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    // Ensure fechaRegistro is set if empty
    if (!data.fechaRegistro.trim()) {
      data.fechaRegistro = getCurrentApiDate();
    }

    try {
      // Log request
      setLastRequest(JSON.stringify(data, null, 2));

      const result = await createCarro(data);
      
      // Log response
      setLastResponse(JSON.stringify(result, null, 2));

      setSuccessMessage(`Carro creado exitosamente con placa: ${result.placa}`);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/carros/list', { 
          state: { 
            message: `Carro ${result.placa} creado exitosamente`,
            type: 'success'
          } 
        });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el carro';
      setError(errorMessage);
      setLastResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/carros/list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Registrar Nuevo Vehículo</h1>
              <p className="text-gray-600 mt-1">Complete todos los campos requeridos para agregar un vehículo al inventario</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-xl p-4 mb-6 bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-red-800">Error al crear vehículo</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl p-4 mb-6 bg-emerald-50 border border-emerald-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-emerald-800">Vehículo creado exitosamente</p>
                <p className="text-emerald-700 text-sm mt-1">{successMessage}</p>
                <p className="text-emerald-600 text-xs mt-2">Redirigiendo a la lista de vehículos...</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <CarroForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Registrar Vehículo"
            showCancelButton={true}
          />
        </div>

        {/* JSON Preview Section */}
        {(lastRequest || lastResponse) && (
          <details className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
            <summary className="p-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 rounded-t-2xl flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Información Técnica - Request/Response
            </summary>
            <div className="p-6 border-t border-gray-200 space-y-4">
              {lastRequest && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Última Solicitud (POST):</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs text-gray-800 border border-gray-200">
                    <code>{lastRequest}</code>
                  </pre>
                </div>
              )}
              {lastResponse && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Última Respuesta:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs text-gray-800 border border-gray-200">
                    <code>{lastResponse}</code>
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
