export interface Mantenimiento {
  id: string;                           // UUID
  placaCarro: string;                   // FK → Carro.placa (formato ABC-123)
  fechaMantenimiento: string;           // "YYYY-MM-DD HH:mm:ss" (LocalDateTime)
  kilometraje: number;                  // int
  tipoMantenimiento: string;            // PREVENTIVO | CORRECTIVO | REVISION | CAMBIO_ACEITE | CAMBIO_LLANTAS | OTROS
  costo: number;                        // double
  descripcion: string;                  // text (10-500 caracteres)
  proximoMantenimiento: string | null;  // "YYYY-MM-DD HH:mm:ss" (LocalDateTime, opcional)
  completado: boolean;                  // boolean
  fechaRegistro: string;                // "YYYY-MM-DD HH:mm:ss" (LocalDateTime)
  estadoMantenimiento?: string;         // optional/read-only: COMPLETADO | URGENTE | PENDIENTE
  esUrgente?: boolean;                  // optional/read-only
  costoConImpuesto?: number;            // optional/read-only
}

export type MantenimientoCreateData = Omit<Mantenimiento, 'id' | 'fechaRegistro' | 'estadoMantenimiento' | 'esUrgente' | 'costoConImpuesto'>;

export type MantenimientoUpdateData = Omit<Mantenimiento, 'fechaRegistro' | 'estadoMantenimiento' | 'esUrgente' | 'costoConImpuesto'>;

export type MantenimientoFilter = {
  id?: string;
  placaCarro?: string;
  tipoMantenimiento?: string;
  kilometraje?: number;
  kilometraje_min?: number;
  kilometraje_max?: number;
  costo_min?: number;
  costo_max?: number;
  completado?: boolean;
  urgente?: boolean;
};

export interface MantenimientoEstadisticas {
  totalMantenimientos: number;
  costoTotal: number;
  costoPromedio: number;
  mantenimientosUrgentes: number;
}

// Enums para dropdown options
export const TIPOS_MANTENIMIENTO = [
  'PREVENTIVO',
  'CORRECTIVO',
  'REVISION',
  'CAMBIO_ACEITE',
  'CAMBIO_LLANTAS',
  'OTROS'
] as const;

export type TipoMantenimiento = typeof TIPOS_MANTENIMIENTO[number];
