# 🚀 Guía de Ejecución - Concesionario AAA

## 📋 Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

### Backend
- ✅ **Java 17** o superior
- ✅ **Maven** (incluido con `mvnw`)
- ✅ Puerto **8080** disponible

### Cliente React
- ✅ **Node.js 18+** y npm
- ✅ Puerto **5173** disponible

### Cliente C#
- ✅ **.NET 8.0 SDK**
- ✅ **Visual Studio 2022** (recomendado) o VS Code

---

## 🎯 Orden de Ejecución

**IMPORTANTE:** Debes iniciar los componentes en este orden:

1. **Primero:** Backend (Spring Boot)
2. **Segundo:** Cliente React (opcional)
3. **Tercero:** Cliente C# (opcional)

Puedes ejecutar ambos clientes simultáneamente o solo uno de ellos.

---

## 1️⃣ Iniciar Backend Spring Boot

### Opción A: PowerShell/CMD (Windows)

```powershell
# Ir al directorio del backend
cd D:\Users\User\Downloads\Empresariales\EmpresarialesBackend

# Compilar (opcional, solo la primera vez)
.\mvnw.cmd clean compile

# Iniciar el servidor
.\mvnw.cmd spring-boot:run
```

### Opción B: Bash/Git Bash

```bash
cd EmpresarialesBackend
./mvnw clean compile
./mvnw spring-boot:run
```

### ✅ Verificación

El backend estará listo cuando veas:
```
Started EmpresarialesProyecto in X.XXX seconds
Tomcat started on port 8080 (http)
✅ Mantenimientos cargados desde JSON: 0 registros
```

**URL Base:** `http://localhost:8080`

**Endpoints de prueba:**
- http://localhost:8080/api/carro/healthCheck
- http://localhost:8080/api/mantenimiento/healthCheck

---

## 2️⃣ Iniciar Cliente React (Opcional)

### En una nueva terminal:

```powershell
# Ir al directorio del cliente React
cd D:\Users\User\Downloads\Empresariales\EmpresarialesCliente

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### ✅ Verificación

El cliente estará listo cuando veas:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Abrir en navegador:** http://localhost:5173

### 🔐 Credenciales

Las credenciales están configuradas automáticamente:
- Usuario: `admin`
- Contraseña: `admin`

---

## 3️⃣ Iniciar Cliente C# (Opcional)

### Opción A: Visual Studio 2022

1. Abrir `EmpresarialesClienteCSharp.csproj` en Visual Studio
2. Presionar **F5** o hacer clic en "▶ Start"
3. La aplicación se compilará y abrirá automáticamente

### Opción B: Línea de Comandos

```powershell
# Ir al directorio del cliente C#
cd D:\Users\User\Downloads\Empresariales\EmpresarialesClienteCSharp

# Restaurar dependencias (solo la primera vez)
dotnet restore

# Ejecutar la aplicación
dotnet run
```

### ✅ Verificación

La aplicación WinForms se abrirá mostrando el formulario principal con el menú.

---

## 🧪 Pruebas Básicas

### Prueba 1: Health Check del Backend

```powershell
# Con cURL
curl -u admin:admin http://localhost:8080/api/carro/healthCheck
curl -u admin:admin http://localhost:8080/api/mantenimiento/healthCheck
```

**Respuesta esperada:**
```
"Carros API está funcionando correctamente"
"Mantenimientos API está funcionando correctamente"
```

### Prueba 2: Listar Carros

```powershell
curl -u admin:admin http://localhost:8080/api/carro
```

**Respuesta esperada:** Array JSON con lista de carros

### Prueba 3: Crear un Carro desde React

1. Abrir http://localhost:5173
2. Ir a **"Crear Carro"** en el menú
3. Llenar el formulario:
   - Marca: TOYOTA
   - Modelo: COROLLA
   - Placa: TST-999
   - Año: 2024
   - Color: ROJO
   - Precio: 45000000
   - (Llenar resto de campos)
4. Click en **"Crear Carro"**
5. Verificar mensaje de éxito

### Prueba 4: Ver el Carro en Cliente C#

1. Abrir aplicación C#
2. Click en **"Listar Carros"**
3. Verificar que aparece el carro TST-999 creado desde React

### Prueba 5: Crear Mantenimiento

1. Desde React o C#, ir a **"Crear Mantenimiento"**
2. Llenar datos:
   - Placa: TST-999 (el carro creado anteriormente)
   - Tipo: PREVENTIVO
   - Kilometraje: 10000
   - Costo: 250000
   - Descripción: Mantenimiento de prueba
3. Crear mantenimiento
4. Verificar en **"Listar Mantenimientos"**

---

## 🔍 Verificar Persistencia de Datos

Los datos se guardan en archivos JSON:

```powershell
# Ver contenido de carros.json
Get-Content D:\Users\User\Downloads\Empresariales\EmpresarialesBackend\carros.json

# Ver contenido de mantenimientos.json
Get-Content D:\Users\User\Downloads\Empresariales\EmpresarialesBackend\mantenimientos.json
```

---

## 🛑 Detener los Servicios

### Backend
- Presionar **Ctrl + C** en la terminal donde corre el backend

### React
- Presionar **Ctrl + C** en la terminal donde corre Vite

### C#
- Cerrar la ventana de la aplicación

---

## ⚠️ Solución de Problemas

### Problema: "Puerto 8080 ya en uso"

**Solución:**
```powershell
# Ver qué proceso usa el puerto 8080
netstat -ano | findstr :8080

