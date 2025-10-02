import { useState, useEffect } from 'react'
import './App.css'
import { BuscarObjeto } from './components/BuscarObjeto'
import { ActualizarObjeto } from './components/ActualizarObjeto'
import { EliminarObjeto } from './components/EliminarObjeto'
import { ListarObjetosPorFiltro } from './components/ListarObjetosPorFiltro'

// Interfaces
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

// Componentes de páginas individuales
const HomePage = ({ handleAction }: { handleAction: (action: string) => void }) => (
  <>
    <div className="app-logo-section">
      <h2 className="app-name">AutoConcesionario</h2>
      <div className="vehicle-icons">
        <div className="vehicle car">🚗</div>
      </div>
    </div>

    <div className="content-grid">
      {/* Características del Sistema */}
      <section className="features-section">
        <h3 className="section-title">📋 Características del Sistema</h3>
        <ul className="features-list">
          <li className="feature-item">
            <span className="feature-icon">✅</span>
            Gestión completa de automóviles
          </li>
          <li className="feature-item">
            <span className="feature-icon">✅</span>
            Operaciones CRUD completas
          </li>
          <li className="feature-item">
            <span className="feature-icon">✅</span>
            Búsqueda por criterios múltiples
          </li>
          <li className="feature-item">
            <span className="feature-icon">✅</span>
            Cálculos de valores comerciales
          </li>
          <li className="feature-item">
            <span className="feature-icon">✅</span>
            API REST integrada
          </li>
          <li className="feature-item">
            <span className="feature-icon">✅</span>
            Sistema distribuido
          </li>
        </ul>
      </section>

      {/* Acciones Rápidas */}
      <section className="actions-section">
        <h3 className="section-title">⚡ Operaciones CRUD</h3>
        <div className="actions-grid">
          <button 
            className="action-btn btn-blue"
            onClick={() => handleAction('adicionar-objeto')}
          >
            <span className="btn-icon">➕</span>
            Adicionar Objeto
          </button>
          <button 
            className="action-btn btn-green"
            onClick={() => handleAction('listar-objetos')}
          >
            <span className="btn-icon">📋</span>
            Listar Objetos
          </button>
          <button 
            className="action-btn btn-purple"
            onClick={() => handleAction('buscar-objeto')}
          >
            <span className="btn-icon">🔍</span>
            Buscar Objeto
          </button>
          <button 
            className="action-btn btn-orange"
            onClick={() => handleAction('actualizar-objeto')}
          >
            <span className="btn-icon">✏️</span>
            Actualizar Objeto
          </button>
          <button 
            className="action-btn btn-red"
            onClick={() => handleAction('eliminar-objeto')}
          >
            <span className="btn-icon">🗑️</span>
            Eliminar Objeto
          </button>
          <button 
            className="action-btn btn-teal"
            onClick={() => handleAction('listar-objetos-por-filtro')}
          >
            <span className="btn-icon">🔍</span>
            Listar por Filtro
          </button>
        </div>
      </section>
    </div>
  </>
);

