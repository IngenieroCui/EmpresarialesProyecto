import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Carro } from '../types/Carro';
import { getCarroByPlaca } from '../services/carroApi';
import './SearchCarro.css';

export default function SearchCarro() {
  const [searchPlaca, setSearchPlaca] = useState<string>('');
  const [carro, setCarro] = useState<Carro | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchPlaca.trim()) {
      setError('Por favor ingrese una placa para buscar');
      return;
    }

    setIsLoading(true);
    setError('');
    setCarro(null);
    setHasSearched(true);

    try {
      const result = await getCarroByPlaca(searchPlaca.trim());
      
      if (result) {
        setCarro(result);
      } else {
        setError(`No se encontró un carro con la placa: ${searchPlaca}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al buscar el carro';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="search-carro-container">
      {/* Header */}
      <div className="form-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Volver al Inicio
        </button>
        <h2>🔍 Buscar Objeto</h2>
        <p>Busque un carro específico por su placa única.</p>
      </div>

      {/* Search Form */}
      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <label htmlFor="placa">Placa del Carro</label>
            <input
              type="text"
              id="placa"
              value={searchPlaca}
              onChange={(e) => setSearchPlaca(e.target.value.toUpperCase())}
              placeholder="Ej: ABC-123"
              className="search-input"
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-search"
            disabled={isLoading || !searchPlaca.trim()}
          >
            {isLoading ? '🔍 Buscando...' : '🔍 Buscar Carro'}
          </button>
        </form>
      </div>

      {/* Error Messages */}
      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !isLoading && (
        <div className="search-results">
          {carro ? (
            <div className="carro-found">
              <div className="result-header">
                <h3>✅ Carro Encontrado</h3>
                <div className="result-actions">
                  <button 
                    onClick={() => navigate('/actualizar-formulario', { state: { carro } })}
                    className="btn-action btn-update"
                  >
                    ✏️ Actualizar
                  </button>
                  <button 
                    onClick={() => navigate('/eliminar-formulario', { state: { carro } })}
                    className="btn-action btn-delete"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>

              <div className="carro-details">
                <div className="detail-section">
                  <h4>📋 Información Básica</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Placa:</label>
                      <span className="placa-badge">{carro.placa}</span>
                    </div>
                    <div className="detail-item">
                      <label>Marca:</label>
                      <span>{carro.marca}</span>
                    </div>
                    <div className="detail-item">
                      <label>Modelo:</label>
                      <span>{carro.modelo}</span>
                    </div>
                    <div className="detail-item">
                      <label>Año:</label>
                      <span>{carro.anio}</span>
                    </div>
                    <div className="detail-item">
                      <label>Color:</label>
                      <span>{carro.color}</span>
                    </div>
                    <div className="detail-item">
                      <label>Estado:</label>
                      <span className={`estado-badge estado-${carro.estado?.toLowerCase()}`}>
                        {carro.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>⚙️ Especificaciones Técnicas</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Combustible:</label>
                      <span className={`combustible-badge combustible-${carro.combustible?.toLowerCase()}`}>
                        {carro.combustible}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Transmisión:</label>
                      <span>{carro.tipoTransmision}</span>
                    </div>
                    <div className="detail-item">
                      <label>Puertas:</label>
                      <span>{carro.numeroPuertas}</span>
                    </div>
                    <div className="detail-item">
                      <label>Aire Acondicionado:</label>
                      <span className={`ac-badge ${carro.tieneAireAcondicionado ? 'ac-si' : 'ac-no'}`}>
                        {carro.tieneAireAcondicionado ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>💰 Información Comercial</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Precio:</label>
                      <span className="price-badge">{formatCurrency(carro.precio)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Fecha de Registro:</label>
                      <span>{formatDate(carro.fechaRegistro)}</span>
                    </div>
                  </div>
                </div>

                {carro.informacionCompleta && (
                  <div className="detail-section">
                    <h4>📄 Información Completa</h4>
                    <pre className="info-completa">{carro.informacionCompleta}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="carro-not-found">
              <div className="not-found-icon">🚫</div>
              <h3>Carro No Encontrado</h3>
              <p>No se encontró ningún carro con la placa: <strong>{searchPlaca}</strong></p>
              <button 
                onClick={() => {
                  setSearchPlaca('');
                  setHasSearched(false);
                  setError('');
                }}
                className="btn-retry"
              >
                🔄 Buscar Otro
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!hasSearched && (
        <div className="instructions">
          <h3>📝 Instrucciones</h3>
          <ol>
            <li>Ingrese la placa del carro que desea buscar</li>
            <li>Haga clic en "Buscar Carro"</li>
            <li>Si el carro existe, verá toda su información</li>
            <li>Podrá acceder directamente a actualizar o eliminar el carro</li>
          </ol>
        </div>
      )}
    </div>
  );
}