# Matar el proceso (reemplazar PID con el número mostrado)
taskkill /PID <PID> /F
```

### Problema: "Puerto 5173 ya en uso"

**Solución:**
```powershell
# Matar todos los procesos de Node
taskkill /F /IM node.exe
```

### Problema: Backend no compila

**Solución:**
```powershell
cd EmpresarialesBackend
.\mvnw.cmd clean
.\mvnw.cmd compile
```

### Problema: React muestra errores de dependencias

**Solución:**
```powershell
cd EmpresarialesCliente
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problema: "Connection refused" en clientes

**Causa:** El backend no está corriendo

**Solución:** Verificar que el backend esté ejecutándose en http://localhost:8080

### Problema: Error de autenticación 401

**Causa:** Credenciales incorrectas

**Verificar:**
- Usuario: `admin`
- Contraseña: `admin`
- En C#: El servicio debe construir el header `Authorization: Basic YWRtaW46YWRtaW4=`

---

## 📊 Casos de Uso a Probar

### Módulo de Carros

1. ✅ **Crear Carro**
   - React: `/carros/create`
   - C#: CrearCarroForm

2. ✅ **Listar Carros**
   - React: `/carros/list`
   - C#: ListarCarrosForm

3. ✅ **Buscar por Placa**
   - React: `/carros/search`
   - C#: BuscarCarroForm

4. ✅ **Buscar con Filtros**
   - React: `/carros/search-list`
   - C#: BuscarCarroForm (con filtros)

5. ✅ **Actualizar Carro**
   - React: `/carros/update`
   - C#: ActualizarCarroForm
   - **Nota:** Requiere buscar primero

6. ✅ **Eliminar Carro**
   - React: `/carros/delete`
   - C#: EliminarCarroForm
   - **Nota:** Requiere buscar primero

### Módulo de Mantenimientos

7. ✅ **Crear Mantenimiento**
   - React: `/mantenimientos/crear`
   - C#: CrearMantenimientoForm

8. ✅ **Listar Mantenimientos**
   - React: `/mantenimientos`
   - C#: ListarMantenimientosForm

9. ✅ **Actualizar Mantenimiento**
   - React: `/mantenimientos/actualizar/:id`
   - C#: ActualizarMantenimientoForm

10. ✅ **Eliminar Mantenimiento**
    - React: `/mantenimientos/eliminar/:id`
    - C#: EliminarMantenimientoForm

---

## 🎯 Flujo de Prueba Completo Recomendado

### Escenario: Gestión completa de un vehículo y sus mantenimientos

```
1. Iniciar Backend
2. Iniciar React en navegador
3. Iniciar C# en escritorio

4. Desde React:
   ✅ Crear carro: ABC-123 (Toyota Corolla 2024)
   
5. Desde C#:
   ✅ Listar carros → Verificar que aparece ABC-123
   
6. Desde React:
   ✅ Crear mantenimiento para ABC-123
   - Tipo: CAMBIO_ACEITE
   - Kilometraje: 10000
   - Costo: 180000
   
7. Desde C#:
   ✅ Listar mantenimientos → Verificar que aparece el mantenimiento
   
8. Desde React:
   ✅ Actualizar el mantenimiento → Marcar como completado
   
9. Desde C#:
   ✅ Refrescar lista → Verificar que está completado
   
10. Desde React:
    ✅ Buscar ABC-123 → Verificar toda la info
    
11. Desde C#:
    ✅ Eliminar mantenimiento
    
12. Desde React:
    ✅ Verificar que ya no aparece en la lista
    
13. Desde C#:
    ✅ Eliminar carro ABC-123
    
14. Desde React:
    ✅ Verificar que ya no aparece en la lista
```

**Resultado esperado:** ✅ Todos los cambios se sincronizan entre ambos clientes en tiempo real

---

## 📁 Archivos de Datos

Los archivos JSON se encuentran en:

```
EmpresarialesBackend/
├── carros.json              # Lista de vehículos
└── mantenimientos.json      # Lista de mantenimientos
```

**Contenido inicial esperado:**

`carros.json`:
```json
[ /* Array con carros de prueba */ ]
```

`mantenimientos.json`:
```json
[ /* Array vacío o con datos demo */ ]
```

---

## 🎓 Información del Proyecto

**Universidad:** Universidad de Ibagué  
**Asignatura:** Desarrollo de Aplicaciones Empresariales  
**Período:** 2025-A

**Equipo:**
- Juan David Reyes
- Julio David Suarez
- Sebastian Felipe Solano

**Documentación completa:**
- [`README.md`](./README.md) - Overview general
- [`ESTADO_PROYECTO.md`](./ESTADO_PROYECTO.md) - Estado detallado
- [`EmpresarialesBackend/API_DOCUMENTATION.md`](./EmpresarialesBackend/API_DOCUMENTATION.md) - Documentación API REST

---

## ✅ Checklist de Verificación

Antes de la entrega, verificar:

- [ ] Backend compila sin errores
- [ ] Backend inicia en puerto 8080
- [ ] React compila sin errores TypeScript
- [ ] React inicia en puerto 5173
- [ ] C# compila sin errores
- [ ] C# inicia correctamente
- [ ] Se pueden crear carros desde React
- [ ] Los carros aparecen en C#
- [ ] Se pueden crear mantenimientos desde C#
- [ ] Los mantenimientos aparecen en React
- [ ] Actualizar funciona en ambos clientes
- [ ] Eliminar funciona en ambos clientes
- [ ] Los JSON se actualizan correctamente
- [ ] Toda la documentación está completa

---

**¡Listo para pruebas y entrega!** 🎉
