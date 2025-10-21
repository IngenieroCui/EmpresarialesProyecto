package cal.example.POCEmpleado.controller;

import cal.example.POCEmpleado.model.Mantenimiento;
import cal.example.POCEmpleado.service.IMantenimientoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador REST para Mantenimientos
 * Implementa principios SOLID y arquitectura hexagonal
 * DIP: Depende de la abstracción IMantenimientoService, no de la implementación concreta
 */
@RestController
@RequestMapping("/api/mantenimiento")
@CrossOrigin(origins = "*")
public class MantenimientoController {

    private final IMantenimientoService mantenimientoService;

    // Inyección por constructor (mejor práctica)
    @Autowired
    public MantenimientoController(IMantenimientoService mantenimientoService) {
        this.mantenimientoService = mantenimientoService;
    }

    @GetMapping(value = "/healthCheck")
    public String healthCheck() {
        return "Mantenimientos API Status Ok!";
    }

    /**
     * MÉTODO UNIFICADO - Listar mantenimientos con filtros opcionales
     * Este es el ÚNICO método GET que maneja todas las consultas:
     * - Sin parámetros: retorna todos los mantenimientos
     * - Con id: retorna un mantenimiento específico
     * - Con placa: retorna todos los mantenimientos de ese carro
     * - Con otros filtros: retorna mantenimientos filtrados
     * - Con action=estadisticas: retorna estadísticas
     */
    @GetMapping
    public ResponseEntity<?> listar(@RequestParam Map<String, String> params) {
        try {
            // Manejar acciones especiales
            String action = params.get("action");
            if ("estadisticas".equals(action)) {
                return obtenerEstadisticas();
            }
            if ("costo-total-placa".equals(action)) {
                String placa = params.get("placa");
                if (placa != null && !placa.trim().isEmpty()) {
                    return calcularCostoTotalPorPlaca(placa);
                }
                return ResponseEntity.badRequest().body("Placa requerida para calcular costo total");
            }
            if ("urgentes".equals(action)) {
                return obtenerMantenimientosUrgentes();
            }

            // Convertir parámetros String a Object para el servicio
            Map<String, Object> filtros = new HashMap<>();

            for (Map.Entry<String, String> entry : params.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                if (value != null && !value.trim().isEmpty() && !"action".equals(key)) {
                    // Conversión de tipos según el parámetro
                    switch (key.toLowerCase()) {
                        case "id":
                            try {
                                filtros.put(key, Long.parseLong(value));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest()
                                        .body("Valor inválido para ID: " + value);
                            }
                            break;
                        case "costo_min":
                        case "costo_max":
                        case "costo":
                            try {
                                filtros.put(key, Double.parseDouble(value));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest()
                                        .body("Valor inválido para costo: " + value);
                            }
                            break;
                        case "fecha_desde":
                        case "fecha_hasta":
                            try {
                                filtros.put(key, value); // Se parseará en el servicio
                            } catch (Exception e) {
                                return ResponseEntity.badRequest()
                                        .body("Valor inválido para fecha: " + value);
                            }
                            break;
                        default:
                            filtros.put(key, value);
                            break;
                    }
                }
            }

            List<Mantenimiento> mantenimientos = mantenimientoService.listar(filtros);
            return ResponseEntity.ok(mantenimientos);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al consultar mantenimientos: " + e.getMessage());
        }
    }

    /**
     * Crear un nuevo mantenimiento
     */
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Mantenimiento mantenimiento, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(formatMessage(result));
        }

        try {
            // Verificar si el mantenimiento ya existe
            if (mantenimiento.getId() != null) {
                Map<String, Object> filtro = new HashMap<>();
                filtro.put("id", mantenimiento.getId());
                List<Mantenimiento> existentes = mantenimientoService.listar(filtro);

                if (!existentes.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Ya existe un mantenimiento con ID: " + mantenimiento.getId());
                }
            }

            Mantenimiento guardado = mantenimientoService.save(mantenimiento);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear mantenimiento: " + e.getMessage());
        }
    }

    /**
     * Actualizar un mantenimiento existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable String id,
                                        @Valid @RequestBody Mantenimiento mantenimiento,
                                        BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(formatMessage(result));
        }

        try {
            // Verificar si el mantenimiento existe
            Map<String, Object> filtro = new HashMap<>();
            filtro.put("id", id);
            List<Mantenimiento> existentes = mantenimientoService.listar(filtro);

            if (existentes.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            mantenimiento.setId(id);
            Mantenimiento actualizado = mantenimientoService.save(mantenimiento);
            return ResponseEntity.ok(actualizado);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar mantenimiento: " + e.getMessage());
        }
    }

    /**
     * Eliminar un mantenimiento por ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> eliminar(@PathVariable String id) {
        boolean eliminado = mantenimientoService.deleteById(id);

        Map<String, String> response = new HashMap<>();
        if (eliminado) {
            response.put("message", "Mantenimiento eliminado exitosamente");
            response.put("id", id);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "No se encontró un mantenimiento con ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener mantenimientos por placa de carro
     */
    @GetMapping("/carro/{placaCarro}")
    public ResponseEntity<List<Mantenimiento>> getMantenimientosPorCarro(@PathVariable String placaCarro) {
        List<Mantenimiento> mantenimientos = mantenimientoService.getMantenimientosPorCarro(placaCarro);
        return ResponseEntity.ok(mantenimientos);
    }

    /**
     * Obtener estadísticas generales de mantenimientos
     */
    private ResponseEntity<?> obtenerEstadisticas() {
        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("total_mantenimientos", mantenimientoService.count());
        estadisticas.put("costo_promedio", mantenimientoService.getCostoPromedio());
        estadisticas.put("costo_total", mantenimientoService.getCostoTotal());

        return ResponseEntity.ok(estadisticas);
    }

    /**
     * Obtener mantenimientos urgentes
     */
    private ResponseEntity<List<Mantenimiento>> obtenerMantenimientosUrgentes() {
        List<Mantenimiento> urgentes = mantenimientoService.getMantenimientosUrgentes();
        return ResponseEntity.ok(urgentes);
    }

    /**
     * Calcular costo total de mantenimientos por placa
     */
    private ResponseEntity<?> calcularCostoTotalPorPlaca(String placa) {
        List<Mantenimiento> mantenimientos = mantenimientoService.getMantenimientosPorCarro(placa);
        double costoTotal = mantenimientos.stream().mapToDouble(Mantenimiento::getCosto).sum();

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("placa", placa);
        resultado.put("costo_total", costoTotal);
        resultado.put("cantidad_mantenimientos", mantenimientos.size());

        return ResponseEntity.ok(resultado);
    }

    // Método para formatear mensajes de error
    private Map<String, String> formatMessage(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return errors;
    }
}
