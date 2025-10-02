import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Carro, CarroFilter } from '../types/Carro';
import { ESTADOS, COMBUSTIBLES, TRANSMISIONES } from '../types/Carro';
import { listCarros } from '../services/carroApi';
import './SearchListCarros.css';

interface ActiveFilter {
  id: string;
  field: keyof CarroFilter;
  label: string;
  value: any;
  displayValue: string;
}

export default function SearchListCarros() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [filteredCarros, setFilteredCarros] = useState<Carro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  const [lastRequest, setLastRequest] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Carro>('fechaRegistro');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [newFilterField, setNewFilterField] = useState<keyof CarroFilter | ''>('');
  const [newFilterValue, setNewFilterValue] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for messages from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage({
        text: location.state.message,
        type: location.state.type || 'success'
      });
      
      // Clear the message after 5 seconds
      setTimeout(() => setMessage({ text: '', type: 'success' }), 5000);
      
      // Clear the navigation state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Load all carros on component mount
  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      setError('');

      try {
        const result = await listCarros();
        setLastRequest('{}');
        setLastResponse(JSON.stringify(result, null, 2));
        setCarros(result);
        setFilteredCarros(result); // Mostrar todos inicialmente
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los carros';
        setError(errorMessage);
        setLastResponse(`Error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFilters();
  }, [activeFilters, carros]);

  const applyFilters = () => {
    if (activeFilters.length === 0) {
      setFilteredCarros(carros);
      return;
    }

    const filtered = carros.filter(carro => {
      return activeFilters.every(filter => {
        const carroValue = carro[filter.field];
        const filterValue = filter.value;

        switch (filter.field) {
          case 'placa':
          case 'marca':
          case 'color':
          case 'modelo':
          case 'estado':
          case 'combustible':
          case 'tipoTransmision':
            return carroValue?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
          
          case 'anio':
          case 'numeroPuertas':
            return carroValue === filterValue;
          
          case 'tieneAireAcondicionado':
            return carroValue === filterValue;
          
          case 'precioMin':
            return (carro.precio || 0) >= filterValue;
          
          case 'precioMax':
            return (carro.precio || 0) <= filterValue;
          
          case 'fechaDesde':
            return !carro.fechaRegistro || carro.fechaRegistro >= filterValue;
          
          case 'fechaHasta':
            return !carro.fechaRegistro || carro.fechaRegistro <= filterValue;
          
          default:
            return true;
        }
      });
    });

    setFilteredCarros(filtered);
  };

  const getFilterOptions = (): { value: keyof CarroFilter; label: string }[] => {
    const existingFields = activeFilters.map(f => f.field);
    
    const allOptions: { value: keyof CarroFilter; label: string }[] = [
      { value: 'placa', label: 'Placa' },
      { value: 'marca', label: 'Marca' },
      { value: 'color', label: 'Color' },
      { value: 'modelo', label: 'Modelo' },
      { value: 'anio', label: 'Año' },
      { value: 'estado', label: 'Estado' },
      { value: 'combustible', label: 'Combustible' },
      { value: 'tipoTransmision', label: 'Transmisión' },
      { value: 'numeroPuertas', label: 'Número de Puertas' },
      { value: 'tieneAireAcondicionado', label: 'Aire Acondicionado' },
      { value: 'precioMin', label: 'Precio Mínimo' },
      { value: 'precioMax', label: 'Precio Máximo' },
      { value: 'fechaDesde', label: 'Fecha Desde' },
      { value: 'fechaHasta', label: 'Fecha Hasta' }
    ];

    return allOptions.filter(option => !existingFields.includes(option.value));
  };

  const addFilter = () => {
    if (!newFilterField || !newFilterValue.trim()) return;

    const fieldLabel = getFilterOptions().find(opt => opt.value === newFilterField)?.label || newFilterField;
    let processedValue: any = newFilterValue;
    let displayValue = newFilterValue;

    // Process value based on field type
    switch (newFilterField) {
      case 'anio':
      case 'numeroPuertas':
      case 'precioMin':
      case 'precioMax':
        processedValue = parseInt(newFilterValue);
        if (isNaN(processedValue)) return;
        break;
      
      case 'tieneAireAcondicionado':
        processedValue = newFilterValue.toLowerCase() === 'true' || newFilterValue.toLowerCase() === 'sí' || newFilterValue === '1';
        displayValue = processedValue ? 'Sí' : 'No';
        break;
    }

    const newFilter: ActiveFilter = {
      id: Date.now().toString(),
      field: newFilterField,
      label: fieldLabel,
      value: processedValue,
      displayValue: displayValue
    };

    setActiveFilters(prev => [...prev, newFilter]);
    setNewFilterField('');
    setNewFilterValue('');
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const handleSort = (field: keyof Carro) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedCarros = (carrosList: Carro[]): Carro[] => {
    return [...carrosList].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const formatCurrency = (value?: number): string => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('es-CO');
    } catch {
      return dateString;
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await listCarros();
      setLastRequest('{}');
      setLastResponse(JSON.stringify(result, null, 2));
      setCarros(result);
      setFilteredCarros(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los carros';
      setError(errorMessage);
      setLastResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFilterInput = () => {
    if (!newFilterField) return null;

    const commonProps = {
      value: newFilterValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewFilterValue(e.target.value),
      placeholder: `Ingrese valor para ${getFilterOptions().find(opt => opt.value === newFilterField)?.label}`
    };

    switch (newFilterField) {
      case 'estado':
        return (
          <select {...commonProps}>
            <option value="">Seleccione estado</option>
            {ESTADOS.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        );

      case 'combustible':
        return (
          <select {...commonProps}>
            <option value="">Seleccione combustible</option>
            {COMBUSTIBLES.map(combustible => (
              <option key={combustible} value={combustible}>{combustible}</option>
            ))}
          </select>
        );

      case 'tipoTransmision':
        return (
          <select {...commonProps}>
            <option value="">Seleccione transmisión</option>
            {TRANSMISIONES.map(transmision => (
              <option key={transmision} value={transmision}>{transmision}</option>
            ))}
          </select>
        );

      case 'numeroPuertas':
        return (
          <select {...commonProps}>
            <option value="">Seleccione número de puertas</option>
            <option value="2">2 puertas</option>
            <option value="3">3 puertas</option>
            <option value="4">4 puertas</option>
            <option value="5">5 puertas</option>
          </select>
        );

      case 'tieneAireAcondicionado':
        return (
          <select {...commonProps}>
            <option value="">Seleccione</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        );

      case 'anio':
      case 'precioMin':
      case 'precioMax':
        return (
          <input 
            type="number" 
            {...commonProps}
            min={newFilterField === 'anio' ? 1900 : 0}
            max={newFilterField === 'anio' ? new Date().getFullYear() + 1 : undefined}
          />
        );

      case 'fechaDesde':
      case 'fechaHasta':
        return (
          <input 
            type="date" 
            {...commonProps}
          />
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const sortedAndFilteredCarros = getSortedCarros(filteredCarros);

  return (
    <div className="search-container">
      {/* Header */}
      <div className="form-header">
        <h2>🚗 Lista de Carros ({sortedAndFilteredCarros.length} encontrados)</h2>
        <div className="header-actions">
          <button onClick={refreshData} className="btn-secondary" disabled={isLoading}>
            🔄 Actualizar
          </button>
          <button onClick={() => navigate('/carros/create')} className="btn-secondary">
            ➕ Crear Nuevo
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {message.text && (
        <div className={`${message.type === 'success' ? 'success' : 'error'}-message`}>
          <span className={`${message.type === 'success' ? 'success' : 'error'}-icon`}>
            {message.type === 'success' ? '✅' : '❌'}
          </span>
          {message.text}
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="filter-form">
        <div className="filter-header">
          <h3>🔍 Filtros</h3>
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="btn-secondary"
          >
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {showFilters && (
          <>
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="active-filters">
                <h4>Filtros Activos:</h4>
                <div className="filter-tags">
                  {activeFilters.map(filter => (
                    <span key={filter.id} className="filter-tag">
                      <strong>{filter.label}:</strong> {filter.displayValue}
                      <button 
                        onClick={() => removeFilter(filter.id)}
                        className="remove-filter"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <button onClick={clearAllFilters} className="btn-clear">
                    Limpiar Todos
                  </button>
                </div>
              </div>
            )}

            {/* Add New Filter */}
            {getFilterOptions().length > 0 && (
              <div className="add-filter">
                <h4>Añadir Filtro:</h4>
                <div className="filter-input-group">
                  <select 
                    value={newFilterField} 
                    onChange={(e) => {
                      setNewFilterField(e.target.value as keyof CarroFilter);
                      setNewFilterValue('');
                    }}
                  >
                    <option value="">Seleccione campo</option>
                    {getFilterOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  {newFilterField && (
                    <div className="filter-value-input">
                      {renderFilterInput()}
                      <button 
                        onClick={addFilter}
                        className="btn-search"
                        disabled={!newFilterValue.trim()}
                      >
                        ➕ Añadir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <h3>Resultados</h3>
          <div className="results-count">
            {sortedAndFilteredCarros.length} de {carros.length} carros
          </div>
        </div>

        {isLoading ? (
          <div className="loading">⏳ Cargando carros...</div>
        ) : sortedAndFilteredCarros.length === 0 ? (
          <div className="empty-state">
            {carros.length === 0 ? (
              <>
                <p>📭 No hay carros registrados en el sistema.</p>
                <button 
                  onClick={() => navigate('/carros/create')} 
                  className="btn-submit"
                  style={{ marginTop: '1rem' }}
                >
                  ➕ Crear el primer carro
                </button>
              </>
            ) : (
              <>
                <p>🔍 No se encontraron carros con los filtros aplicados.</p>
                <button 
                  onClick={clearAllFilters} 
                  className="btn-clear"
                  style={{ marginTop: '1rem' }}
                >
                  🗑️ Limpiar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="cars-grid">
            {sortedAndFilteredCarros.map((carro) => (
              <div key={carro.placa} className="car-card">
                <div className="car-header">
                  <h4>{carro.marca} {carro.modelo}</h4>
                  <span className="car-id">#{carro.placa}</span>
                </div>
                
                <div className="car-info-grid">
                  <div className="info-item">
                    <strong>Color:</strong> {carro.color}
                  </div>
                  <div className="info-item">
                    <strong>Año:</strong> {carro.anio}
                  </div>
                  <div className="info-item">
                    <strong>Estado:</strong> {carro.estado}
                  </div>
                  <div className="info-item">
                    <strong>Combustible:</strong> {carro.combustible}
                  </div>
                  <div className="info-item">
                    <strong>Transmisión:</strong> {carro.tipoTransmision}
                  </div>
                  <div className="info-item">
                    <strong>Puertas:</strong> {carro.numeroPuertas}
                  </div>
                  <div className="info-item">
                    <strong>A/C:</strong> {carro.tieneAireAcondicionado ? 'Sí' : 'No'}
                  </div>
                  <div className="info-item">
                    <strong>Precio:</strong> {formatCurrency(carro.precio)}
                  </div>
                  <div className="info-item">
                    <strong>Registro:</strong> {formatDate(carro.fechaRegistro)}
                  </div>
                </div>

                <div className="car-actions">
                  <button 
                    onClick={() => navigate('/actualizar-formulario', { state: { carro } })}
                    className="btn-secondary"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => navigate('/eliminar-formulario', { state: { carro } })}
                    className="btn-delete"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Info (optional, can be removed in production) */}
      {(lastRequest || lastResponse) && (
        <details className="debug-section">
          <summary>🔧 Información de Debug</summary>
          
          {lastRequest && (
            <div className="debug-info">
              <h4>Última Petición:</h4>
              <pre>{lastRequest}</pre>
            </div>
          )}
          
          {lastResponse && (
            <div className="debug-info">
              <h4>Última Respuesta:</h4>
              <pre>{lastResponse}</pre>
            </div>
          )}
        </details>
      )}
    </div>
  );
}
