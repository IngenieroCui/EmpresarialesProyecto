# API REST de Gestión de Concesionario AAA

## Descripción
API REST completa para la gestión de carros y mantenimientos implementada con arquitectura hexagonal y principios de microservicios.

## Autenticación
Todas las peticiones requieren autenticación Basic Auth:
- **Usuario:** admin
- **Contraseña:** admin

## Módulos Disponibles

### 1. Gestión de Carros
Base URL: `http://localhost:8080/api/carro`

### 2. Gestión de Mantenimientos
Base URL: `http://localhost:8080/api/mantenimiento`

---

# API de Carros

## Base URL
```
http://localhost:8080/api/carro
```

## Endpoints Disponibles

### 1. Health Check
```http
GET /api/carro/healthCheck
```
**Descripción:** Verifica el estado del servicio.

**Respuesta:**
```json
"Carros API está funcionando correctamente"
```

---

### 2. Crear Carro (CREATE)
```http
POST /api/carro
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4=
```

**Body de ejemplo:**
```json
{
  "marca": "TOYOTA",
  "color": "ROJO",
  "placa": "ABC-123",
  "combustible": "GASOLINA",
  "modelo": "COROLLA",
  "anio": 2020,
  "estado": "USADO",
  "numeroPuertas": 4,
  "tieneAireAcondicionado": true,
  "precio": 45000000.0,
  "tipoTransmision": "AUTOMATICA"
}
```

**Respuesta exitosa (201):**
```json
{
  "marca": "TOYOTA",
  "color": "ROJO",
  "placa": "ABC-123",
  "combustible": "GASOLINA",
  "modelo": "COROLLA",
  "anio": 2020,
  "estado": "USADO",
  "numeroPuertas": 4,
  "tieneAireAcondicionado": true,
  "precio": 45000000.0,
  "tipoTransmision": "AUTOMATICA",
  "fechaRegistro": "2025-01-27 10:30:00"
}
```

---

### 3. Obtener Todos los Carros (READ)
```http
GET /api/carro
```

**Respuesta:**
```json
[
  {
    "marca": "TOYOTA",
    "placa": "ABC-123",
    // ... otros campos
  },
  {
    "marca": "HONDA",
    "placa": "DEF-456",
    // ... otros campos
  }
]
```

---

### 4. Buscar Carro por Placa (READ)
```http
GET /api/carro/{placa}
```

**Ejemplo:**
```http
GET /api/carro/ABC-123
```

**Respuesta exitosa (200):**
```json
{
  "marca": "TOYOTA",
  "color": "ROJO",
  "placa": "ABC-123",
  // ... otros campos
}
```

**Respuesta no encontrado (404):**
```json
{
  "code": "CARRO_NOT_FOUND",
  "message": "No se encontró un carro con la placa: ABC-123"
}
```

---

### 5. Buscar Carros por Marca (READ)
```http
GET /api/carro/buscar/marca/{marca}
```

**Ejemplo:**
```http
GET /api/carro/buscar/marca/TOYOTA
```

---

### 6. Buscar Carros por Año (READ)
```http
GET /api/carro/buscar/anio/{anio}
```

**Ejemplo:**
```http
GET /api/carro/buscar/anio/2020
```

---

### 7. Buscar Carros por Rango de Precio (READ)
```http
GET /api/carro/buscar/precio?precioMin={min}&precioMax={max}
```

**Ejemplo:**
```http
GET /api/carro/buscar/precio?precioMin=40000000&precioMax=60000000
```

---

### 8. Actualizar Carro (UPDATE)
```http
PUT /api/carro/{placa}
Content-Type: application/json
```

**Ejemplo:**
```http
PUT /api/carro/ABC-123
```

**Body:**
```json
{
  "marca": "TOYOTA",
  "color": "AZUL",
  "placa": "ABC-123",
  "combustible": "GASOLINA",
  "modelo": "COROLLA",
  "anio": 2020,
  "estado": "BUENO",
  "numeroPuertas": 4,
  "tieneAireAcondicionado": true,
  "precio": 43000000.0,
  "tipoTransmision": "AUTOMATICA"
}
```

---

### 9. Eliminar Carro (DELETE)
```http
DELETE /api/carro/{placa}
```

**Ejemplo:**
```http
DELETE /api/carro/ABC-123
```

**Respuesta exitosa (200):**
```json
{
  "message": "Carro eliminado exitosamente",
  "placa": "ABC-123"
}
```

---

### 10. Calcular Valor Comercial
```http
GET /api/carro/{placa}/valor-comercial
```

**Respuesta:**
```json
{
  "placa": "ABC-123",
  "valorComercial": 42500000.0
}
```

