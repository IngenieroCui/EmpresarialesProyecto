# API REST de Gestión de Carros

## Descripción
API REST para la gestión completa de carros (CRUD) implementada con arquitectura hexagonal y principios de microservicios.

## Base URL
```
http://localhost:8080/api/v1/carros
```

## Endpoints Disponibles

### 1. Health Check
```http
GET /api/v1/carros/health
```
**Descripción:** Verifica el estado del servicio.

**Respuesta:**
```json
{
  "status": "OK",
  "service": "Carros API",
  "timestamp": "2025-01-27T10:30:00"
}
```

---

### 2. Crear Carro (CREATE)
```http
POST /api/v1/carros
Content-Type: application/json
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
GET /api/v1/carros
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
GET /api/v1/carros/{placa}
```

**Ejemplo:**
```http
GET /api/v1/carros/ABC-123
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
GET /api/v1/carros/buscar/marca/{marca}
```

**Ejemplo:**
```http
GET /api/v1/carros/buscar/marca/TOYOTA
```

---

### 6. Buscar Carros por Año (READ)
```http
GET /api/v1/carros/buscar/anio/{anio}
```

**Ejemplo:**
```http
GET /api/v1/carros/buscar/anio/2020
```

---

### 7. Buscar Carros por Rango de Precio (READ)
```http
GET /api/v1/carros/buscar/precio?precioMin={min}&precioMax={max}
```

**Ejemplo:**
```http
GET /api/v1/carros/buscar/precio?precioMin=40000000&precioMax=60000000
```

---

### 8. Actualizar Carro (UPDATE)
```http
PUT /api/v1/carros/{placa}
Content-Type: application/json
```

**Ejemplo:**
```http
PUT /api/v1/carros/ABC-123
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
DELETE /api/v1/carros/{placa}
```

**Ejemplo:**
```http
DELETE /api/v1/carros/ABC-123
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
GET /api/v1/carros/{placa}/valor-comercial
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
GET /api/v1/carros/estadisticas
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
curl -X POST http://localhost:8080/api/v1/carros \
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
curl -X GET http://localhost:8080/api/v1/carros
```

### Buscar por placa
```bash
curl -X GET http://localhost:8080/api/v1/carros/ABC-123
```

### Actualizar carro
```bash
curl -X PUT http://localhost:8080/api/v1/carros/ABC-123 \
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
curl -X DELETE http://localhost:8080/api/v1/carros/ABC-123
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
