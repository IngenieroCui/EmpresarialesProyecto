import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarroForm from '../components/CarroForm';
import type { Carro, CarroUpdateData } from '../types/Carro';
import { getCarroByPlaca, updateCarro } from '../services/carroApi';
import './UpdateCarro.css';

export default function UpdateCarro() {
  const [carro, setCarro] = useState<Carro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCarro, setIsLoadingCarro] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [searchPlaca, setSearchPlaca] = useState<string>('');
  const [lastRequest, setLastRequest] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const navigate = useNavigate();
  const { placa: urlPlaca } = useParams<{ placa: string }>();

  // Load carro if placa is provided in URL
  useEffect(() => {
    if (urlPlaca) {
      setSearchPlaca(urlPlaca);
      
      const loadCarroFromUrl = async () => {
        setIsLoadingCarro(true);
        setError('');
        setCarro(null);

        try {
          setLastRequest(`GET /api/carro?placa=${urlPlaca}`);
          const result = await getCarroByPlaca(urlPlaca.trim());
          
          if (result) {
            setCarro(result);
            setLastResponse(JSON.stringify(result, null, 2));
          } else {
            setError(`No se encontró un carro con la placa: ${urlPlaca}`);
            setLastResponse('Carro no encontrado');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error desconocido al buscar el carro';
          setError(errorMessage);
          setLastResponse(`Error: ${errorMessage}`);
        } finally {
          setIsLoadingCarro(false);
        }
      };

      loadCarroFromUrl();
    }
  }, [urlPlaca]);

  const handleSearchCarro = async (placa?: string) => {
    const placaToSearch = placa || searchPlaca;
    
    if (!placaToSearch.trim()) {
      setError('Por favor ingrese una placa para buscar');
      return;
    }

    setIsLoadingCarro(true);
    setError('');
    setCarro(null);

    try {
      // Log request
      setLastRequest(`GET /api/carro?placa=${placaToSearch}`);

      const result = await getCarroByPlaca(placaToSearch.trim());
      
      if (result) {
        setCarro(result);
        setLastResponse(JSON.stringify(result, null, 2));
      } else {
        setError(`No se encontró un carro con la placa: ${placaToSearch}`);
        setLastResponse('Carro no encontrado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al buscar el carro';
      setError(errorMessage);
      setLastResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoadingCarro(false);
    }
  };

  const handleUpdate = async (data: CarroUpdateData) => {
    if (!carro) {
      setError('No hay carro seleccionado para actualizar');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Log request
      setLastRequest(JSON.stringify(data, null, 2));

      const result = await updateCarro(carro.placa, data);
      
      // Log response
      setLastResponse(JSON.stringify(result, null, 2));

      setSuccessMessage(`Carro con placa ${result.placa} actualizado exitosamente`);
      setCarro(result); // Update local state with new data
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/carros/list', { 
          state: { 
            message: `Carro ${result.placa} actualizado exitosamente`,
            type: 'success'
          } 
        });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el carro';
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
    <div className="update-carro-page">
      <div className="page-header">
        <h1>Actualizar Carro</h1>
        <p>Busque un carro por su placa y actualice sus datos.</p>
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

      {/* Search Section */}
      <div className="search-section">
        <h2>Buscar Carro</h2>
        <div className="search-form">
          <div className="search-group">
            <label htmlFor="search-placa">Placa del Carro:</label>
            <input
              type="text"
              id="search-placa"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value.toUpperCase())}
              placeholder="ABC-123"
              maxLength={7}
              disabled={isLoadingCarro}
            />
          </div>
          
          <button
            onClick={() => handleSearchCarro()}
            disabled={isLoadingCarro || !searchPlaca.trim()}
            className="btn btn-primary"
          >
            {isLoadingCarro ? 'Buscando...' : 'Buscar Carro'}
          </button>
        </div>
      </div>

      {/* Update Form Section */}
      {carro && (
        <div className="form-section">
          <h2>Actualizar Datos del Carro</h2>
          <div className="current-carro-info">
            <p><strong>Carro encontrado:</strong> {carro.marca} {carro.modelo} - {carro.color} ({carro.anio})</p>
            <p><small><em>Nota: La placa no se puede modificar</em></small></p>
          </div>

          <CarroForm
            initialData={carro}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Actualizar Carro"
            showCancelButton={true}
          />
        </div>
      )}

      {/* Instructions */}
      {!carro && !isLoadingCarro && (
        <div className="instructions-section">
          <h3>Instrucciones</h3>
          <ol>
            <li>Ingrese la placa del carro que desea actualizar</li>
            <li>Haga clic en "Buscar Carro" para encontrarlo</li>
            <li>Si el carro existe, aparecerá un formulario con sus datos actuales</li>
            <li>Modifique los campos necesarios</li>
            <li>Haga clic en "Actualizar Carro" para guardar los cambios</li>
          </ol>
          
          <div className="tip">
            <strong>Tip:</strong> También puede acceder directamente desde la lista de carros haciendo clic en el botón "Editar" de cualquier carro.
          </div>
        </div>
      )}

      {/* JSON Preview Section */}
      <div className="json-preview">
        <h3>Información Técnica</h3>
        <details>
          <summary>Ver JSON Request/Response</summary>
          <div className="json-content">
            {lastRequest && (
              <div className="json-section">
                <h4>Última Solicitud:</h4>
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
