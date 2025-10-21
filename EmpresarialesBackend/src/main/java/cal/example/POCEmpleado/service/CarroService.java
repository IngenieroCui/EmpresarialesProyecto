package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Carro;
import cal.example.POCEmpleado.model.Mantenimiento;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de Carros
 * Principios SOLID aplicados:
 * - SRP: Responsabilidad única de gestionar carros
 * - OCP: Abierto para extensión mediante la interfaz
 * - LSP: Sustituible por cualquier implementación de ICarroService
 * - ISP: Interfaz segregada con operaciones específicas
 * - DIP: Depende de abstracciones (ICarroService)
 */
@Service
public class CarroService implements ICarroService {

    private final List<Carro> carros = new ArrayList<>();
    private final ObjectMapper objectMapper;
    private final String JSON_FILE_PATH = "carros.json";
    
    @Autowired
    private MantenimientoService mantenimientoService;

    public CarroService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        loadFromJson();
    }

    @PreDestroy
    public void cleanup() {
        saveToJson();
    }

    @Override
    public Carro save(Carro carro) {
        // Verificar si ya existe un carro con esa placa
        Map<String, Object> filtroPlaca = new HashMap<>();
        filtroPlaca.put("placa", carro.getPlaca());
        List<Carro> existentes = listar(filtroPlaca);

        if (!existentes.isEmpty()) {
            // Actualizar existente
            carros.removeIf(c -> c.getPlaca().equalsIgnoreCase(carro.getPlaca()));
        }
        carros.add(carro);
        saveToJson(); // Persistir cambios inmediatamente
        return carro;
    }
    
    @Override
    public boolean deleteByPlaca(String placa) {
        boolean removed = carros.removeIf(carro -> carro.getPlaca().equalsIgnoreCase(placa));
        if (removed) {
            // Eliminar mantenimientos asociados en cascada
            if (mantenimientoService != null) {
                List<Mantenimiento> mantenimientos = mantenimientoService.getMantenimientosPorCarro(placa);
                for (Mantenimiento m : mantenimientos) {
                    mantenimientoService.deleteById(m.getId());
                }
                System.out.println("✅ Eliminados " + mantenimientos.size() + " mantenimientos del carro " + placa);
            }
            saveToJson(); // Persistir cambios
        }
        return removed;
    }

    /**
     * MÉTODO UNIFICADO - Único método de consulta que maneja todos los casos:
     * - Sin filtros: retorna todos los carros
     * - Con placa: retorna un carro específico (como lista de 1 elemento)
     * - Con otros filtros: retorna carros filtrados
     */
    @Override
    public List<Carro> listar(Map<String, Object> filtros) {
        if (filtros == null || filtros.isEmpty()) {
            return new ArrayList<>(carros);
        }

        return carros.stream()
                .filter(carro -> aplicarFiltros(carro, filtros))
                .collect(Collectors.toList());
    }
    
    private boolean aplicarFiltros(Carro carro, Map<String, Object> filtros) {
        for (Map.Entry<String, Object> filtro : filtros.entrySet()) {
            String campo = filtro.getKey().toLowerCase();
            Object valor = filtro.getValue();

            if (valor == null) continue;

            switch (campo) {
                case "placa":
                    if (!carro.getPlaca().equalsIgnoreCase(valor.toString())) {
                        return false;
                    }
                    break;
                case "marca":
                    if (!carro.getMarca().toLowerCase().contains(valor.toString().toLowerCase())) {
                        return false;
                    }
                    break;
                case "anio":
                    if (carro.getAnio() != (Integer) valor) {
                        return false;
                    }
                    break;
                case "precio_min":
                    if (carro.getPrecio() < (Double) valor) {
                        return false;
                    }
                    break;
                case "precio_max":
                    if (carro.getPrecio() > (Double) valor) {
                        return false;
                    }
                    break;
                case "precio":
                    if (carro.getPrecio() != (Double) valor) {
                        return false;
                    }
                    break;
                case "transmision":
                case "tipotransmision":
                    if (!carro.getTipoTransmision().equalsIgnoreCase(valor.toString())) {
                        return false;
                    }
                    break;
                case "aire_acondicionado":
                case "tieneaireacondicicionado":
                    if (carro.isTieneAireAcondicionado() != (Boolean) valor) {
                        return false;
                    }
                    break;
                case "numeropuertas":
                case "numero_puertas":
                    if (carro.getNumeroPuertas() != (Integer) valor) {
                        return false;
                    }
                    break;
                case "color":
                    if (!carro.getColor().toLowerCase().contains(valor.toString().toLowerCase())) {
                        return false;
                    }
                    break;
                case "modelo":
                    if (!carro.getModelo().toLowerCase().contains(valor.toString().toLowerCase())) {
                        return false;
                    }
                    break;
                case "estado":
                    if (!carro.getEstado().toLowerCase().contains(valor.toString().toLowerCase())) {
                        return false;
                    }
                    break;
                case "combustible":
                    if (!carro.getCombustible().toLowerCase().contains(valor.toString().toLowerCase())) {
                        return false;
                    }
                    break;
                case "fechadesde":
                    try {
                        LocalDateTime fechaDesde = LocalDateTime.parse(valor.toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                        LocalDateTime fechaRegistro = carro.getFechaRegistro(); // Ya es LocalDateTime, no necesita parsing
                        if (fechaRegistro.isBefore(fechaDesde)) {
                            return false;
                        }
                    } catch (Exception e) {
                        return false;
                    }
                    break;
                case "fechahasta":
                    try {
                        LocalDateTime fechaHasta = LocalDateTime.parse(valor.toString(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                        LocalDateTime fechaRegistro = carro.getFechaRegistro(); // Ya es LocalDateTime, no necesita parsing
                        if (fechaRegistro.isAfter(fechaHasta)) {
                            return false;
                        }
                    } catch (Exception e) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    @Override
    public long count() {
        return carros.size();
    }

    @Override
    public double getPrecioPromedio() {
        return carros.stream()
                .mapToDouble(Carro::getPrecio)
                .average()
                .orElse(0.0);
    }

    @Override
    public void saveToJson() {
        try {
            objectMapper.writeValue(new File(JSON_FILE_PATH), carros);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar carros en JSON: " + e.getMessage(), e);
        }
    }

    @Override
    public void loadFromJson() {
        File file = new File(JSON_FILE_PATH);
        if (file.exists()) {
            try {
                List<Carro> carrosCargados = objectMapper.readValue(file, new TypeReference<>() {});
                carros.clear();
                carros.addAll(carrosCargados);
            } catch (IOException e) {
                System.err.println("Error al cargar carros desde JSON: " + e.getMessage());
                // Inicializar con datos por defecto si hay error
                inicializarDatosPorDefecto();
            }
        } else {
            inicializarDatosPorDefecto();
        }
    }

    private void inicializarDatosPorDefecto() {
        // Cargar datos por defecto si no existe el archivo JSON
        System.out.println("Inicializando datos por defecto...");
    }
}
