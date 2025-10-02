import './About.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>🚗 Sistema de Gestión de Carros</h1>
        <p className="subtitle">Cliente React - TypeScript</p>
      </div>

      <div className="about-content">
        {/* Team Section */}
        <section className="team-section">
          <h2>👥 Equipo de Desarrollo</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <span>👨‍💻</span>
              </div>
              <h3>Desarrollador 1</h3>
              <p>Frontend Developer</p>
              <p className="member-role">React • TypeScript • UI/UX</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <span>👩‍💻</span>
              </div>
              <h3>Desarrollador 2</h3>
              <p>Backend Developer</p>
              <p className="member-role">Spring Boot • Java • REST APIs</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <span>👨‍💼</span>
              </div>
              <h3>Desarrollador 3</h3>
              <p>Full Stack Developer</p>
              <p className="member-role">Integration • Testing • DevOps</p>
            </div>
          </div>
        </section>

        {/* Version Info */}
        <section className="version-section">
          <h2>📋 Información de Versión</h2>
          <div className="version-grid">
            <div className="version-item">
              <label>Versión del Cliente:</label>
              <span className="version-value">v1.0.0</span>
            </div>
            
            <div className="version-item">
              <label>Fecha de Lanzamiento:</label>
              <span className="version-value">Octubre 2025</span>
            </div>
            
            <div className="version-item">
              <label>Tecnología Frontend:</label>
              <span className="version-value">React + TypeScript + Vite</span>
            </div>
            
            <div className="version-item">
              <label>Tecnología Backend:</label>
              <span className="version-value">Spring Boot + Java</span>
            </div>
            
            <div className="version-item">
              <label>Base de Datos:</label>
              <span className="version-value">En memoria (JSON Collection)</span>
            </div>
            
            <div className="version-item">
              <label>Arquitectura:</label>
              <span className="version-value">Cliente-Servidor REST</span>
            </div>
          </div>
        </section>

        {/* Project Info */}
        <section className="project-section">
          <h2>🎯 Sobre el Proyecto</h2>
          
          <div className="project-description">
            <h3>Objetivo</h3>
            <p>
              Desarrollar una aplicación cliente en React TypeScript que consume servicios REST 
              de un microservicio Spring Boot para gestionar información de carros almacenados 
              en una colección JSON en memoria.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h4>Operaciones CRUD Completas</h4>
              <p>Crear, leer, actualizar y eliminar carros con validación completa</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h4>Búsqueda Avanzada</h4>
              <p>Búsqueda individual y filtrado por múltiples criterios</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h4>Interfaz Responsive</h4>
              <p>Diseño adaptable para diferentes tamaños de pantalla</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h4>API REST</h4>
              <p>Comunicación con backend mediante servicios web REST</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h4>Una Función por Pantalla</h4>
              <p>Cada ventana implementa un solo caso de uso para mejor usabilidad</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Información Técnica</h4>
              <p>Vista de JSON requests/responses para debugging</p>
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="tech-section">
          <h2>⚙️ Especificaciones Técnicas</h2>
          
          <div className="tech-grid">
            <div className="tech-category">
              <h4>Frontend</h4>
              <ul>
                <li>React 19.x</li>
                <li>TypeScript 5.x</li>
                <li>Vite Build Tool</li>
                <li>React Router DOM</li>
                <li>CSS Modules</li>
                <li>Fetch API</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h4>Backend Integration</h4>
              <ul>
                <li>RESTful API</li>
                <li>JSON Data Exchange</li>
                <li>CORS Enabled</li>
                <li>Error Handling</li>
                <li>HTTP Status Codes</li>
              </ul>
            </div>
            
            <div className="tech-category">
              <h4>Características</h4>
              <ul>
                <li>Validación de Formularios</li>
                <li>Manejo de Estados</li>
                <li>Loading States</li>
                <li>Toast Messages</li>
                <li>Responsive Design</li>
                <li>Accesibilidad</li>
              </ul>
            </div>
          </div>
        </section>

        {/* University Info */}
        <section className="university-section">
          <h2>🎓 Información Académica</h2>
          
          <div className="university-card">
            <div className="university-logo">
              <span>🏛️</span>
            </div>
            <div className="university-info">
              <h3>Universidad de Ibagué</h3>
              <p>Facultad de Ingeniería</p>
              <p><strong>Materia:</strong> Desarrollo de Aplicaciones Empresariales</p>
              <p><strong>Proyecto:</strong> Segundo Taller 2025B</p>
              <p><strong>Fecha:</strong> Octubre 2025</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="contact-section">
          <h2>📞 Contacto</h2>
          
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <label>Email Académico:</label>
                <span>carlos.lugo@unibague.edu.co</span>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <div>
                <label>Repositorio:</label>
                <span>GitHub - EmpresarialesProyecto</span>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">🔗</span>
              <div>
                <label>API Base URL:</label>
                <span>http://localhost:8080/api/carro</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="about-footer">
        <p>&copy; 2025 Universidad de Ibagué - Facultad de Ingeniería</p>
        <p>Sistema de Gestión de Carros - Proyecto Académico</p>
      </footer>
    </div>
  );
}