---

### 11. Obtener Estadísticas
```http
GET /api/carro/estadisticas
```

**Respuesta:**
```json
{
  "totalCarros": 4,
  "precioPromedio": 53750000.0
}
```

---

## Validaciones

### Campos Obligatorios
- `marca`: No puede estar vacío
- `color`: No puede estar vacío
- `placa`: Formato ABC-123 (3 letras mayúsculas, guión, 3 números)
- `combustible`: GASOLINA, DIESEL, HIBRIDO, ELECTRICO
- `modelo`: No puede estar vacío
- `anio`: Entre 1950 y 2025
- `estado`: NUEVO, USADO, EXCELENTE, BUENO, REGULAR
- `numeroPuertas`: Entre 2 y 5
- `precio`: Mayor que 0
- `tipoTransmision`: MANUAL, AUTOMATICA

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Errores de validación en los datos |
| `DUPLICATE_PLACA` | Ya existe un carro con esa placa |
| `CARRO_NOT_FOUND` | No se encontró el carro especificado |
| `INVALID_PLACA` | Formato de placa inválido |
| `INTERNAL_ERROR` | Error interno del servidor |

---

## Ejemplos de Uso con cURL

### Crear un carro
```bash
curl -X POST http://localhost:8080/api/carro \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "MAZDA",
    "color": "VERDE",
    "placa": "MNO-345",
    "combustible": "GASOLINA",
    "modelo": "CX5",
    "anio": 2021,
    "estado": "NUEVO",
    "numeroPuertas": 5,
    "tieneAireAcondicionado": true,
    "precio": 58000000.0,
    "tipoTransmision": "AUTOMATICA"
  }'
```

### Obtener todos los carros
```bash
curl -X GET http://localhost:8080/api/carro
```

### Buscar por placa
```bash
curl -X GET http://localhost:8080/api/carro/ABC-123
```

### Actualizar carro
```bash
curl -X PUT http://localhost:8080/api/carro/ABC-123 \
  -H "Content-Type: application/json" \
  -d '{
    "marca": "TOYOTA",
    "color": "NEGRO",
    "placa": "ABC-123",
    "combustible": "HIBRIDO",
    "modelo": "COROLLA HYBRID",
    "anio": 2020,
    "estado": "EXCELENTE",
    "numeroPuertas": 4,
    "tieneAireAcondicionado": true,
    "precio": 47000000.0,
    "tipoTransmision": "AUTOMATICA"
  }'
```

### Eliminar carro
```bash
curl -X DELETE http://localhost:8080/api/carro/ABC-123
```

---

## Arquitectura

### Patrón Hexagonal Implementado
- **Dominio**: Interfaces y lógica de negocio
- **Aplicación**: Servicios de aplicación
- **Infraestructura**: Controladores, repositorios y configuraciones

### Estructura de Packages
```
cal.example.POCEmpleado/
├── model/                    # Entidades del dominio
├── domain/
│   ├── repository/          # Ports (interfaces)
│   └── service/            # Ports (interfaces)
├── application/
│   └── service/            # Servicios de aplicación
├── infrastructure/
│   ├── controller/         # Adaptadores REST
│   ├── repository/         # Adaptadores de persistencia
│   └── config/            # Configuraciones
└── errors/                 # Manejo de errores
```

---

# API de Mantenimientos

## Base URL
```
http://localhost:8080/api/mantenimiento
```

## Descripción
API REST para la gestión completa de mantenimientos de vehículos (CRUD) con funcionalidades avanzadas de filtrado, estadísticas y alertas de mantenimientos urgentes.

## Endpoints Disponibles

### 1. Health Check
```http
GET /api/mantenimiento/healthCheck
```
**Descripción:** Verifica el estado del servicio de mantenimientos.

**Respuesta:**
```json
"Mantenimientos API está funcionando correctamente"
```

---

### 2. Crear Mantenimiento (CREATE)
```http
POST /api/mantenimiento
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4=
```

**Body de ejemplo:**
```json
{
  "placaCarro": "ABC-123",
  "fechaMantenimiento": "2025-10-15T10:30:00",
  "kilometraje": 50000,
  "tipoMantenimiento": "PREVENTIVO",
  "costo": 350000.0,
  "descripcion": "Mantenimiento preventivo de 50,000 km: cambio de aceite, filtros y revisión general",
  "proximoMantenimiento": "2026-04-15T10:30:00",
  "completado": false
}
```

