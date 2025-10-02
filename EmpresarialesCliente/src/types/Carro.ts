export interface Carro {
  placa: string;                 // id
  marca: string;
  color: string;
  modelo: string;
  anio: number;                  // int
  estado: string;                // NUEVO | USADO | EXCELENTE
  combustible: string;           // GASOLINA | HIBRIDO | ELECTRICO
  numeroPuertas: number;         // int
  tieneAireAcondicionado: boolean;
  precio: number;                // double
  fechaRegistro: string;         // "YYYY-MM-DD HH:mm:ss" (LocalDateTime)
  tipoTransmision: string;       // MANUAL | AUTOMATICA
  tipoVehiculo?: string;         // optional/read-only
  detallesEspecificos?: string;  // optional/read-only
  informacionCompleta?: string;  // optional/read-only
}

export type CarroCreateData = Omit<Carro, 'tipoVehiculo' | 'detallesEspecificos' | 'informacionCompleta'>;

export type CarroUpdateData = CarroCreateData;

export type CarroFilter = {
  placa?: string;
  marca?: string;
  color?: string;
  modelo?: string;
  anio?: number;
  estado?: string;
  combustible?: string;
  tipoTransmision?: string;
  numeroPuertas?: number;
  tieneAireAcondicionado?: boolean;
  precioMin?: number;
  precioMax?: number;
  fechaDesde?: string;
  fechaHasta?: string;
};

// Enums for dropdown options
export const ESTADOS = ['NUEVO', 'USADO', 'EXCELENTE'] as const;
export const COMBUSTIBLES = ['GASOLINA', 'HIBRIDO', 'ELECTRICO'] as const;
export const TRANSMISIONES = ['MANUAL', 'AUTOMATICA'] as const;
