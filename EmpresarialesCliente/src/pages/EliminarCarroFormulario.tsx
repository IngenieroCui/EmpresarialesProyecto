import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Carro } from '../types/Carro';
import { deleteCarro } from '../services/carroApi';

const EliminarCarroFormulario: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const carroEncontrado = location.state?.carro as Carro;
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!carroEncontrado) {
      navigate('/eliminar');
      return;
    }
  }, [carroEncontrado, navigate]);

  const handleDelete = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await deleteCarro(carroEncontrado.placa);
      setMessage('¡Carro eliminado exitosamente!');
      setShowConfirmModal(false);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(`Error al eliminar el carro: ${error}`);
      setShowConfirmModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/eliminar');
  };

  if (!carroEncontrado) {
    return null;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="success-header">
        <div className="success-icon">✅</div>
        <h1 className="success-title">Carro Encontrado</h1>
        <div className="action-buttons">
          <button 
            className="btn-actualizar"
            onClick={() => navigate('/actualizar-formulario', { state: { carro: carroEncontrado } })}
          >
            ✏️ Actualizar
          </button>
          <button className="btn-eliminar active">🗑️ Eliminar</button>
        </div>
      </div>

      {/* Proceso Steps */}
      <div className="proceso-steps">
        <span className="step completed">🔍 1. Buscar Carro</span>
        <span className="step-arrow">→</span>
        <span className="step active">🗑️ 2. Confirmar Eliminación</span>
      </div>

      <div className="content-container">
        {/* Información Básica */}
        <div className="info-section">
          <h2 className="section-title">
            📋 Información Básica
          </h2>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-item">
                <label>Placa:</label>
                <span className="info-badge primary">{carroEncontrado.placa}</span>
              </div>
              <div className="info-item">
                <label>Marca:</label>
                <span className="info-value">{carroEncontrado.marca}</span>
              </div>
              <div className="info-item">
                <label>Modelo:</label>
                <span className="info-value">{carroEncontrado.modelo}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <label>Año:</label>
                <span className="info-value">{carroEncontrado.anio}</span>
              </div>
              <div className="info-item">
                <label>Color:</label>
                <span className="info-value">{carroEncontrado.color}</span>
              </div>
              <div className="info-item">
                <label>Estado:</label>
                <span className={`info-badge ${carroEncontrado.estado === 'NUEVO' ? 'success' : 'warning'}`}>
                  {carroEncontrado.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="info-section">
          <h2 className="section-title">
            ⚙️ Especificaciones Técnicas
          </h2>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-item">
                <label>Combustible:</label>
                <span className={`info-badge ${carroEncontrado.combustible === 'GASOLINA' ? 'danger' : 
                                               carroEncontrado.combustible === 'ELECTRICO' ? 'success' : 'primary'}`}>
                  {carroEncontrado.combustible}
                </span>
              </div>
              <div className="info-item">
                <label>Transmisión:</label>
                <span className="info-value">{carroEncontrado.tipoTransmision}</span>
              </div>
              <div className="info-item">
                <label>Puertas:</label>
                <span className="info-value">{carroEncontrado.numeroPuertas}</span>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item aire-item">
                <label>Aire Acondicionado:</label>
                <span className={`info-badge ${carroEncontrado.tieneAireAcondicionado ? 'success' : 'secondary'}`}>
                  {carroEncontrado.tieneAireAcondicionado ? 'SÍ' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información Comercial */}
        <div className="info-section">
          <h2 className="section-title">
            💰 Información Comercial
          </h2>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-item">
                <label>Precio:</label>
                <span className="info-badge success precio-badge">
                  $ {carroEncontrado.precio.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="info-item">
                <label>Fecha de Registro:</label>
                <span className="info-value">
                  {new Date(carroEncontrado.fechaRegistro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} p. m.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Aviso de Eliminación */}
        <div className="warning-section">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h3>¡Atención!</h3>
            <p>Está a punto de eliminar permanentemente este carro. Esta acción no se puede deshacer.</p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            ← Volver a Buscar
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-danger"
            disabled={isLoading}
          >
            🗑️ Eliminar Carro
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🗑️ Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Está seguro que desea eliminar el carro con placa <strong>{carroEncontrado.placa}</strong>?</p>
              <p className="modal-warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Confirmar Eliminación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EliminarCarroFormulario;
