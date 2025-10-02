package cal.example.POCEmpleado.controller;

import cal.example.POCEmpleado.model.Carro;
import cal.example.POCEmpleado.service.ICarroService;
import cal.example.POCEmpleado.errors.ErrorMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Controlador REST para Carros
 * Implementa principios SOLID y arquitectura hexagonal
 * DIP: Depende de la abstracción ICarroService, no de la implementación concreta
 */
@RestController
@RequestMapping("/api/carro")
@CrossOrigin(origins = "*")
public class CarroController {

    private final ICarroService carroService;

    // Inyección por constructor (mejor práctica)
    @Autowired
    public CarroController(ICarroService carroService) {
        this.carroService = carroService;
    }

    @GetMapping(value = "/healthCheck")
    public String healthCheck() {
        return "Carros API Status Ok!";
    }

    /**
     * MÉTODO UNIFICADO - Listar carros con filtros opcionales
     * Este es el ÚNICO método GET que maneja todas las consultas:
     * - Sin parámetros: retorna todos los carros
     * - Con placa: retorna un carro específico
     * - Con otros filtros: retorna carros filtrados
     * - Con action=estadisticas: retorna estadísticas
     * - Con action=valor-comercial&placa=XXX: retorna valor comercial
     */
    @GetMapping
    public ResponseEntity<?> listar(@RequestParam Map<String, String> params) {
        try {
            // Manejar acciones especiales
            String action = params.get("action");
            if ("estadisticas".equals(action)) {
                return obtenerEstadisticas();
            }
            if ("valor-comercial".equals(action)) {
                String placa = params.get("placa");
                if (placa != null && !placa.trim().isEmpty()) {
                    return calcularValorComercial(placa);
                }
                return ResponseEntity.badRequest().body("Placa requerida para calcular valor comercial");
            }

            // Convertir parámetros String a Object para el servicio
            Map<String, Object> filtros = new HashMap<>();

            for (Map.Entry<String, String> entry : params.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();

                if (value != null && !value.trim().isEmpty() && !"action".equals(key)) {
                    // Conversión de tipos según el parámetro
                    switch (key.toLowerCase()) {
                        case "anio":
                            try {
                                filtros.put(key, Integer.parseInt(value));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest()
                                    .body("Valor inválido para año: " + value);
                            }
                            break;
                        case "precio_min":
                        case "precio_max":
                        case "precio":
                            try {
                                filtros.put(key, Double.parseDouble(value));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest()
                                    .body("Valor inválido para precio: " + value);
                            }
                            break;
                        case "aire_acondicionado":
                        case "tieneaireacondicicionado":
                            filtros.put(key, Boolean.parseBoolean(value));
                            break;
                        case "numeropuertas":
                        case "numero_puertas":
                            try {
                                filtros.put(key, Integer.parseInt(value));
                            } catch (NumberFormatException e) {
                                return ResponseEntity.badRequest()
                                    .body("Valor inválido para número de puertas: " + value);
                            }
                            break;
                        default:
                            filtros.put(key, value);
                    }
                }
            }

            List<Carro> carros = carroService.listar(filtros);
            return ResponseEntity.ok(carros);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error interno del servidor: " + e.getMessage());
        }
    }

    // CREATE - Crear carro (POST)
    @PostMapping
    public ResponseEntity<?> crearCarro(@Valid @RequestBody Carro carro, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(formatMessage(bindingResult));
        }

        try {
            Carro carroGuardado = carroService.save(carro);
            return ResponseEntity.status(HttpStatus.CREATED).body(carroGuardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el carro: " + e.getMessage());
        }
    }

    // UPDATE - Actualizar carro (PUT)
    @PutMapping(value = "/{placa}")
    public ResponseEntity<?> actualizarCarro(@PathVariable("placa") String placa,
                                           @Valid @RequestBody Carro carro,
                                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(formatMessage(bindingResult));
        }

        // Buscar usando el método unificado
        Map<String, Object> filtros = new HashMap<>();
        filtros.put("placa", placa);
        List<Carro> carrosEncontrados = carroService.listar(filtros);

        if (carrosEncontrados.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Asegurar que la placa no cambie
        carro.setPlaca(placa);
        Carro carroActualizado = carroService.save(carro);
        return ResponseEntity.ok(carroActualizado);
    }

    // DELETE - Eliminar carro (DELETE)
    @DeleteMapping(value = "/{placa}")
    public ResponseEntity<Map<String, String>> eliminarCarro(@PathVariable("placa") String placa) {
        boolean eliminado = carroService.deleteByPlaca(placa);

        Map<String, String> response = new HashMap<>();
        if (eliminado) {
            response.put("message", "Carro eliminado exitosamente");
            response.put("placa", placa);
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "No se encontró un carro con la placa: " + placa);
            return ResponseEntity.notFound().build();
        }
    }

    // Persistencia manual de JSON
    @PostMapping(value = "/guardar-json")
    public ResponseEntity<Map<String, String>> guardarEnJson() {
        try {
            carroService.saveToJson();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Datos guardados en JSON exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error al guardar en JSON: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Métodos auxiliares privados
    private ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCarros", carroService.count());
        stats.put("precioPromedio", carroService.getPrecioPromedio());
        return ResponseEntity.ok(stats);
    }

    private ResponseEntity<?> calcularValorComercial(String placa) {
        Map<String, Object> filtros = new HashMap<>();
        filtros.put("placa", placa);
        List<Carro> carros = carroService.listar(filtros);

        if (!carros.isEmpty()) {
            Carro carro = carros.get(0);
            Map<String, Object> response = new HashMap<>();
            response.put("placa", placa);
            response.put("valorComercial", carro.calcularValorComercial());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
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
