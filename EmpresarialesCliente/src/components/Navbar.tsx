import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          🚗 Sistema de Carros
        </Link>
      </div>
      
      <ul className="navbar-nav">
        <li className="nav-item dropdown">
          <button className="nav-button dropdown-toggle">
            Gestión de Carros
          </button>
          <ul className="dropdown-menu">
            <li>
              <Link 
                to="/carros/create" 
                className={`dropdown-link ${isActive('/carros/create') ? 'active' : ''}`}
              >
                Crear Carro
              </Link>
            </li>
            <li>
              <Link 
                to="/carros/list" 
                className={`dropdown-link ${isActive('/carros/list') ? 'active' : ''}`}
              >
                Listar / Buscar Carros
              </Link>
            </li>
            <li>
              <Link 
                to="/carros/update" 
                className={`dropdown-link ${isActive('/carros/update') ? 'active' : ''}`}
              >
                Actualizar Carro
              </Link>
            </li>
            <li>
              <Link 
                to="/carros/delete" 
                className={`dropdown-link ${isActive('/carros/delete') ? 'active' : ''}`}
              >
                Eliminar Carro
              </Link>
            </li>
          </ul>
        </li>
        
        <li className="nav-item">
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            Acerca de
          </Link>
        </li>
      </ul>
    </nav>
  );
}
