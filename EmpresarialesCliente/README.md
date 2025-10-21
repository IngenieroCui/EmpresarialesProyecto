# 🚗 Sistema de Gestión de Concesionario AAA - Cliente React

Cliente React TypeScript moderno que consume servicios REST de un backend Spring Boot para gestionar información de carros y mantenimientos del Concesionario AAA.

## 📋 Descripción

Aplicación web SPA (Single Page Application) que implementa todas las operaciones CRUD para:
- **Gestión de Carros**: Crear, listar, buscar, actualizar y eliminar vehículos
- **Gestión de Mantenimientos**: Registrar y administrar el historial de mantenimientos de cada vehículo

## 🚀 Tecnologías Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router v7** - Enrutamiento SPA
- **Tailwind CSS** - Estilos utilitarios
- **Fetch API** - Comunicación con backend REST

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── CarroForm.tsx           # Formulario de carros
│   ├── MantenimientoForm.tsx   # Formulario de mantenimientos
│   └── Navbar.tsx              # Barra de navegación
├── pages/              # Páginas de la aplicación
│   ├── About.tsx              # Página "Acerca de"
│   ├── CreateCarro.tsx        # Crear carro
│   ├── ListCarros.tsx         # Listar carros
│   ├── SearchCarro.tsx        # Buscar carro por placa
│   ├── SearchListCarros.tsx   # Buscar con filtros
│   ├── UpdateCarro.tsx        # Actualizar carro
│   ├── DeleteCarro.tsx        # Eliminar carro
│   ├── CrearMantenimiento.tsx        # Crear mantenimiento
│   ├── ListarMantenimientos.tsx      # Listar mantenimientos
│   ├── ActualizarMantenimiento.tsx   # Actualizar mantenimiento
│   └── EliminarMantenimiento.tsx     # Eliminar mantenimiento
├── services/           # Servicios API
│   ├── carroApi.ts            # API de carros
│   └── mantenimientoApi.ts    # API de mantenimientos
├── types/             # Definiciones TypeScript
│   ├── Carro.ts               # Tipos de carros
│   └── Mantenimiento.ts       # Tipos de mantenimientos
├── utils/             # Utilidades
│   └── query.ts               # Construcción de query strings
├── App.tsx            # Componente principal y rutas
└── main.tsx           # Punto de entrada

```

## 🎯 Casos de Uso Implementados

### Módulo de Carros
- ✅ **Crear Carro** (`/carros/create`)
- ✅ **Listar Carros** (`/carros/list`)
- ✅ **Buscar por Placa** (`/carros/search`)
- ✅ **Buscar con Filtros** (`/carros/search-list`)
- ✅ **Actualizar Carro** (`/carros/update`)
- ✅ **Eliminar Carro** (`/carros/delete`)

### Módulo de Mantenimientos
- ✅ **Crear Mantenimiento** (`/mantenimientos/crear`)
- ✅ **Listar Mantenimientos** (`/mantenimientos`)
- ✅ **Actualizar Mantenimiento** (`/mantenimientos/actualizar/:id`)
- ✅ **Eliminar Mantenimiento** (`/mantenimientos/eliminar/:id`)

**Nota:** Cada ruta implementa UN SOLO caso de uso según requisitos del proyecto.

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- Backend Spring Boot ejecutándose en `http://localhost:8080`

### Instalación
```bash
# Instalar dependencias
npm install
```

### Variables de Entorno
Crear archivo `.env` (opcional):
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_USERNAME=admin
VITE_API_PASSWORD=admin
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Producción
```bash
# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🔐 Autenticación

El cliente se conecta al backend usando **Basic Auth**:
- Usuario: `admin`
- Contraseña: `admin`

Las credenciales se envían automáticamente en cada petición HTTP.

## 📡 Comunicación con Backend

### Endpoints de Carros
```
GET    /api/carro              - Listar/buscar carros
POST   /api/carro              - Crear carro
GET    /api/carro/{placa}      - Obtener por placa
PUT    /api/carro/{placa}      - Actualizar carro
DELETE /api/carro/{placa}      - Eliminar carro
```

### Endpoints de Mantenimientos
```
GET    /api/mantenimiento                  - Listar/buscar mantenimientos
POST   /api/mantenimiento                  - Crear mantenimiento
GET    /api/mantenimiento/{id}             - Obtener por ID
PUT    /api/mantenimiento/{id}             - Actualizar mantenimiento
DELETE /api/mantenimiento/{id}             - Eliminar mantenimiento
GET    /api/mantenimiento/carro/{placa}    - Obtener por carro
```

## 🎨 Características de UI/UX

- **Diseño Responsive**: Adaptable a móviles, tablets y escritorio
- **Navegación SPA**: Sin recargas de página
- **Mensajes de Feedback**: Confirmaciones y errores claros
- **Validación de Formularios**: Validación en tiempo real
- **Interfaz Moderna**: Diseño limpio con Tailwind CSS
- **Estados de Carga**: Indicadores durante operaciones asíncronas

## 🧪 Testing

```bash
# Ejecutar tests (si están configurados)
npm run test
```

## 📝 Tipos de Datos

### Carro
```typescript
interface Carro {
  placa: string;              // ABC-123
  marca: string;              // TOYOTA, MAZDA, etc.
  modelo: string;             // COROLLA, CX5, etc.
  anio: number;              // 2020, 2021, etc.
  color: string;             // ROJO, AZUL, etc.
  precio: number;            // 45000000.0
  estado: string;            // NUEVO, USADO, etc.
  combustible: string;       // GASOLINA, DIESEL, etc.
  tipoTransmision: string;   // MANUAL, AUTOMATICA
  numeroPuertas: number;     // 2, 4, 5
  tieneAireAcondicionado: boolean;
  fechaRegistro?: string;
}
```

### Mantenimiento
```typescript
interface Mantenimiento {
  id: string;                      // UUID
  placaCarro: string;              // ABC-123
  fechaMantenimiento: string;      // ISO DateTime
  kilometraje: number;             // 50000
  tipoMantenimiento: string;       // PREVENTIVO, CORRECTIVO, etc.
  costo: number;                   // 350000.0
  descripcion: string;             // Descripción del servicio
  proximoMantenimiento: string | null;
  completado: boolean;
  fechaRegistro?: string;
  estadoMantenimiento?: string;    // PENDIENTE, COMPLETADO, URGENTE
  esUrgente?: boolean;
  costoConImpuesto?: number;
}
```

## 🔧 Configuración de Proxy

El `vite.config.ts` incluye configuración de proxy para desarrollo:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          'Authorization': 'Basic YWRtaW46YWRtaW4='
        }
      }
    }
  }
})
```

## 📚 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Vista previa de producción
npm run lint         # Linter ESLint
```

## 👥 Equipo de Desarrollo

- **Juan David Reyes**
- **Julio David Suarez**
- **Sebastian Felipe Solano**

**Universidad de Ibagué** - Desarrollo de Aplicaciones Empresariales - 2025-A

## 📄 Licencia

Proyecto académico - Universidad de Ibagué