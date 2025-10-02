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

interface BuscarObjetoProps {
  goHome: () => void;
}

export const BuscarObjeto: React.FC<BuscarObjetoProps> = ({ goHome }) => {
  const [criterio, setCriterio] = useState('placa');
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState<Carro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResultado(null);

    try {
      // Aquí se hará el fetch al backend
      console.log(`Buscando por ${criterio}: ${valor}`);
      
      // const response = await fetch(`http://localhost:8080/api/carros/buscar?${criterio}=${valor}`);
      // if (!response.ok) throw new Error('Carro no encontrado');
      // const data = await response.json();
      // setResultado(data);
      
      // Simulación de búsqueda
      if (valor.toLowerCase() === 'abc123') {
        setResultado({
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
        });
      } else {
        setError('No se encontró ningún carro con ese criterio');
      }
    } catch {
      setError('Error al buscar el carro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="form-header">
        <h2>🔍 Buscar Objeto por Criterios</h2>
        <button onClick={goHome} className="btn-back">← Volver</button>
      </div>
      
      <form onSubmit={handleBuscar} className="search-form">
        <div className="search-criteria">
          <div className="form-group">
            <label>Buscar por:</label>
            <select 
              value={criterio}
              onChange={(e) => setCriterio(e.target.value)}
            >
              <option value="placa">Placa</option>
              <option value="marca">Marca</option>
              <option value="modelo">Modelo</option>
              <option value="color">Color</option>
              <option value="anio">Año</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Valor a buscar:</label>
            <input 
              type="text" 
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={`Ingrese ${criterio}...`}
              required 
            />
          </div>
        </div>
        
        <button type="submit" className="btn-search" disabled={loading}>
          {loading ? 'Buscando...' : '🔍 Buscar'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <span className="error-icon">❌</span>
          {error}
        </div>
      )}

      {resultado && (
        <div className="search-result">
          <h3>✅ Carro Encontrado</h3>
          <div className="car-card detailed">
            <div className="car-header">
              <h4>{resultado.marca} {resultado.modelo}</h4>
              <span className="car-id">ID: {resultado.id}</span>
            </div>
            <div className="car-info-grid">
              <div className="info-item">
                <strong>Placa:</strong> {resultado.placa}
              </div>
              <div className="info-item">
                <strong>Color:</strong> {resultado.color}
              </div>
              <div className="info-item">
                <strong>Año:</strong> {resultado.anio}
              </div>
              <div className="info-item">
                <strong>Estado:</strong> {resultado.estado}
              </div>
              <div className="info-item">
                <strong>Combustible:</strong> {resultado.combustible}
              </div>
              <div className="info-item">
                <strong>Puertas:</strong> {resultado.numeroPuertas}
              </div>
              <div className="info-item">
                <strong>Aire Acondicionado:</strong> {resultado.tieneAireAcondicionado ? 'Sí' : 'No'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarObjeto;