**Campos:**
- `placaCarro` (String, requerido): Placa del carro en formato ABC-123
- `fechaMantenimiento` (LocalDateTime, requerido): Fecha y hora del mantenimiento
- `kilometraje` (int, requerido): Kilometraje del vehículo al momento del mantenimiento (0-999999)
- `tipoMantenimiento` (String, requerido): Tipo de mantenimiento (PREVENTIVO, CORRECTIVO, CAMBIO_ACEITE, CAMBIO_LLANTAS, REVISION_FRENOS, ALINEACION_BALANCEO, CAMBIO_BATERIA, REVISION_MOTOR, AIRE_ACONDICIONADO, SUSPENSION, TRANSMISION, SISTEMA_ELECTRICO, PINTURA_CARROCERIA, OTROS)
- `costo` (double, requerido): Costo del mantenimiento en pesos colombianos (mínimo 0)
- `descripcion` (String, requerido): Descripción detallada del mantenimiento (10-500 caracteres)
- `proximoMantenimiento` (LocalDateTime, opcional): Fecha programada para el próximo mantenimiento
- `completado` (boolean, opcional): Estado de completitud del mantenimiento (default: false)

**Respuesta exitosa (200):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "placaCarro": "ABC-123",
  "fechaMantenimiento": "2025-10-15T10:30:00",
  "kilometraje": 50000,
  "tipoMantenimiento": "PREVENTIVO",
  "costo": 350000.0,
  "descripcion": "Mantenimiento preventivo de 50,000 km: cambio de aceite, filtros y revisión general",
  "proximoMantenimiento": "2026-04-15T10:30:00",
  "completado": false,
  "fechaRegistro": "2025-10-20T20:30:15",
  "estadoMantenimiento": "PENDIENTE",
  "esUrgente": false,
  "costoConImpuesto": 416500.0
}
```

---

### 3. Listar/Buscar Mantenimientos (READ)
```http
GET /api/mantenimiento
GET /api/mantenimiento?{parametros}
```

**Parámetros de búsqueda (opcionales):**
- `id`: Buscar por ID específico
- `placaCarro` o `placa_carro` o `placa`: Filtrar por placa del carro
- `tipoMantenimiento` o `tipo_mantenimiento` o `tipo`: Filtrar por tipo (contiene texto)
- `kilometraje`: Filtrar por kilometraje exacto
- `kilometraje_min`: Kilometraje mínimo
- `kilometraje_max`: Kilometraje máximo
- `costo_min`: Costo mínimo
- `costo_max`: Costo máximo
- `completado`: Filtrar por estado (true/false)
- `urgente`: Filtrar solo urgentes (true)

**Ejemplos:**
```http
GET /api/mantenimiento
GET /api/mantenimiento?placaCarro=ABC-123
GET /api/mantenimiento?tipoMantenimiento=PREVENTIVO
GET /api/mantenimiento?kilometraje_min=40000&kilometraje_max=60000
GET /api/mantenimiento?costo_min=200000&costo_max=500000
GET /api/mantenimiento?completado=false
GET /api/mantenimiento?urgente=true
```

**Respuesta:**
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "placaCarro": "ABC-123",
    "fechaMantenimiento": "2025-10-15T10:30:00",
    "kilometraje": 50000,
    "tipoMantenimiento": "PREVENTIVO",
    "costo": 350000.0,
    "descripcion": "Mantenimiento preventivo de 50,000 km",
    "proximoMantenimiento": "2026-04-15T10:30:00",
    "completado": false,
    "estadoMantenimiento": "PENDIENTE",
    "esUrgente": false
  }
]
```

---

### 4. Obtener Mantenimiento por ID (READ)
```http
GET /api/mantenimiento/{id}
```

**Ejemplo:**
```http
GET /api/mantenimiento/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Respuesta exitosa (200):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "placaCarro": "ABC-123",
  "fechaMantenimiento": "2025-10-15T10:30:00",
  "kilometraje": 50000,
  "tipoMantenimiento": "PREVENTIVO",
  "costo": 350000.0,
  "descripcion": "Mantenimiento preventivo de 50,000 km",
  "proximoMantenimiento": "2026-04-15T10:30:00",
  "completado": false,
  "fechaRegistro": "2025-10-20T20:30:15",
  "estadoMantenimiento": "PENDIENTE",
  "esUrgente": false,
  "costoConImpuesto": 416500.0
}
```

