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

interface ActualizarObjetoProps {
  goHome: () => void;
}

export const ActualizarObjeto: React.FC<ActualizarObjetoProps> = ({ goHome }) => {
  const [step, setStep] = useState<'search' | 'edit'>('search');
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
        setStep('edit');
      } else {
        setError('No se encontró ningún carro con esa placa');
      }
    } catch {
      setError('Error al buscar el carro');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carro) return;

    setLoading(true);
    try {
      // Aquí se hará el fetch al backend
      console.log('Actualizando carro:', carro);
      
      // const response = await fetch(`http://localhost:8080/api/carros/${carro.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(carro)
      // });
      // if (!response.ok) throw new Error('Error al actualizar');
      
      alert('Carro actualizado exitosamente');
      goHome();
    } catch {
      alert('Error al actualizar el carro');
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
      <div className="update-container">
        <div className="form-header">
          <h2>✏️ Actualizar Objeto</h2>
          <button onClick={goHome} className="btn-back">← Volver</button>
        </div>
        
        <div className="search-step">
          <h3>Paso 1: Buscar el carro a actualizar</h3>
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
    <div className="update-container">
      <div className="form-header">
        <h2>✏️ Actualizar Carro</h2>
        <div className="header-actions">
          <button onClick={resetSearch} className="btn-secondary">← Buscar Otro</button>
          <button onClick={goHome} className="btn-back">← Volver</button>
        </div>
      </div>

      <div className="update-info">
        <p>Editando: <strong>{carro?.marca} {carro?.modelo}</strong> (ID: {carro?.id})</p>
      </div>
      
      <form onSubmit={handleUpdate} className="car-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Marca:</label>
            <input 
              type="text" 
              value={carro?.marca || ''}
              onChange={(e) => setCarro(prev => prev ? {...prev, marca: e.target.value} : null)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Modelo:</label>
            <input 
              type="text" 
              value={carro?.modelo || ''}
              onChange={(e) => setCarro(prev => prev ? {...prev, modelo: e.target.value} : null)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Color:</label>
            <input 
              type="text" 
              value={carro?.color || ''}
              onChange={(e) => setCarro(prev => prev ? {...prev, color: e.target.value} : null)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Placa:</label>
            <input 
              type="text" 
              value={carro?.placa || ''}
              onChange={(e) => setCarro(prev => prev ? {...prev, placa: e.target.value} : null)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Combustible:</label>
            <select 
              value={carro?.combustible || 'Gasolina'}
              onChange={(e) => setCarro(prev => prev ? {...prev, combustible: e.target.value} : null)}
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Eléctrico">Eléctrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Año:</label>
            <input 
              type="number" 
              min="1990" 
              max="2025"
              value={carro?.anio || new Date().getFullYear()}
              onChange={(e) => setCarro(prev => prev ? {...prev, anio: parseInt(e.target.value)} : null)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Estado:</label>
            <select 
              value={carro?.estado || 'Nuevo'}
              onChange={(e) => setCarro(prev => prev ? {...prev, estado: e.target.value} : null)}
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
              <option value="Seminuevo">Seminuevo</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Número de Puertas:</label>
            <select 
              value={carro?.numeroPuertas || 4}
              onChange={(e) => setCarro(prev => prev ? {...prev, numeroPuertas: parseInt(e.target.value)} : null)}
            >
              <option value={2}>2 Puertas</option>
              <option value={4}>4 Puertas</option>
              <option value={5}>5 Puertas</option>
            </select>
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={carro?.tieneAireAcondicionado || false}
              onChange={(e) => setCarro(prev => prev ? {...prev, tieneAireAcondicionado: e.target.checked} : null)}
            />
            Tiene Aire Acondicionado
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Carro'}
          </button>
          <button type="button" onClick={resetSearch} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActualizarObjeto;
