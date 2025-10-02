import React, { useState, useEffect } from 'react';
import type { Carro, CarroCreateData, CarroUpdateData } from '../types/Carro';
import { ESTADOS, COMBUSTIBLES, TRANSMISIONES } from '../types/Carro';
import { getCurrentApiDate } from '../utils/date';
import './CarroForm.css';

interface CarroFormProps {
  initialData?: Carro | null;
  onSubmit: (data: CarroCreateData | CarroUpdateData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isReadOnly?: boolean;
  submitButtonText?: string;
  showCancelButton?: boolean;
}

export default function CarroForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isReadOnly = false,
  submitButtonText = 'Guardar',
  showCancelButton = true
}: CarroFormProps) {
  const [formData, setFormData] = useState<CarroCreateData>({
    placa: '',
    marca: '',
    color: '',
    modelo: '',
    anio: new Date().getFullYear(),
    estado: 'NUEVO',
    combustible: 'GASOLINA',
    numeroPuertas: 4,
    tieneAireAcondicionado: true,
    precio: 0,
    fechaRegistro: getCurrentApiDate(),
    tipoTransmision: 'MANUAL'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        placa: initialData.placa,
        marca: initialData.marca,
        color: initialData.color,
        modelo: initialData.modelo,
        anio: initialData.anio,
        estado: initialData.estado,
        combustible: initialData.combustible,
        numeroPuertas: initialData.numeroPuertas,
        tieneAireAcondicionado: initialData.tieneAireAcondicionado,
        precio: initialData.precio,
        fechaRegistro: initialData.fechaRegistro,
        tipoTransmision: initialData.tipoTransmision
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.placa.trim()) {
      newErrors.placa = 'La placa es requerida';
    } else if (!/^[A-Z]{3}-\d{3}$/.test(formData.placa.trim())) {
      newErrors.placa = 'La placa debe tener el formato ABC-123';
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'El modelo es requerido';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'El color es requerido';
    }

    if (!formData.combustible) {
      newErrors.combustible = 'El combustible es requerido';
    }

    if (!formData.tipoTransmision) {
      newErrors.tipoTransmision = 'El tipo de transmisión es requerido';
    }

    // Numeric validations
    if (formData.anio < 1900 || formData.anio > 2100) {
      newErrors.anio = 'El año debe estar entre 1900 y 2100';
    }

    if (formData.numeroPuertas < 2 || formData.numeroPuertas > 6) {
      newErrors.numeroPuertas = 'El número de puertas debe estar entre 2 y 6';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    // Date validation
    if (!formData.fechaRegistro.trim()) {
      newErrors.fechaRegistro = 'La fecha de registro es requerida';
    } else if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(formData.fechaRegistro)) {
      newErrors.fechaRegistro = 'La fecha debe tener el formato YYYY-MM-DD HH:mm:ss';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isReadOnly && validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CarroCreateData, value: string | number | boolean) => {
    if (isReadOnly) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="carro-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="placa">Placa *</label>
          <input
            type="text"
            id="placa"
            value={formData.placa}
            onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
            placeholder="ABC-123"
            disabled={isReadOnly || (initialData ? true : isLoading)}
            className={errors.placa ? 'error' : ''}
            maxLength={7}
          />
          {errors.placa && <span className="error-message">{errors.placa}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="marca">Marca *</label>
          <input
            type="text"
            id="marca"
            value={formData.marca}
            onChange={(e) => handleInputChange('marca', e.target.value)}
            disabled={isReadOnly || isLoading}
            className={errors.marca ? 'error' : ''}
          />
          {errors.marca && <span className="error-message">{errors.marca}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="modelo">Modelo *</label>
          <input
            type="text"
            id="modelo"
            value={formData.modelo}
            onChange={(e) => handleInputChange('modelo', e.target.value)}
            disabled={isReadOnly || isLoading}
            className={errors.modelo ? 'error' : ''}
          />
          {errors.modelo && <span className="error-message">{errors.modelo}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="color">Color *</label>
          <input
            type="text"
            id="color"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            disabled={isReadOnly || isLoading}
            className={errors.color ? 'error' : ''}
          />
          {errors.color && <span className="error-message">{errors.color}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="anio">Año *</label>
          <input
            type="number"
            id="anio"
            value={formData.anio}
            onChange={(e) => handleInputChange('anio', parseInt(e.target.value) || 0)}
            min="1900"
            max="2100"
            disabled={isReadOnly || isLoading}
            className={errors.anio ? 'error' : ''}
          />
          {errors.anio && <span className="error-message">{errors.anio}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado *</label>
          <select
            id="estado"
            value={formData.estado}
            onChange={(e) => handleInputChange('estado', e.target.value)}
            disabled={isReadOnly || isLoading}
            className={errors.estado ? 'error' : ''}
          >
            {ESTADOS.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
          {errors.estado && <span className="error-message">{errors.estado}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="combustible">Combustible *</label>
          <select
            id="combustible"
            value={formData.combustible}
            onChange={(e) => handleInputChange('combustible', e.target.value)}
            disabled={isReadOnly || isLoading}
            className={errors.combustible ? 'error' : ''}
          >
            {COMBUSTIBLES.map(combustible => (
              <option key={combustible} value={combustible}>{combustible}</option>
            ))}
          </select>
          {errors.combustible && <span className="error-message">{errors.combustible}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="tipoTransmision">Transmisión *</label>
          <select
            id="tipoTransmision"
            value={formData.tipoTransmision}
            onChange={(e) => handleInputChange('tipoTransmision', e.target.value)}
            disabled={isReadOnly || isLoading}
            className={errors.tipoTransmision ? 'error' : ''}
          >
            {TRANSMISIONES.map(transmision => (
              <option key={transmision} value={transmision}>{transmision}</option>
            ))}
          </select>
          {errors.tipoTransmision && <span className="error-message">{errors.tipoTransmision}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="numeroPuertas">Número de Puertas *</label>
          <input
            type="number"
            id="numeroPuertas"
            value={formData.numeroPuertas}
            onChange={(e) => handleInputChange('numeroPuertas', parseInt(e.target.value) || 0)}
            min="2"
            max="6"
            disabled={isReadOnly || isLoading}
            className={errors.numeroPuertas ? 'error' : ''}
          />
          {errors.numeroPuertas && <span className="error-message">{errors.numeroPuertas}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio *</label>
          <input
            type="number"
            id="precio"
            value={formData.precio}
            onChange={(e) => handleInputChange('precio', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            disabled={isReadOnly || isLoading}
            className={errors.precio ? 'error' : ''}
          />
          {errors.precio && <span className="error-message">{errors.precio}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fechaRegistro">Fecha de Registro *</label>
          <input
            type="text"
            id="fechaRegistro"
            value={formData.fechaRegistro}
            onChange={(e) => handleInputChange('fechaRegistro', e.target.value)}
            placeholder="YYYY-MM-DD HH:mm:ss"
            disabled={isReadOnly || isLoading}
            className={errors.fechaRegistro ? 'error' : ''}
          />
          {errors.fechaRegistro && <span className="error-message">{errors.fechaRegistro}</span>}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.tieneAireAcondicionado}
              onChange={(e) => handleInputChange('tieneAireAcondicionado', e.target.checked)}
              disabled={isReadOnly || isLoading}
            />
            Tiene Aire Acondicionado
          </label>
        </div>
      </div>

      {!isReadOnly && (
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : submitButtonText}
          </button>
          
          {showCancelButton && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </form>
  );
}
