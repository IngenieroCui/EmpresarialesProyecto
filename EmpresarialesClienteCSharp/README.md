# Cliente C# WinForms - Concesionario AAA

## Descripción
Cliente de escritorio desarrollado en C# con WinForms que consume los servicios REST del backend Spring Boot para la gestión de carros.

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
│   └── Carro.cs                 # Modelo de datos
├── Services/
│   └── CarroService.cs          # Servicio para consumir API REST
├── Forms/
│   ├── MainForm.cs              # Formulario principal con menú
│   ├── CrearCarroForm.cs        # Adicionar nuevo carro
│   ├── ListarCarrosForm.cs      # Listar todos los carros
│   ├── BuscarCarroForm.cs       # Buscar carro por placa
│   ├── ActualizarCarroForm.cs   # Actualizar carro (con búsqueda previa)
│   └── EliminarCarroForm.cs     # Eliminar carro (con búsqueda previa)
├── Program.cs                   # Punto de entrada
└── EmpresarialesClienteCSharp.csproj
```

## Casos de Uso Implementados

### 1. Adicionar Carro
- Formulario con todos los campos requeridos
- Validaciones de datos
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
- Confirmación de actualización

### 5. Eliminar Carro
- **Paso 1:** Búsqueda previa del carro por placa
- **Paso 2:** Confirmación antes de eliminar
- Advertencia de acción irreversible

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

1. **Backend debe estar ejecutándose**: El cliente espera que el backend esté disponible en `http://localhost:8080/api/carro`

2. **Actualizar/Eliminar requieren búsqueda previa**: Según los requisitos del proyecto, estos casos de uso primero buscan el objeto y luego permiten la acción

3. **Validaciones**: El formulario valida todos los campos antes de enviar al servidor

4. **Manejo de errores**: Todos los errores de conexión o validación se muestran con MessageBox

## Desarrollado por
- Juan David Reyes
- Julio David Suarez
- Sebastian Felipe Solano

**Universidad de Ibagué**
Facultad de Ingeniería
Desarrollo de Aplicaciones Empresariales
