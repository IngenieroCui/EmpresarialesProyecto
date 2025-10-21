# Cliente C# WinForms - Concesionario AAA

## Descripción
Cliente de escritorio desarrollado en C# con WinForms que consume los servicios REST del backend Spring Boot para la gestión de carros y mantenimientos del Concesionario AAA.

## 📋 Características

- 🚗 **Gestión Completa de Carros**: CRUD completo
- 🔧 **Gestión de Mantenimientos**: Registro y seguimiento de mantenimientos
- 🔐 **Autenticación**: Basic Auth integrado
- 📊 **Interfaz Intuitiva**: Formularios dedicados para cada operación
- ✅ **Validaciones**: Validación robusta de datos

## Requisitos
- .NET 8.0 SDK o superior
- Visual Studio 2022 (recomendado) o Visual Studio Code
- Backend Spring Boot ejecutándose en `http://localhost:8080`

## Instalación y Ejecución

### Opción 1: Visual Studio 2022
1. Abrir la solución en Visual Studio 2022
2. Restaurar paquetes NuGet (automático)
3. Presionar F5 para compilar y ejecutar

### Opción 2: Línea de Comandos
```bash
# Restaurar dependencias
dotnet restore

# Compilar el proyecto
dotnet build

# Ejecutar la aplicación
dotnet run
```

## Estructura del Proyecto

```
EmpresarialesClienteCSharp/
├── Models/
│   ├── Carro.cs                       # Modelo de carros
│   └── Mantenimiento.cs               # Modelo de mantenimientos
├── Services/
│   ├── CarroService.cs                # Servicio API de carros
│   └── MantenimientoService.cs        # Servicio API de mantenimientos
├── Forms/
│   ├── MainForm.cs                    # Formulario principal con menú
│   ├── CrearCarroForm.cs              # Adicionar nuevo carro
│   ├── ListarCarrosForm.cs            # Listar todos los carros
│   ├── BuscarCarroForm.cs             # Buscar carro por placa
│   ├── ActualizarCarroForm.cs         # Actualizar carro
│   ├── EliminarCarroForm.cs           # Eliminar carro
│   ├── CrearMantenimientoForm.cs      # Crear mantenimiento
│   ├── ListarMantenimientosForm.cs    # Listar mantenimientos
│   ├── ActualizarMantenimientoForm.cs # Actualizar mantenimiento
│   └── EliminarMantenimientoForm.cs   # Eliminar mantenimiento
├── Program.cs                         # Punto de entrada
└── EmpresarialesClienteCSharp.csproj
```

## Casos de Uso Implementados

### Módulo de Carros

### 1. Adicionar Carro
- Formulario con todos los campos requeridos
- Validaciones de datos (placa, año, precio, etc.)
- Confirmación de creación exitosa

### 2. Listar Carros
- Vista de tabla con todos los carros
- Botón de refrescar para actualizar datos
- Scroll automático para muchos registros

### 3. Buscar Carro por Placa
- Campo de búsqueda por placa
- Resultados mostrados en tabla
- Mensajes informativos si no se encuentra

### 4. Actualizar Carro
- **Paso 1:** Búsqueda previa del carro por placa
- **Paso 2:** Edición de todos los campos
- Validaciones actualizadas
- Confirmación de actualización

### 5. Eliminar Carro
- **Paso 1:** Búsqueda previa del carro por placa
- **Paso 2:** Confirmación antes de eliminar
- Advertencia de acción irreversible

### Módulo de Mantenimientos

### 6. Crear Mantenimiento
- Formulario completo con validaciones
- Selección de tipo de mantenimiento
- Cálculo automático de fecha próximo mantenimiento

### 7. Listar Mantenimientos
- Vista de tabla con todos los mantenimientos
- Filtros por placa, tipo, estado
- Identificación de mantenimientos urgentes

### 8. Actualizar Mantenimiento
- **Paso 1:** Búsqueda por ID
- **Paso 2:** Edición de campos
- Marcar como completado

### 9. Eliminar Mantenimiento
- **Paso 1:** Búsqueda por ID
- **Paso 2:** Confirmación de eliminación
- Advertencia de acción irreversible

**Total:** 9 casos de uso implementados

## Características

- ✅ Interfaz gráfica intuitiva con WinForms
- ✅ Consumo de API REST con HttpClient
- ✅ Manejo de errores con mensajes descriptivos
- ✅ Validaciones de formularios
- ✅ Cada formulario implementa un solo caso de uso
- ✅ Menú principal con navegación
- ✅ Ventana "Acerca de..." con información del equipo

## Dependencias

- **Newtonsoft.Json** (13.0.3): Para serialización/deserialización JSON
- **.NET 8.0 Windows Forms**: Framework de UI

## Notas Importantes

1. **Backend debe estar ejecutándose**: El cliente espera que el backend esté disponible en:
   - `http://localhost:8080/api/carro` (Carros)
   - `http://localhost:8080/api/mantenimiento` (Mantenimientos)

2. **Autenticación**: Todas las peticiones usan Basic Auth (admin:admin)

3. **Actualizar/Eliminar requieren búsqueda previa**: Según los requisitos del proyecto, estos casos de uso primero buscan el objeto y luego permiten la acción

4. **Validaciones**: Los formularios validan todos los campos antes de enviar al servidor

5. **Manejo de errores**: Todos los errores de conexión o validación se muestran con MessageBox

6. **Tipos de Mantenimiento**: 
   - PREVENTIVO, CORRECTIVO, CAMBIO_ACEITE, CAMBIO_LLANTAS
   - REVISION_FRENOS, ALINEACION_BALANCEO, CAMBIO_BATERIA
   - REVISION_MOTOR, AIRE_ACONDICIONADO, SUSPENSION
   - TRANSMISION, SISTEMA_ELECTRICO, PINTURA_CARROCERIA, OTROS

## Desarrollado por
- Juan David Reyes
- Julio David Suarez
- Sebastian Felipe Solano

**Universidad de Ibagué**
Facultad de Ingeniería
Desarrollo de Aplicaciones Empresariales
