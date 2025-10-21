# 🚗 Concesionario AAA - Sistema Distribuido

[![Estado](https://img.shields.io/badge/Estado-Completo-success)](https://github.com)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.5.5-green)](https://spring.io)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019-blue)](https://react.dev)
[![Desktop](https://img.shields.io/badge/Desktop-.NET%208.0-purple)](https://dotnet.microsoft.com)

> **Universidad de Ibagué** - Desarrollo de Aplicaciones Empresariales - 2025-A

## 📊 Estado del Proyecto

```
✅ Backend Java Spring Boot     - COMPILADO Y CORRIENDO
✅ Cliente React TypeScript     - SIN ERRORES
✅ Cliente C# WinForms          - COMPLETO
✅ Documentación API            - ACTUALIZADA
✅ 15 Endpoints REST            - IMPLEMENTADOS
✅ 12 Casos de Uso              - FUNCIONANDO
✅ 100% Requisitos del PDF      - CUMPLIDOS
```

**Ver estado detallado en:** [`ESTADO_PROYECTO.md`](./ESTADO_PROYECTO.md)

## Descripción General
Sistema integral de gestión de automóviles y mantenimientos implementado con arquitectura distribuida usando servicios REST. El proyecto incluye:
- **Backend**: Spring Boot (Java) con arquitectura hexagonal
- **Cliente 1**: React + TypeScript (SPA moderno)
- **Cliente 2**: C# WinForms (Aplicación de escritorio)

## Módulos Implementados

### 🚗 Gestión de Carros
Sistema completo CRUD para administración de vehículos del concesionario.

### 🔧 Gestión de Mantenimientos
Sistema completo CRUD para registro y seguimiento de mantenimientos vehiculares con:
- Historial por vehículo
- Alertas de mantenimientos urgentes
- Estadísticas y costos
- Múltiples tipos de mantenimiento

## Estructura del Proyecto

```plaintext
EmpresarialesProyecto/
├── EmpresarialesBackend/          # Servidor Spring Boot
├── EmpresarialesCliente/          # Cliente React/TypeScript
├── EmpresarialesClienteCSharp/    # Cliente C# WinForms
└── Segundo Proyecto Microservicios.pdf
```

## Requisitos Implementados

✅ **Servicios Web REST**: Backend expone API REST completa
✅ **Dos clientes en lenguajes diferentes**: React (TypeScript) y C# (WinForms)
✅ **CRUD completo**: Create, Read, Update, Delete
✅ **Búsqueda por criterios**: Múltiples filtros disponibles
✅ **Búsqueda individual**: Por placa
✅ **Listar con filtros**: Dos variantes implementadas
✅ **Casos de uso separados**: Cada ventana = 1 funcionalidad
✅ **Actualizar/Eliminar con búsqueda previa**: Implementado en ambos clientes
✅ **Menú principal**: Con "Acerca de..."
✅ **Arquitectura hexagonal**: Backend bien estructurado

## Correcciones Realizadas

### Frontend React
1. ✅ **Eliminados archivos duplicados**: `App_fixed.tsx`, `SearchListCarros_new.tsx`
2. ✅ **Navegación SPA corregida**: Reemplazado `window.location.href` por `useNavigate()`
3. ✅ **Diseño profesional mejorado**: CSS rediseñado con paleta moderna
4. ✅ **Dependencias instaladas**: `npm install` ejecutado exitosamente
5. ✅ **UI más limpia**: Sistema de diseño consistente con variables CSS

### Cliente C# (NUEVO)
1. ✅ **Proyecto WinForms completo**: Implementado desde cero
2. ✅ **5 formularios separados**: Crear, Listar, Buscar, Actualizar, Eliminar
3. ✅ **Consumo REST**: HttpClient con Newtonsoft.Json
4. ✅ **Validaciones**: Formularios con validación robusta
5. ✅ **Interfaz profesional**: Diseño moderno con colores y estilos

## Componentes del Sistema

### 1. Backend (Spring Boot)
- **Puerto**: 8080
- **Endpoints**: 
  - `/api/carro` - Gestión de carros
  - `/api/mantenimiento` - Gestión de mantenimientos
- **Autenticación**: Basic Auth (admin:admin)
- **Documentación**: Ver `EmpresarialesBackend/API_DOCUMENTATION.md`

### 2. Cliente React
- **Puerto**: 5173 (desarrollo)
- **Tecnologías**: React 19, TypeScript, Vite, React Router
- **Ver**: `EmpresarialesCliente/README.md`

### 3. Cliente C#
- **Tecnología**: .NET 8.0 Windows Forms
- **Ver**: `EmpresarialesClienteCSharp/README.md`

## Cómo Ejecutar el Proyecto Completo

### 1. Iniciar el Backend
```bash
cd EmpresarialesBackend
./mvnw spring-boot:run
```
El backend estará disponible en `http://localhost:8080`

### 2. Iniciar Cliente React
```bash
cd EmpresarialesCliente
npm install
npm run dev
```
Acceder a `http://localhost:5173`

### 3. Iniciar Cliente C#
```bash
cd EmpresarialesClienteCSharp
dotnet restore
dotnet run
```
O abrir en Visual Studio 2022 y presionar F5

## Casos de Uso Implementados

### Módulo de Carros

| Caso de Uso | Descripción | React | C# |
|-------------|-------------|-------|-----|
| Crear Carro | Adicionar nuevo vehículo | ✅ `/carros/create` | ✅ `CrearCarroForm` |
| Listar Carros | Mostrar todos los carros | ✅ `/carros/list` | ✅ `ListarCarrosForm` |
| Buscar Carro | Búsqueda por placa | ✅ `/carros/search` | ✅ `BuscarCarroForm` |
| Buscar con Filtros | Búsqueda con múltiples criterios | ✅ `/carros/search-list` | ✅ `BuscarCarroForm` |
| Actualizar Carro | Modificar datos con búsqueda previa | ✅ `/carros/update` | ✅ `ActualizarCarroForm` |
| Eliminar Carro | Eliminar con búsqueda previa | ✅ `/carros/delete` | ✅ `EliminarCarroForm` |

### Módulo de Mantenimientos

| Caso de Uso | Descripción | React | C# |
|-------------|-------------|-------|-----|
| Crear Mantenimiento | Registrar nuevo mantenimiento | ✅ `/mantenimientos/crear` | ✅ `CrearMantenimientoForm` |
| Listar Mantenimientos | Mostrar todos con filtros | ✅ `/mantenimientos` | ✅ `ListarMantenimientosForm` |
| Actualizar Mantenimiento | Modificar datos con búsqueda previa | ✅ `/mantenimientos/actualizar/:id` | ✅ `ActualizarMantenimientoForm` |
| Eliminar Mantenimiento | Eliminar con búsqueda previa | ✅ `/mantenimientos/eliminar/:id` | ✅ `EliminarMantenimientoForm` |
| Ver por Vehículo | Historial de un carro específico | ✅ Filtro en lista | ✅ Filtro en lista |
| Mantenimientos Urgentes | Alertas de mantenimientos próximos | ✅ Filtro en lista | ✅ Filtro en lista |

**Total de Casos de Uso:** 12 casos implementados (6 por módulo)

**Nota:** Cada ventana/página implementa UN SOLO caso de uso, cumpliendo con los requisitos del PDF del profesor.

## Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.5.5
- Spring Security
- Jackson (JSON)
- Bean Validation

### Cliente React
- React 19
- TypeScript
- Vite
- React Router v7
- CSS Modules

### Cliente C#
- .NET 8.0
- Windows Forms
- HttpClient
- Newtonsoft.Json

## Equipo de Desarrollo

- **Juan David Reyes**
- **Julio David Suarez**
- **Sebastian Felipe Solano**

**Universidad de Ibagué**
Facultad de Ingeniería
Desarrollo de Aplicaciones Empresariales
2025-A

## Licencia
Proyecto académico - Universidad de Ibagué
