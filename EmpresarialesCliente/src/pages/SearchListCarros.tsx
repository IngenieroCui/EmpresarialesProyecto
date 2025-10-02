import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Carro, CarroFilter } from '../types/Carro';
import { ESTADOS, COMBUSTIBLES, TRANSMISIONES } from '../types/Carro';
import { listCarros } from '../services/carroApi';
import './SearchListCarros.css';

export default function SearchListCarros() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  const [lastRequest, setLastRequest] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Carro>('fechaRegistro');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const location = useLocation();

  // Filter state
  const [filters, setFilters] = useState<CarroFilter>({
    placa: '',
    marca: '',
    color: '',
    modelo: '',
    anio: undefined,
    estado: '',
    combustible: '',
    tipoTransmision: '',
    numeroPuertas: undefined,
    tieneAireAcondicionado: undefined,
    precioMin: undefined,
    precioMax: undefined,
    fechaDesde: '',
    fechaHasta: ''
  });

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

  const loadCarros = async (searchFilters?: CarroFilter) => {
    setIsLoading(true);
    setError('');

    try {
      // Build filter object excluding empty values
      const activeFilters = buildActiveFilters(searchFilters || filters);
      
      // Log request
      setLastRequest(JSON.stringify(activeFilters, null, 2));

      const result = await listCarros(activeFilters);
      
      // Log response
      setLastResponse(JSON.stringify(result, null, 2));

      setCarros(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los carros';
      setError(errorMessage);
      setLastResponse(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const buildActiveFilters = (filterObj: CarroFilter): Record<string, unknown> => {
    const activeFilters: Record<string, unknown> = {};
    
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        activeFilters[key] = value;
      }
    });

    return activeFilters;
  };

  const handleFilterChange = (field: keyof CarroFilter, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleSearch = () => {
    loadCarros(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters: CarroFilter = {
      placa: '',
      marca: '',
      color: '',
      modelo: '',
      anio: undefined,
      estado: '',
      combustible: '',
      tipoTransmision: '',
      numeroPuertas: undefined,
      tieneAireAcondicionado: undefined,
      precioMin: undefined,
      precioMax: undefined,
      fechaDesde: '',
      fechaHasta: ''
    };
    setFilters(emptyFilters);
    loadCarros(emptyFilters);
  };

  const handleSort = (field: keyof Carro) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCarros = [...carros].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle undefined/null values
    if (aValue === undefined || aValue === null) aValue = '';
    if (bValue === undefined || bValue === null) bValue = '';

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection === 'asc' 
        ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
        : (bValue ? 1 : 0) - (aValue ? 1 : 0);
    }

    return 0;
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="search-list-page">
      <div className="page-header">
        <h1>Gestión de Carros</h1>
        <p>Busque y filtre carros en el sistema. Deje los campos vacíos para listar todos los carros.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Filter Form */}
      <div className="filter-section">
        <h2>Filtros de Búsqueda</h2>
        
        <div className="filter-grid">
          <div className="filter-group">
            <label>Placa:</label>
            <input
              type="text"
              value={filters.placa || ''}
              onChange={(e) => handleFilterChange('placa', e.target.value.toUpperCase())}
              placeholder="ABC-123"
              maxLength={7}
            />
          </div>

          <div className="filter-group">
            <label>Marca:</label>
            <input
              type="text"
              value={filters.marca || ''}
              onChange={(e) => handleFilterChange('marca', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Modelo:</label>
            <input
              type="text"
              value={filters.modelo || ''}
              onChange={(e) => handleFilterChange('modelo', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Color:</label>
            <input
              type="text"
              value={filters.color || ''}
              onChange={(e) => handleFilterChange('color', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Año:</label>
            <input
              type="number"
              value={filters.anio || ''}
              onChange={(e) => handleFilterChange('anio', e.target.value ? parseInt(e.target.value) : undefined)}
              min="1900"
              max="2100"
            />
          </div>

          <div className="filter-group">
            <label>Estado:</label>
            <select
              value={filters.estado || ''}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
            >
              <option value="">Todos</option>
              {ESTADOS.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Combustible:</label>
            <select
              value={filters.combustible || ''}
              onChange={(e) => handleFilterChange('combustible', e.target.value)}
            >
              <option value="">Todos</option>
              {COMBUSTIBLES.map(combustible => (
                <option key={combustible} value={combustible}>{combustible}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Transmisión:</label>
            <select
              value={filters.tipoTransmision || ''}
              onChange={(e) => handleFilterChange('tipoTransmision', e.target.value)}
            >
              <option value="">Todas</option>
              {TRANSMISIONES.map(transmision => (
                <option key={transmision} value={transmision}>{transmision}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Número de Puertas:</label>
            <input
              type="number"
              value={filters.numeroPuertas || ''}
              onChange={(e) => handleFilterChange('numeroPuertas', e.target.value ? parseInt(e.target.value) : undefined)}
              min="2"
              max="6"
            />
          </div>

          <div className="filter-group">
            <label>Precio Mínimo:</label>
            <input
              type="number"
              value={filters.precioMin || ''}
              onChange={(e) => handleFilterChange('precioMin', e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label>Precio Máximo:</label>
            <input
              type="number"
              value={filters.precioMax || ''}
              onChange={(e) => handleFilterChange('precioMax', e.target.value ? parseFloat(e.target.value) : undefined)}
              min="0"
            />
          </div>

          <div className="filter-group checkbox-group">
            <label>
              <select
                value={filters.tieneAireAcondicionado === undefined ? '' : String(filters.tieneAireAcondicionado)}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange('tieneAireAcondicionado', 
                    value === '' ? undefined : value === 'true'
                  );
                }}
              >
                <option value="">Aire Acond. - Todos</option>
                <option value="true">Con Aire Acondicionado</option>
                <option value="false">Sin Aire Acondicionado</option>
              </select>
            </label>
          </div>
        </div>

        <div className="filter-actions">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
          
          <button
            onClick={handleClearFilters}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="results-section">
        <h2>
          Resultados 
          {carros.length > 0 && (
            <span className="results-count">({carros.length} carro{carros.length !== 1 ? 's' : ''})</span>
          )}
        </h2>
        
        {carros.length === 0 && !isLoading && (
          <div className="no-results">
            <p>No se encontraron carros con los filtros especificados.</p>
            <p>Intente modificar los criterios de búsqueda o limpiar todos los filtros.</p>
          </div>
        )}

        {carros.length > 0 && (
          <div className="table-container">
            <table className="carros-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('placa')} className="sortable">
                    Placa {sortField === 'placa' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('marca')} className="sortable">
                    Marca {sortField === 'marca' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('modelo')} className="sortable">
                    Modelo {sortField === 'modelo' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('color')} className="sortable">
                    Color {sortField === 'color' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('anio')} className="sortable">
                    Año {sortField === 'anio' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('precio')} className="sortable">
                    Precio {sortField === 'precio' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('estado')} className="sortable">
                    Estado {sortField === 'estado' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedCarros.map((carro) => (
                  <tr key={carro.placa}>
                    <td className="placa-cell">{carro.placa}</td>
                    <td>{carro.marca}</td>
                    <td>{carro.modelo}</td>
                    <td>{carro.color}</td>
                    <td>{carro.anio}</td>
                    <td className="precio-cell">{formatCurrency(carro.precio)}</td>
                    <td>
                      <span className={`status-badge status-${carro.estado.toLowerCase()}`}>
                        {carro.estado}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        onClick={() => navigate(`/carros/update/${carro.placa}`)}
                        className="btn btn-small btn-primary"
                        title="Editar carro"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/carros/delete/${carro.placa}`)}
                        className="btn btn-small btn-danger"
                        title="Eliminar carro"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Preview Section */}
      <div className="json-preview">
        <h3>Información Técnica</h3>
        <details>
          <summary>Ver JSON Request/Response</summary>
          <div className="json-content">
            {lastRequest && (
              <div className="json-section">
                <h4>Última Solicitud (GET con filtros):</h4>
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
