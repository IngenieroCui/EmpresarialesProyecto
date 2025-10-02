import React, { useState } from 'react';

interface Carro {
  id?: number;
  marca: string;
  color: string;
  placa: string;
  combustible: string;
  modelo: string;
  anio: number;
  estado: string;
  numeroPuertas: number;
  tieneAireAcondicionado: boolean;
}

interface ListarObjetosPorFiltroProps {
  goHome: () => void;
}

export const ListarObjetosPorFiltro: React.FC<ListarObjetosPorFiltroProps> = ({ goHome }) => {
  const [filtros, setFiltros] = useState({
    marca: '',
    anio: '',
    estado: '',
    combustible: '',
    tieneAireAcondicionado: ''
  });
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);

    try {
      // Construir query string para el backend
      const queryParams = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      console.log('Buscando con filtros:', filtros);
      
      // const response = await fetch(`http://localhost:8080/api/carros/filtrar?${queryParams}`);
      // const data = await response.json();
      // setCarros(data);
      
      // Simulación de búsqueda filtrada
      const ejemploCarros: Carro[] = [
        {
          id: 1,
          marca: "Toyota",
          modelo: "Corolla",
          color: "Blanco",
          placa: "ABC123",
          combustible: "Gasolina",
          anio: 2023,
          estado: "Nuevo",
          numeroPuertas: 4,
          tieneAireAcondicionado: true
        },
        {
          id: 2,
          marca: "Honda",
          modelo: "Civic",
          color: "Azul",
          placa: "XYZ789",
          combustible: "Gasolina",
          anio: 2022,
          estado: "Usado",
          numeroPuertas: 4,
          tieneAireAcondicionado: true
        }
      ];
      
      // Filtrar resultados según criterios (simulación)
      let resultados = ejemploCarros;
      
      if (filtros.marca) {
        resultados = resultados.filter(carro => 
          carro.marca.toLowerCase().includes(filtros.marca.toLowerCase())
        );
      }
      
      if (filtros.estado) {
        resultados = resultados.filter(carro => carro.estado === filtros.estado);
      }
      
      if (filtros.combustible) {
        resultados = resultados.filter(carro => carro.combustible === filtros.combustible);
      }
      
      if (filtros.anio) {
        resultados = resultados.filter(carro => carro.anio.toString() === filtros.anio);
      }
      
      if (filtros.tieneAireAcondicionado) {
        const tieneAC = filtros.tieneAireAcondicionado === 'true';
        resultados = resultados.filter(carro => carro.tieneAireAcondicionado === tieneAC);
      }
      
      setCarros(resultados);
    } catch {
      alert('Error al buscar carros');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      marca: '',
      anio: '',
      estado: '',
      combustible: '',
      tieneAireAcondicionado: ''
    });
    setCarros([]);
    setHasSearched(false);
  };

  return (
    <div className="filter-container">
      <div className="form-header">
        <h2>🔍 Listar Objetos por Filtro</h2>
        <button onClick={goHome} className="btn-back">← Volver</button>
      </div>
      
      <form onSubmit={handleBuscar} className="filter-form">
        <h3>Criterios de Búsqueda</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Marca:</label>
            <input 
              type="text" 
              value={filtros.marca}
              onChange={(e) => setFiltros({...filtros, marca: e.target.value})}
              placeholder="Ej: Toyota, Honda..."
            />
          </div>
          
          <div className="form-group">
            <label>Año:</label>
            <input 
              type="number" 
              min="1990" 
              max="2025"
              value={filtros.anio}
              onChange={(e) => setFiltros({...filtros, anio: e.target.value})}
              placeholder="Ej: 2023"
            />
          </div>
          
          <div className="form-group">
            <label>Estado:</label>
            <select 
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
              <option value="Seminuevo">Seminuevo</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Combustible:</label>
            <select 
              value={filtros.combustible}
              onChange={(e) => setFiltros({...filtros, combustible: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Aire Acondicionado:</label>
            <select 
              value={filtros.tieneAireAcondicionado}
              onChange={(e) => setFiltros({...filtros, tieneAireAcondicionado: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button type="submit" className="btn-search" disabled={loading}>
            {loading ? 'Buscando...' : '🔍 Buscar con Filtros'}
          </button>
          <button type="button" onClick={limpiarFiltros} className="btn-clear">
            🗑️ Limpiar Filtros
          </button>
        </div>
      </form>

      {hasSearched && (
        <div className="results-section">
          <div className="results-header">
            <h3>Resultados de la Búsqueda</h3>
            <span className="results-count">
              {carros.length} carro{carros.length !== 1 ? 's' : ''} encontrado{carros.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {loading ? (
            <div className="loading">Buscando carros...</div>
          ) : (
            <div className="cars-grid">
              {carros.length === 0 ? (
                <div className="empty-state">
                  <p>No se encontraron carros con los criterios especificados</p>
                  <button onClick={limpiarFiltros} className="btn-secondary">
                    Intentar nueva búsqueda
                  </button>
                </div>
              ) : (
                carros.map((carro) => (
                  <div key={carro.id} className="car-card">
                    <div className="car-header">
                      <h4>{carro.marca} {carro.modelo}</h4>
                      <span className="car-id">ID: {carro.id}</span>
                    </div>
                    <div className="car-details">
                      <p><strong>Placa:</strong> {carro.placa}</p>
                      <p><strong>Color:</strong> {carro.color}</p>
                      <p><strong>Año:</strong> {carro.anio}</p>
                      <p><strong>Estado:</strong> {carro.estado}</p>
                      <p><strong>Combustible:</strong> {carro.combustible}</p>
                      <p><strong>Puertas:</strong> {carro.numeroPuertas}</p>
                      <p><strong>A/C:</strong> {carro.tieneAireAcondicionado ? 'Sí' : 'No'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ListarObjetosPorFiltro;
