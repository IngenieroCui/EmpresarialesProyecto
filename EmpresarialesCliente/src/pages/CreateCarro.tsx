import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarroForm from '../components/CarroForm';
import type { CarroCreateData } from '../types/Carro';
import { createCarro } from '../services/carroApi';
import { getCurrentApiDate } from '../utils/date';
import './CreateCarro.css';

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
    <div className="create-carro-page">
      <div className="page-header">
        <h1>Crear Nuevo Carro</h1>
        <p>Complete todos los campos requeridos para registrar un nuevo carro en el sistema.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <strong>Éxito:</strong> {successMessage}
          <br />
          <small>Redirigiendo a la lista de carros...</small>
        </div>
      )}

      <div className="form-container">
        <CarroForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitButtonText="Crear Carro"
          showCancelButton={true}
        />
      </div>

      {/* JSON Preview Section */}
      <div className="json-preview">
        <h3>Información Técnica</h3>
        <details>
          <summary>Ver JSON Request/Response</summary>
          <div className="json-content">
            {lastRequest && (
              <div className="json-section">
                <h4>Última Solicitud (POST):</h4>
                <pre><code>{lastRequest}</code></pre>
              </div>
            )}
            {lastResponse && (
              <div className="json-section">
                <h4>Última Respuesta:</h4>
                <pre><code>{lastResponse}</code></pre>
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
