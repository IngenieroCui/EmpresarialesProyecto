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

interface EliminarObjetoProps {
  goHome: () => void;
}

export const EliminarObjeto: React.FC<EliminarObjetoProps> = ({ goHome }) => {
  const [step, setStep] = useState<'search' | 'confirm'>('search');
  const [searchValue, setSearchValue] = useState('');
  const [carro, setCarro] = useState<Carro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aquí se hará el fetch al backend
      console.log('Buscando carro con placa:', searchValue);
      
      // const response = await fetch(`http://localhost:8080/api/carros/buscar?placa=${searchValue}`);
      // if (!response.ok) throw new Error('Carro no encontrado');
      // const data = await response.json();
      // setCarro(data);
      
      // Simulación de búsqueda
      if (searchValue.toLowerCase() === 'abc123') {
        setCarro({
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
        setStep('confirm');
      } else {
        setError('No se encontró ningún carro con esa placa');
      }
    } catch {
      setError('Error al buscar el carro');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!carro) return;

    setLoading(true);
    try {
      // Aquí se hará el fetch al backend
      console.log('Eliminando carro:', carro.id);
      
      // const response = await fetch(`http://localhost:8080/api/carros/${carro.id}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Error al eliminar');
      
      alert('Carro eliminado exitosamente');
      goHome();
    } catch {
      alert('Error al eliminar el carro');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setStep('search');
    setCarro(null);
    setSearchValue('');
    setError('');
  };

  if (step === 'search') {
    return (
      <div className="delete-container">
        <div className="form-header">
          <h2>🗑️ Eliminar Objeto</h2>
          <button onClick={goHome} className="btn-back">← Volver</button>
        </div>
        
        <div className="search-step">
          <h3>Paso 1: Buscar el carro a eliminar</h3>
          <div className="warning-message">
            <span className="warning-icon">⚠️</span>
            <strong>Advertencia:</strong> Esta acción no se puede deshacer. El carro será eliminado permanentemente.
          </div>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <label>Placa del carro:</label>
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Ingrese la placa del carro..."
                required 
              />
            </div>
            
            <button type="submit" className="btn-search" disabled={loading}>
              {loading ? 'Buscando...' : '🔍 Buscar Carro'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="delete-container">
      <div className="form-header">
        <h2>🗑️ Confirmar Eliminación</h2>
        <div className="header-actions">
          <button onClick={resetSearch} className="btn-secondary">← Buscar Otro</button>
          <button onClick={goHome} className="btn-back">← Volver</button>
        </div>
      </div>

      <div className="delete-confirmation">
        <div className="danger-message">
          <span className="danger-icon">🚨</span>
          <h3>¿Está seguro de eliminar este carro?</h3>
          <p>Esta acción no se puede deshacer.</p>
        </div>

        <div className="car-to-delete">
          <h4>Información del carro a eliminar:</h4>
          <div className="car-card danger">
            <div className="car-header">
              <h4>{carro?.marca} {carro?.modelo}</h4>
              <span className="car-id">ID: {carro?.id}</span>
            </div>
            <div className="car-info-grid">
              <div className="info-item">
                <strong>Placa:</strong> {carro?.placa}
              </div>
              <div className="info-item">
                <strong>Color:</strong> {carro?.color}
              </div>
              <div className="info-item">
                <strong>Año:</strong> {carro?.anio}
              </div>
              <div className="info-item">
                <strong>Estado:</strong> {carro?.estado}
              </div>
              <div className="info-item">
                <strong>Combustible:</strong> {carro?.combustible}
              </div>
              <div className="info-item">
                <strong>Puertas:</strong> {carro?.numeroPuertas}
              </div>
              <div className="info-item">
                <strong>Aire Acondicionado:</strong> {carro?.tieneAireAcondicionado ? 'Sí' : 'No'}
              </div>
            </div>
          </div>
        </div>

        <div className="delete-actions">
          <button 
            onClick={handleDelete} 
            className="btn-delete"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : '🗑️ Confirmar Eliminación'}
          </button>
          <button onClick={resetSearch} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EliminarObjeto;