**Respuesta no encontrado (404):**
```json
{
  "message": "No se encontró un mantenimiento con el ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

### 5. Obtener Mantenimientos por Carro
```http
GET /api/mantenimiento/carro/{placaCarro}
```

**Ejemplo:**
```http
GET /api/mantenimiento/carro/ABC-123
```

**Descripción:** Retorna todos los mantenimientos de un vehículo específico, ordenados por fecha (más reciente primero).

**Respuesta:**
```json
[
  {
    "id": "uuid-1",
    "placaCarro": "ABC-123",
    "fechaMantenimiento": "2025-10-15T10:30:00",
    "tipoMantenimiento": "PREVENTIVO",
    "costo": 350000.0,
    "completado": true
  },
  {
    "id": "uuid-2",
    "placaCarro": "ABC-123",
    "fechaMantenimiento": "2025-08-10T14:00:00",
    "tipoMantenimiento": "CAMBIO_ACEITE",
    "costo": 180000.0,
    "completado": true
  }
]
```

---

### 6. Obtener Mantenimientos Urgentes
```http
GET /api/mantenimiento?action=urgentes
```

**Descripción:** Retorna mantenimientos que requieren atención urgente (próximo mantenimiento vencido o próximo a vencer en menos de 30 días).

**Respuesta:**
```json
[
  {
    "id": "uuid-1",
    "placaCarro": "ABC-123",
    "fechaMantenimiento": "2024-12-15T10:30:00",
    "proximoMantenimiento": "2025-10-10T10:30:00",
    "tipoMantenimiento": "PREVENTIVO",
    "esUrgente": true,
    "estadoMantenimiento": "URGENTE"
  }
]
```

---

### 7. Obtener Estadísticas
```http
GET /api/mantenimiento?action=estadisticas
```

**Respuesta:**
```json
{
  "totalMantenimientos": 15,
  "costoTotal": 4250000.0,
  "costoPromedio": 283333.33,
  "mantenimientosPendientes": 3,
  "mantenimientosCompletados": 12,
  "mantenimientosUrgentes": 2
}
```

---

### 8. Actualizar Mantenimiento (UPDATE)
```http
PUT /api/mantenimiento/{id}
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4=
```

**Ejemplo:**
```http
PUT /api/mantenimiento/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Body:**
```json
{
  "placaCarro": "ABC-123",
  "fechaMantenimiento": "2025-10-15T10:30:00",
  "kilometraje": 50500,
  "tipoMantenimiento": "PREVENTIVO",
  "costo": 380000.0,
  "descripcion": "Mantenimiento preventivo completado con servicios adicionales",
  "proximoMantenimiento": "2026-04-15T10:30:00",
  "completado": true
}
```

