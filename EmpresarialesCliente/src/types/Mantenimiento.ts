/**
 * Tipo Mantenimiento según backend Java y C#
 * Alineado con cal.example.POCEmpleado.model.Mantenimiento
 */
export interface Mantenimiento {
  id: string;                         // String (UUID) en Java y C#
  placaCarro: string;                 // FK a Carro
  fechaMantenimiento: string;         // LocalDateTime en Java, formato "yyyy-MM-dd HH:mm:ss"
  kilometraje: number;                // int en Java
  tipoMantenimiento: string;          // Tipo de mantenimiento
  costo: number;                      // double en Java
  descripcion: string;                // Descripción del mantenimiento
  proximoMantenimiento: string | null; // LocalDateTime opcional
  completado: boolean;                // Estado de completado
  fechaRegistro?: string;             // LocalDateTime, formato "yyyy-MM-dd HH:mm:ss"
  estadoMantenimiento?: string;       // Calculado: COMPLETADO, URGENTE, VENCIDO, PENDIENTE
  esUrgente?: boolean;                // Calculado
  costoConImpuesto?: number;          // Calculado
}

export type MantenimientoCreateData = Omit<Mantenimiento, 'id' | 'fechaRegistro' | 'estadoMantenimiento' | 'esUrgente' | 'costoConImpuesto'>;

export type MantenimientoUpdateData = Omit<Mantenimiento, 'fechaRegistro' | 'estadoMantenimiento' | 'esUrgente' | 'costoConImpuesto'>;

export type MantenimientoFilter = {
  id?: string;
  placaCarro?: string;
  placa?: string; // Alias para placaCarro
  tipoMantenimiento?: string;
  tipo?: string; // Alias para tipoMantenimiento
  kilometraje?: number;
  kilometraje_min?: number;
  kilometraje_max?: number;
  costo_min?: number;
  costo_max?: number;
  completado?: boolean;
  urgente?: boolean;
};

export interface MantenimientoEstadisticas {
  total_mantenimientos: number;
  costo_promedio: number;
  costo_total: number;
}

// Tipos comunes de mantenimiento
export const TIPOS_MANTENIMIENTO = [
  'PREVENTIVO',
  'CORRECTIVO',
  'CAMBIO_ACEITE',
  'CAMBIO_FRENOS',
  'CAMBIO_LLANTAS',
  'ALINEACION_BALANCEO',
  'REVISION_GENERAL',
  'CAMBIO_FILTROS',
  'SISTEMA_ELECTRICO',
  'TRANSMISION',
  'SUSPENSION',
  'OTRO'
] as const;
