package cal.example.POCEmpleado.controller;

import cal.example.POCEmpleado.model.Carro;
import cal.example.POCEmpleado.service.CarroService;
import cal.example.POCEmpleado.errors.ErrorMessage;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Controlador REST para Carros - Siguiendo el patrón del EmpleadoController
 */
@RestController
@RequestMapping("/carros")
@CrossOrigin(origins = "*")
public class CarroController {

    @Autowired
    private CarroService carroService;

    @GetMapping(value = "/healthCheck")
    public String healthCheck() {
        return "Carros API Status Ok!";
    }

    // CREATE - Crear carro (POST)
    @PostMapping(value = "/")
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

    // READ - Obtener todos los carros (GET)
    @GetMapping(value = "/")
    public ResponseEntity<List<Carro>> obtenerTodosLosCarros() {
        List<Carro> carros = carroService.findAll();
        return ResponseEntity.ok(carros);
    }

    // READ - Buscar carro por placa (GET)
    @GetMapping(value = "/{placa}")
    public ResponseEntity<Carro> obtenerCarroPorPlaca(@PathVariable("placa") String placa) {
        Optional<Carro> carro = carroService.findByPlaca(placa);
        if (carro.isPresent()) {
            return ResponseEntity.ok(carro.get());
        }
        return ResponseEntity.notFound().build();
    }

    // UPDATE - Actualizar carro (PUT)
    @PutMapping(value = "/{placa}")
    public ResponseEntity<?> actualizarCarro(@PathVariable("placa") String placa,
                                           @Valid @RequestBody Carro carro,
                                           BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(formatMessage(bindingResult));
        }

        Optional<Carro> carroExistente = carroService.findByPlaca(placa);
        if (carroExistente.isEmpty()) {
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

    // Búsquedas adicionales
    @GetMapping(value = "/buscar/marca/{marca}")
    public ResponseEntity<List<Carro>> buscarPorMarca(@PathVariable("marca") String marca) {
        List<Carro> carros = carroService.findByMarca(marca);
        return ResponseEntity.ok(carros);
    }

    @GetMapping(value = "/buscar/anio/{anio}")
    public ResponseEntity<List<Carro>> buscarPorAnio(@PathVariable("anio") int anio) {
        List<Carro> carros = carroService.findByAnio(anio);
        return ResponseEntity.ok(carros);
    }

    @GetMapping(value = "/buscar/precio")
    public ResponseEntity<List<Carro>> buscarPorPrecio(@RequestParam("min") double min,
                                                       @RequestParam("max") double max) {
        List<Carro> carros = carroService.findByPrecioRange(min, max);
        return ResponseEntity.ok(carros);
    }

    // Estadísticas
    @GetMapping(value = "/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCarros", (Object) carroService.count());
        stats.put("precioPromedio", (Object) carroService.getPrecioPromedio());
        return ResponseEntity.ok(stats);
    }

    // Valor comercial
    @GetMapping(value = "/{placa}/valor-comercial")
    public ResponseEntity<?> calcularValorComercial(@PathVariable("placa") String placa) {
        Optional<Carro> carro = carroService.findByPlaca(placa);
        if (carro.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("placa", placa);
            response.put("valorComercial", (Object) carro.get().calcularValorComercial());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    // Método para formatear mensajes de error (igual que en EmpleadoController)
    private String formatMessage(BindingResult result) {
        List<Map<String, String>> errores = result.getFieldErrors().stream()
                .map(err -> {
                    Map<String, String> error = new HashMap<>();
                    error.put(err.getField(), err.getDefaultMessage());
                    return error;
                }).collect(Collectors.toList());

        ErrorMessage errorMessage = ErrorMessage.builder()
                .code("VALIDATION_ERROR")
                .mensajes(errores)
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String jsonString = "";
        try {
            jsonString = mapper.writeValueAsString(errorMessage);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return jsonString;
    }
}
