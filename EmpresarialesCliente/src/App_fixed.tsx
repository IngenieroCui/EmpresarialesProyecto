import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CreateCarro from './pages/CreateCarro';
import SearchListCarros from './pages/SearchListCarros';
import UpdateCarro from './pages/UpdateCarro';
import DeleteCarro from './pages/DeleteCarro';
import './App.css';

// Home Page Component
const HomePage = () => {
  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <>
      <div className="app-logo-section">
        <div className="vehicle-icons">
          <div className="vehicle car">🚗</div>
          <div className="vehicle car">🚙</div>
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
          <h3 className="section-title">⚡ Acciones Rápidas</h3>
          <div className="actions-grid">
            <button 
              className="action-btn btn-blue"
              onClick={() => navigate('/carros/create')}
            >
              <span className="btn-icon">🚗</span>
              Agregar Carro
            </button>
            <button 
              className="action-btn btn-blue"
              onClick={() => navigate('/carros/update')}
            >
              <span className="btn-icon">✏️</span>
              Actualizar Carro
            </button>
            <button 
              className="action-btn btn-blue"
              onClick={() => navigate('/carros/delete')}
            >
              <span className="btn-icon">🗑️</span>
              Eliminar Carro
            </button>
            <button 
              className="action-btn btn-blue"
              onClick={() => navigate('/carros/list')}
            >
              <span className="btn-icon">📋</span>
              Listar Carros
            </button>
            <button 
              className="action-btn btn-blue"
              onClick={() => navigate('/carros/list')}
            >
              <span className="btn-icon">🔍</span>
              Buscar Carro
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

// Navigation Component
const AppNavigation = () => {
  const location = useLocation();
  const [showAbout, setShowAbout] = useState(false);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <>
      <header className="header">
        <nav className="nav">
          <button 
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            📁 Archivo
          </button>
          <button 
            className={`nav-btn ${location.pathname.includes('/carros') ? 'active' : ''}`}
            onClick={() => navigate('/carros/list')}
          >
            🚗 Carro
          </button>
          <button 
            className="nav-btn"
            onClick={() => setShowAbout(!showAbout)}
          >
            ℹ️ Acerca de
          </button>
        </nav>
        <div className="title-section">
          <h1 className="main-title">🚗 CONCESIONARIO AAA</h1>
          <p className="subtitle">Sistema de Gestión de Automóviles</p>
        </div>
      </header>

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
                <li>Juan David Reyes</li>
                <li>Julio David Suarez</li>
                <li>Sebastian Felipe Solano</li>
              </ul>
              <br />
              <p><strong>Universidad de Ibagué</strong></p>
              <p>Facultad de Ingeniería</p>
              <p>Desarrollo de Aplicaciones Empresariales</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Footer Component
const AppFooter = () => {
  const [carrosCount, setCarrosCount] = useState(0);

  useEffect(() => {
    // This would normally fetch from your API
    setCarrosCount(0);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-stats">
        <span>🚗 Carros Registrados: {carrosCount}</span>
        <span>🔄 API REST Activa</span>
        <span>💾 Sistema CRUD Operacional</span>
      </div>
      <p className="footer-text">© 2025 - Sistema Distribuido con Servicios Web REST</p>
    </footer>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="app">
        <AppNavigation />
        <main className="main-content">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Carro management routes */}
            <Route path="/carros/create" element={<CreateCarro />} />
            <Route path="/carros/list" element={<SearchListCarros />} />
            <Route path="/carros/update" element={<UpdateCarro />} />
            <Route path="/carros/update/:placa" element={<UpdateCarro />} />
            <Route path="/carros/delete" element={<DeleteCarro />} />
            <Route path="/carros/delete/:placa" element={<DeleteCarro />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
    </Router>
  );
}

export default App;