**Respuesta exitosa (200):**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "placaCarro": "ABC-123",
  "fechaMantenimiento": "2025-10-15T10:30:00",
  "kilometraje": 50500,
  "tipoMantenimiento": "PREVENTIVO",
  "costo": 380000.0,
  "descripcion": "Mantenimiento preventivo completado con servicios adicionales",
  "proximoMantenimiento": "2026-04-15T10:30:00",
  "completado": true,
  "estadoMantenimiento": "COMPLETADO",
  "esUrgente": false
}
```

---

### 9. Eliminar Mantenimiento (DELETE)
```http
DELETE /api/mantenimiento/{id}
Authorization: Basic YWRtaW46YWRtaW4=
```

**Ejemplo:**
```http
DELETE /api/mantenimiento/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Respuesta exitosa (200):**
```json
{
  "message": "Mantenimiento eliminado exitosamente",
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Respuesta no encontrado (404):**
```json
{
  "message": "No se encontró un mantenimiento con el ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## Tipos de Mantenimiento Soportados

| Tipo | Descripción |
|------|-------------|
| `PREVENTIVO` | Mantenimiento preventivo programado |
| `CORRECTIVO` | Reparación de fallas o daños |
| `CAMBIO_ACEITE` | Cambio de aceite y filtro |
| `CAMBIO_LLANTAS` | Reemplazo de llantas |
| `REVISION_FRENOS` | Inspección y servicio de frenos |
| `ALINEACION_BALANCEO` | Alineación y balanceo de ruedas |
| `CAMBIO_BATERIA` | Reemplazo de batería |
| `REVISION_MOTOR` | Inspección y servicio del motor |
| `AIRE_ACONDICIONADO` | Servicio de aire acondicionado |
| `SUSPENSION` | Reparación o servicio de suspensión |
| `TRANSMISION` | Servicio de transmisión |
| `SISTEMA_ELECTRICO` | Reparación de sistema eléctrico |
| `PINTURA_CARROCERIA` | Pintura y reparación de carrocería |
| `OTROS` | Otros servicios |

---

## Estados de Mantenimiento

| Estado | Descripción |
|--------|-------------|
| `PENDIENTE` | Mantenimiento no completado y no urgente |
| `COMPLETADO` | Mantenimiento finalizado |
| `URGENTE` | Mantenimiento pendiente con fecha vencida o próxima a vencer |

---

## Campos Calculados Automáticamente

- **`estadoMantenimiento`**: Se calcula según:
  - `COMPLETADO` si el mantenimiento está marcado como completado
  - `URGENTE` si el próximo mantenimiento está vencido o vence en menos de 30 días
  - `PENDIENTE` en otros casos

- **`esUrgente`**: Boolean que indica si el mantenimiento requiere atención urgente (próximo mantenimiento vencido o próximo a vencer)

- **`costoConImpuesto`**: Costo total incluyendo 19% de IVA

- **`fechaRegistro`**: Timestamp automático de creación del registro

- **`id`**: UUID generado automáticamente

---

## Validaciones

### Campos Obligatorios
- `placaCarro`: No puede estar vacío
- `fechaMantenimiento`: Fecha válida
- `kilometraje`: Entre 0 y 999,999 km
- `tipoMantenimiento`: Debe ser uno de los tipos soportados
- `costo`: Mayor o igual a 0
- `descripcion`: Entre 10 y 500 caracteres

### Reglas de Negocio
1. El kilometraje debe ser un valor realista (0-999,999)
2. La fecha del próximo mantenimiento debe ser posterior a la fecha del mantenimiento actual
3. El costo no puede ser negativo
4. Un mantenimiento se considera urgente si su `proximoMantenimiento` está vencido o vence en menos de 30 días

---

## Ejemplos de Uso con cURL

### Crear un mantenimiento
```bash
curl -X POST http://localhost:8080/api/mantenimiento \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{
    "placaCarro": "ABC-123",
    "fechaMantenimiento": "2025-10-15T10:30:00",
    "kilometraje": 50000,
    "tipoMantenimiento": "PREVENTIVO",
    "costo": 350000.0,
    "descripcion": "Mantenimiento preventivo de 50,000 km: cambio de aceite, filtros y revisión general",
    "proximoMantenimiento": "2026-04-15T10:30:00",
    "completado": false
  }'
```

### Listar todos los mantenimientos
```bash
curl -X GET http://localhost:8080/api/mantenimiento \
  -u admin:admin
```

### Buscar mantenimientos por carro
```bash
curl -X GET "http://localhost:8080/api/mantenimiento?placaCarro=ABC-123" \
  -u admin:admin
```

### Buscar mantenimientos urgentes
```bash
curl -X GET "http://localhost:8080/api/mantenimiento?urgente=true" \
  -u admin:admin
```

### Obtener por ID
```bash
curl -X GET http://localhost:8080/api/mantenimiento/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -u admin:admin
```

### Actualizar mantenimiento
```bash
curl -X PUT http://localhost:8080/api/mantenimiento/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{
    "placaCarro": "ABC-123",
    "fechaMantenimiento": "2025-10-15T10:30:00",
    "kilometraje": 50500,
    "tipoMantenimiento": "PREVENTIVO",
    "costo": 380000.0,
    "descripcion": "Mantenimiento preventivo completado con servicios adicionales",
    "proximoMantenimiento": "2026-04-15T10:30:00",
    "completado": true
  }'
```

### Eliminar mantenimiento
```bash
curl -X DELETE http://localhost:8080/api/mantenimiento/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -u admin:admin
```

---

## Integración con Módulo de Carros

El módulo de Mantenimientos se integra con el módulo de Carros mediante la placa del vehículo. Antes de crear un mantenimiento, es recomendable verificar que el carro exista en el sistema.

**Flujo recomendado:**
1. Verificar existencia del carro: `GET /api/carro/{placa}`
2. Crear mantenimiento: `POST /api/mantenimiento`
3. Consultar historial: `GET /api/mantenimiento/carro/{placa}`

---

## Consideraciones de Performance

- Los mantenimientos se persisten en archivo JSON (`mantenimientos.json`)
- Las búsquedas y filtrados se realizan en memoria
- Para grandes volúmenes de datos, considere migrar a una base de datos relacional
- Los índices por placa y fecha optimizan las consultas más frecuentes

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `400` | Datos de entrada inválidos o validación fallida |
| `404` | Mantenimiento no encontrado |
| `401` | Error de autenticación (credenciales inválidas) |
| `500` | Error interno del servidor |

````
```
cal.example.POCEmpleado/
├── model/                    # Entidades del dominio
├── domain/
│   ├── repository/          # Ports (interfaces)
│   └── service/            # Ports (interfaces)
├── application/
│   └── service/            # Servicios de aplicación
├── infrastructure/
│   ├── controller/         # Adaptadores REST
│   ├── repository/         # Adaptadores de persistencia
│   └── config/            # Configuraciones
└── errors/                 # Manejo de errores
```