const AdicionarObjeto = ({ goHome }: { goHome: () => void }) => {
  const [carro, setCarro] = useState<Carro>({
    marca: '',
    color: '',
    placa: '',
    combustible: 'Gasolina',
    modelo: '',
    anio: new Date().getFullYear(),
    estado: 'Nuevo',
    numeroPuertas: 4,
    tieneAireAcondicionado: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aquí se hará el fetch al backend
      console.log('Enviando carro:', carro);
      // const response = await fetch('http://localhost:8080/api/carros', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(carro)
      // });
      alert('Carro agregado exitosamente');
      goHome();
    } catch {
      alert('Error al agregar el carro');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>➕ Adicionar Nuevo Carro</h2>
        <button onClick={goHome} className="btn-back">← Volver</button>
      </div>
      
      <form onSubmit={handleSubmit} className="car-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Marca:</label>
            <input 
              type="text" 
              value={carro.marca}
              onChange={(e) => setCarro({...carro, marca: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Modelo:</label>
            <input 
              type="text" 
              value={carro.modelo}
              onChange={(e) => setCarro({...carro, modelo: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Color:</label>
            <input 
              type="text" 
              value={carro.color}
              onChange={(e) => setCarro({...carro, color: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Placa:</label>
            <input 
              type="text" 
              value={carro.placa}
              onChange={(e) => setCarro({...carro, placa: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Combustible:</label>
            <select 
              value={carro.combustible}
              onChange={(e) => setCarro({...carro, combustible: e.target.value})}
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
              value={carro.anio}
              onChange={(e) => setCarro({...carro, anio: parseInt(e.target.value)})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Estado:</label>
            <select 
              value={carro.estado}
              onChange={(e) => setCarro({...carro, estado: e.target.value})}
            >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
              <option value="Seminuevo">Seminuevo</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Número de Puertas:</label>
            <select 
              value={carro.numeroPuertas}
              onChange={(e) => setCarro({...carro, numeroPuertas: parseInt(e.target.value)})}
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
              checked={carro.tieneAireAcondicionado}
              onChange={(e) => setCarro({...carro, tieneAireAcondicionado: e.target.checked})}
            />
            Tiene Aire Acondicionado
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-submit">Guardar Carro</button>
          <button type="button" onClick={goHome} className="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

const ListarObjetos = ({ goHome }: { goHome: () => void }) => {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCarros = async () => {
    setLoading(true);
    try {
      // Aquí se hará el fetch al backend
      // const response = await fetch('http://localhost:8080/api/carros');
      // const data = await response.json();
      // setCarros(data);
      
      // Datos de ejemplo
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
        }
      ];
      setCarros(ejemploCarros);
    } catch {
      alert('Error al cargar los carros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarros();
  }, []);

  return (
    <div className="list-container">
      <div className="form-header">
        <h2>📋 Lista de Carros</h2>
        <button onClick={goHome} className="btn-back">← Volver</button>
      </div>
      
      {loading ? (
        <div className="loading">Cargando carros...</div>
      ) : (
        <div className="cars-grid">
          {carros.length === 0 ? (
            <div className="empty-state">
              <p>No hay carros registrados</p>
            </div>
          ) : (
            carros.map((carro) => (
              <div key={carro.id} className="car-card">
                <h3>{carro.marca} {carro.modelo}</h3>
                <div className="car-details">
                  <p><strong>Color:</strong> {carro.color}</p>
                  <p><strong>Placa:</strong> {carro.placa}</p>
                  <p><strong>Año:</strong> {carro.anio}</p>
                  <p><strong>Estado:</strong> {carro.estado}</p>
                  <p><strong>Puertas:</strong> {carro.numeroPuertas}</p>
                  <p><strong>A/C:</strong> {carro.tieneAireAcondicionado ? 'Sí' : 'No'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="list-actions">
        <button onClick={fetchCarros} className="btn-refresh">🔄 Actualizar</button>
      </div>
    </div>
  );
};

// Componente principal
function App() {
  const [currentView, setCurrentView] = useState('home');
  const [showAbout, setShowAbout] = useState(false);

  const handleAction = (action: string) => {
    setCurrentView(action);
  };

  const goHome = () => {
    setCurrentView('home');
  };

  const renderView = () => {
    switch (currentView) {
      case 'adicionar-objeto':
        return <AdicionarObjeto goHome={goHome} />;
      case 'listar-objetos':
        return <ListarObjetos goHome={goHome} />;
      case 'buscar-objeto':
        return <BuscarObjeto goHome={goHome} />;
      case 'actualizar-objeto':
        return <ActualizarObjeto goHome={goHome} />;
      case 'eliminar-objeto':
        return <EliminarObjeto goHome={goHome} />;
      case 'listar-objetos-por-filtro':
        return <ListarObjetosPorFiltro goHome={goHome} />;
      default:
        return <HomePage handleAction={handleAction} />;
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <button 
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={goHome}
          >
            🏠 Inicio
          </button>
          <button className="nav-btn">🚗 Carro</button>
          <button className="nav-btn">⚙️ Configuración</button>
          <button 
            className="nav-btn"
            onClick={() => setShowAbout(!showAbout)}
          >
            ❓ Ayuda
          </button>
        </nav>
        <div className="title-section">
          <h1 className="main-title">🚗 CONCESIONARIO AAA</h1>
          <p className="subtitle">Sistema de Gestión de Automóviles - CRUD REST API</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* About Modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Acerca de...</h3>
              <button onClick={() => setShowAbout(false)} className="modal-close">✕</button>
            </div>
            <div className="modal-body">
              <h4>AutoConcesionario v2.0.1</h4>
              <p>Sistema Integral de Gestión de Automóviles</p>
              <br />
              <p><strong>Desarrollado por:</strong></p>
              <ul>
                <li>Sebastián Salinas Jure</li>
                <li>David Perea</li>
                <li>Julio Salinas</li>
              </ul>
              <br />
              <p><strong>Universidad de Ibagué</strong></p>
              <p>Facultad de Ingeniería</p>
              <p>Desarrollo de Aplicaciones Empresariales</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-stats">
          <span>🚗 Carros Registrados: 0</span>
          <span>🔄 API REST Activa</span>
          <span>💾 Sistema CRUD Operacional</span>
        </div>
        <p className="footer-text">© 2025 - Sistema Distribuido con Servicios Web REST</p>
      </footer>
    </div>
  );
}

export default App;
