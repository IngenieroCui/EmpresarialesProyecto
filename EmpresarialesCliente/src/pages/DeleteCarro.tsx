import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarroForm from '../components/CarroForm';
import type { Carro } from '../types/Carro';
import { getCarroByPlaca, deleteCarro } from '../services/carroApi';
import './DeleteCarro.css';

export default function DeleteCarro() {
  const [carro, setCarro] = useState<Carro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCarro, setIsLoadingCarro] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [searchPlaca, setSearchPlaca] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
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

  const handleSearchCarro = async () => {
    if (!searchPlaca.trim()) {
      setError('⚠️ Debe ingresar una placa para realizar la búsqueda');
      return;
    }

    setIsLoadingCarro(true);
    setError('');
    setCarro(null);

    try {
      // Log request
      setLastRequest(`GET /api/carro?placa=${searchPlaca}`);

      const result = await getCarroByPlaca(searchPlaca.trim());
      
      if (result) {
        setCarro(result);
        setLastResponse(JSON.stringify(result, null, 2));
        // Redirigir a la página de eliminación
        navigate('/eliminar-formulario', { state: { carro: result } });
      } else {
        setError(`No se encontró un carro con la placa: ${searchPlaca}`);
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

  const handleDeleteClick = () => {
    if (carro) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!carro) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setShowConfirmModal(false);

    try {
      // Log request
      setLastRequest(`DELETE /api/carro/${carro.placa}`);

      await deleteCarro(carro.placa);
      
      // Log response
      setLastResponse('Vehículo eliminado exitosamente');

      setSuccessMessage(`✅ Vehículo eliminado correctamente\n\nEl vehículo con placa ${carro.placa} ha sido eliminado del sistema junto con todos sus mantenimientos asociados.`);
      setCarro(null); // Clear the carro from display
      setSearchPlaca(''); // Clear the search field
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/carros/list', { 
          state: { 
            message: `✅ Vehículo ${carro.placa} eliminado correctamente del sistema`,
            type: 'success'
          } 
        });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '❌ Error al eliminar el vehículo. Por favor, intente nuevamente o contacte al administrador del sistema.';
      setError(errorMessage);
      setLastResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    navigate('/carros/list');
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="delete-carro-page">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Volver al Inicio
        </button>
        <h1>🗑️ Eliminar Objeto</h1>
        <p>🔍 Paso 1: Busque un carro por su placa → 🗑️ Paso 2: Confirme la eliminación</p>
        <div className="proceso-steps">
          <span className={`step ${!carro ? 'active' : 'completed'}`}>
            🔍 1. Buscar Carro
          </span>
          <span className="step-arrow">→</span>
          <span className={`step ${carro ? 'active' : ''}`}>
            🗑️ 2. Confirmar Eliminación
          </span>
        </div>
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
            onClick={handleSearchCarro}
            disabled={isLoadingCarro || !searchPlaca.trim()}
            className="btn btn-primary"
          >
            {isLoadingCarro ? 'Buscando...' : 'Buscar Carro'}
          </button>
        </div>
      </div>

      {/* Carro Details Section */}
      {carro && (
        <div className="details-section">
          <h2>Detalles del Carro a Eliminar</h2>
          
          <div className="warning-banner">
            <strong>⚠️ ADVERTENCIA:</strong> Esta acción eliminará permanentemente el carro del sistema.
            Esta operación no se puede deshacer.
          </div>

          <div className="carro-summary">
            <div className="summary-grid">
              <div className="summary-item">
                <label>Placa:</label>
                <span className="placa-value">{carro.placa}</span>
              </div>
              <div className="summary-item">
                <label>Marca:</label>
                <span>{carro.marca}</span>
              </div>
              <div className="summary-item">
                <label>Modelo:</label>
                <span>{carro.modelo}</span>
              </div>
              <div className="summary-item">
                <label>Color:</label>
                <span>{carro.color}</span>
              </div>
              <div className="summary-item">
                <label>Año:</label>
                <span>{carro.anio}</span>
              </div>
              <div className="summary-item">
                <label>Precio:</label>
                <span className="price-value">{formatCurrency(carro.precio)}</span>
              </div>
              <div className="summary-item">
                <label>Estado:</label>
                <span className={`status-badge status-${carro.estado.toLowerCase()}`}>
                  {carro.estado}
                </span>
              </div>
              <div className="summary-item">
                <label>Fecha Registro:</label>
                <span>{carro.fechaRegistro}</span>
              </div>
            </div>
          </div>

          <div className="form-container">
            <h3>Información Completa</h3>
            <CarroForm
              initialData={carro}
              isReadOnly={true}
              onSubmit={() => {}} // No-op since it's read-only
            />
          </div>

          <div className="delete-actions">
            <button
              onClick={handleDeleteClick}
              disabled={isLoading}
              className="btn btn-danger"
            >
              {isLoading ? 'Eliminando...' : 'Eliminar Carro'}
            </button>
            
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!carro && !isLoadingCarro && (
        <div className="instructions-section">
          <h3>Instrucciones</h3>
          <ol>
            <li>Ingrese la placa del carro que desea eliminar</li>
            <li>Haga clic en "Buscar Carro" para encontrarlo</li>
            <li>Si el carro existe, revise cuidadosamente sus detalles</li>
            <li>Confirme que desea eliminar el carro</li>
            <li>Haga clic en "Eliminar Carro" y confirme la operación</li>
          </ol>
          
          <div className="tip">
            <strong>Tip:</strong> También puede acceder directamente desde la lista de carros haciendo clic en el botón "Eliminar" de cualquier carro.
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && carro && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Está seguro que desea eliminar el carro con placa <strong>{carro.placa}</strong>?
            </p>
            <p>
              <strong>Marca:</strong> {carro.marca} <strong>Modelo:</strong> {carro.modelo}
            </p>
            <p className="warning-text">
              Esta acción no se puede deshacer.
            </p>
            
            <div className="modal-actions">
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
                disabled={isLoading}
              >
                Sí, Eliminar
              </button>
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
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
