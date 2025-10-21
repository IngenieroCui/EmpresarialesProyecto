import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Carro, CarroFilter } from '../types/Carro';
import { ESTADOS, COMBUSTIBLES, TRANSMISIONES } from '../types/Carro';
import { listCarros } from '../services/carroApi';

interface ActiveFilter {
  id: string;
  field: keyof CarroFilter;
  label: string;
  value: string | number | boolean;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters, carros]);

  const applyFilters = () => {
    if (activeFilters.length === 0) {
      setFilteredCarros(carros);
      return;
    }

    const filtered = carros.filter(carro => {
      return activeFilters.every(filter => {
        const filterValue = filter.value;

        switch (filter.field) {
          case 'placa':
            return carro.placa?.toLowerCase().includes(filterValue.toString().toLowerCase());
          case 'marca':
            return carro.marca?.toLowerCase().includes(filterValue.toString().toLowerCase());
          case 'color':
            return carro.color?.toLowerCase().includes(filterValue.toString().toLowerCase());
          case 'modelo':
            return carro.modelo?.toLowerCase().includes(filterValue.toString().toLowerCase());
          case 'estado':
            return carro.estado?.toLowerCase().includes(filterValue.toString().toLowerCase());
          case 'combustible':
            return carro.combustible?.toLowerCase().includes(filterValue.toString().toLowerCase());
          case 'tipoTransmision':
            return carro.tipoTransmision?.toLowerCase().includes(filterValue.toString().toLowerCase());
          
          case 'anio':
          case 'numeroPuertas':
            return carro[filter.field] === filterValue;
          
          case 'tieneAireAcondicionado':
            return carro.tieneAireAcondicionado === filterValue;
          
          case 'precioMin':
            return (carro.precio || 0) >= (typeof filterValue === 'number' ? filterValue : 0);
          
          case 'precioMax':
            return (carro.precio || 0) <= (typeof filterValue === 'number' ? filterValue : Number.MAX_SAFE_INTEGER);
          
          case 'fechaDesde':
            return !carro.fechaRegistro || carro.fechaRegistro >= filterValue.toString();
          
          case 'fechaHasta':
            return !carro.fechaRegistro || carro.fechaRegistro <= filterValue.toString();
          
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
    let processedValue: string | number | boolean = newFilterValue;
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



  const getSortedCarros = (carrosList: Carro[]): Carro[] => {
    // Ordenar por fecha de registro (más recientes primero) por defecto
    return [...carrosList].sort((a, b) => {
      const aDate = a.fechaRegistro || '';
      const bDate = b.fechaRegistro || '';
      return bDate.localeCompare(aDate);
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

    const commonClasses = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all";
    const commonProps = {
      value: newFilterValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewFilterValue(e.target.value),
      placeholder: `Ingrese valor para ${getFilterOptions().find(opt => opt.value === newFilterField)?.label}`,
      className: commonClasses
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
            title={`Seleccione ${getFilterOptions().find(opt => opt.value === newFilterField)?.label}`}
          />
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  const sortedAndFilteredCarros = getSortedCarros(filteredCarros);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Inventario de Vehículos
              </h2>
              <p className="text-gray-600">
                {sortedAndFilteredCarros.length} {sortedAndFilteredCarros.length === 1 ? 'vehículo encontrado' : 'vehículos encontrados'} de {carros.length} registrados
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={refreshData}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
              <button
                onClick={() => navigate('/carros/create')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar Vehículo
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`rounded-xl p-4 mb-6 border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl p-4 mb-6 bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Filtros de Búsqueda</h3>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                {showFilters ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Ocultar Filtros
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Mostrar Filtros
                  </>
                )}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-6 space-y-6">
              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Filtros Activos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map(filter => (
                      <span
                        key={filter.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg border border-blue-200"
                      >
                        <span className="text-sm">
                          <strong className="font-semibold">{filter.label}:</strong> {filter.displayValue}
                        </span>
                        <button
                          onClick={() => removeFilter(filter.id)}
                          className="p-0.5 hover:bg-blue-200 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Limpiar Todos
                    </button>
                  </div>
                </div>
              )}

              {/* Add New Filter */}
              {getFilterOptions().length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Añadir Filtro:</h4>
                  <div className="space-y-3">
                    <select
                      value={newFilterField}
                      onChange={(e) => {
                        setNewFilterField(e.target.value as keyof CarroFilter);
                        setNewFilterValue('');
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Seleccione un campo</option>
                      {getFilterOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {newFilterField && (
                      <div className="flex gap-3">
                        <div className="flex-1">
                          {renderFilterInput()}
                        </div>
                        <button
                          onClick={addFilter}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!newFilterValue.trim()}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Añadir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-medium">Cargando vehículos...</p>
            </div>
          </div>
        ) : sortedAndFilteredCarros.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              {carros.length === 0 ? (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No hay vehículos registrados</h3>
                    <p className="text-gray-600 mb-4">Comience registrando su primer vehículo en el sistema</p>
                  </div>
                  <button
                    onClick={() => navigate('/carros/create')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all font-medium shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Registrar Primer Vehículo
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-600 mb-4">No hay vehículos que coincidan con los filtros aplicados</p>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Limpiar Filtros
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
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
                  {sortedAndFilteredCarros.map((carro) => (
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
                        {formatCurrency(carro.precio)}
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
                            onClick={() => navigate('/actualizar-formulario', { state: { carro } })}
                            className="text-amber-600 hover:text-amber-900 transition-colors"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => navigate('/eliminar-formulario', { state: { carro } })}
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
              Mostrando {sortedAndFilteredCarros.length} carro(s)
            </div>
          </div>
        )}

        {/* Debug Info (optional, can be removed in production) */}
        {(lastRequest || lastResponse) && (
          <details className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
            <summary className="p-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 rounded-t-2xl">
              Información Técnica de Debug
            </summary>
            <div className="p-6 border-t border-gray-200 space-y-4">
              {lastRequest && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Última Petición:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs text-gray-800 border border-gray-200">
                    {lastRequest}
                  </pre>
                </div>
              )}

              {lastResponse && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Última Respuesta:</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs text-gray-800 border border-gray-200">
                    {lastResponse}
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
