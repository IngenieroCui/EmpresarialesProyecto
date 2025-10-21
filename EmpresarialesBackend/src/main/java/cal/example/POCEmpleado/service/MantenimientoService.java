package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Mantenimiento;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementación del servicio de Mantenimientos
 * Alineado con los clientes React y C# existentes
 */
@Service
public class MantenimientoService implements IMantenimientoService {

    private final List<Mantenimiento> mantenimientos = new ArrayList<>();
    private final ObjectMapper objectMapper;
    private final String JSON_FILE_PATH = "mantenimientos.json";

    public MantenimientoService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        try {
            loadFromJson();
        } catch (Exception e) {
            System.err.println("Error al inicializar mantenimientos: " + e.getMessage());
        }
    }

    @PreDestroy
    public void cleanup() {
        try {
            saveToJson();
        } catch (Exception e) {
            System.err.println("Error al guardar al cerrar: " + e.getMessage());
        }
    }

    @Override
    public Mantenimiento save(Mantenimiento mantenimiento) {
        // Verificar si ya existe un mantenimiento con ese ID
        if (mantenimiento.getId() != null && !mantenimiento.getId().isEmpty()) {
            Map<String, Object> filtroId = new HashMap<>();
            filtroId.put("id", mantenimiento.getId());
            List<Mantenimiento> existentes = listar(filtroId);

            if (!existentes.isEmpty()) {
                // Actualizar existente
                mantenimientos.removeIf(m -> m.getId().equals(mantenimiento.getId()));
            }
        } else {
            // Asignar nuevo ID
            mantenimiento.setId(UUID.randomUUID().toString());
        }
        
        if (mantenimiento.getFechaRegistro() == null) {
            mantenimiento.setFechaRegistro(LocalDateTime.now());
        }
        
        mantenimientos.add(mantenimiento);
        
        try {
            saveToJson();
        } catch (Exception e) {
            System.err.println("Error al guardar en JSON: " + e.getMessage());
        }
        
        return mantenimiento;
    }

    @Override
    public boolean deleteById(String id) {
        boolean removed = mantenimientos.removeIf(mantenimiento -> mantenimiento.getId().equals(id));
        if (removed) {
            try {
                saveToJson();
            } catch (Exception e) {
                System.err.println("Error al guardar después de eliminar: " + e.getMessage());
            }
        }
        return removed;
    }

    @Override
    public List<Mantenimiento> listar(Map<String, Object> filtros) {
        if (filtros == null || filtros.isEmpty()) {
            return new ArrayList<>(mantenimientos);
        }

        return mantenimientos.stream()
                .filter(mantenimiento -> aplicarFiltros(mantenimiento, filtros))
                .collect(Collectors.toList());
    }

    private boolean aplicarFiltros(Mantenimiento mantenimiento, Map<String, Object> filtros) {
        for (Map.Entry<String, Object> filtro : filtros.entrySet()) {
            String campo = filtro.getKey().toLowerCase();
            Object valor = filtro.getValue();

            if (valor == null) continue;

            switch (campo) {
                case "id":
                    if (!mantenimiento.getId().equalsIgnoreCase(valor.toString())) {
                        return false;
                    }
                    break;
                case "placacarro":
                case "placa_carro":
                case "placa":
                    if (!mantenimiento.getPlacaCarro().equalsIgnoreCase(valor.toString())) {
                        return false;
                    }
                    break;
                case "tipomantenimiento":
                case "tipo_mantenimiento":
                case "tipo":
                    if (!mantenimiento.getTipoMantenimiento().toLowerCase().contains(valor.toString().toLowerCase())) {
                        return false;
                    }
                    break;
                case "kilometraje":
                    if (valor instanceof Integer && mantenimiento.getKilometraje() != (Integer) valor) {
                        return false;
                    }
                    break;
                case "kilometraje_min":
                    if (valor instanceof Integer && mantenimiento.getKilometraje() < (Integer) valor) {
                        return false;
                    }
                    break;
                case "kilometraje_max":
                    if (valor instanceof Integer && mantenimiento.getKilometraje() > (Integer) valor) {
                        return false;
                    }
                    break;
                case "costo_min":
                    if (valor instanceof Double && mantenimiento.getCosto() < (Double) valor) {
                        return false;
                    }
                    break;
                case "costo_max":
                    if (valor instanceof Double && mantenimiento.getCosto() > (Double) valor) {
                        return false;
                    }
                    break;
                case "completado":
                    if (valor instanceof Boolean && mantenimiento.isCompletado() != (Boolean) valor) {
                        return false;
                    }
                    break;
                case "urgente":
                    if (valor instanceof Boolean && (Boolean) valor && !mantenimiento.calcularEsUrgente()) {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    @Override
    public List<Mantenimiento> getMantenimientosPorCarro(String placaCarro) {
        return mantenimientos.stream()
                .filter(m -> m.getPlacaCarro().equalsIgnoreCase(placaCarro))
                .sorted(Comparator.comparing(Mantenimiento::getFechaMantenimiento).reversed())
                .collect(Collectors.toList());
    }

    @Override
    public List<Mantenimiento> getMantenimientosUrgentes() {
        return mantenimientos.stream()
                .filter(Mantenimiento::calcularEsUrgente)
                .sorted(Comparator.comparing(Mantenimiento::getProximoMantenimiento))
                .collect(Collectors.toList());
    }

    @Override
    public long count() {
        return mantenimientos.size();
    }

    @Override
    public double getCostoTotal() {
        return mantenimientos.stream()
                .mapToDouble(Mantenimiento::getCosto)
                .sum();
    }

    @Override
    public double getCostoPromedio() {
        if (mantenimientos.isEmpty()) {
            return 0.0;
        }
        return getCostoTotal() / mantenimientos.size();
    }

    @Override
    public void saveToJson() throws Exception {
        File file = new File(JSON_FILE_PATH);
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, mantenimientos);
        System.out.println("✅ Mantenimientos guardados en JSON: " + mantenimientos.size() + " registros");
    }

    @Override
    public void loadFromJson() throws Exception {
        try {
            File file = new File(JSON_FILE_PATH);
            if (file.exists()) {
                List<Mantenimiento> loaded = objectMapper.readValue(
                        file,
                        new TypeReference<List<Mantenimiento>>() {}
                );
                mantenimientos.clear();
                mantenimientos.addAll(loaded);
                
                System.out.println("✅ Mantenimientos cargados desde JSON: " + mantenimientos.size() + " registros");
            } else {
                System.out.println("ℹ️ Archivo JSON no existe, iniciando con lista vacía");
                inicializarDatosDemo();
            }
        } catch (IOException e) {
            System.err.println("⚠️ Error al cargar mantenimientos desde JSON: " + e.getMessage());
            inicializarDatosDemo();
        }
    }

    private void inicializarDatosDemo() {
        // Datos de demostración
        mantenimientos.add(new Mantenimiento(
                "ABC-123",
                LocalDateTime.now().minusMonths(6),
                50000,
                "PREVENTIVO",
                350000.0,
                "Mantenimiento preventivo de 50,000 km: cambio de aceite, filtros y revisión general",
                LocalDateTime.now().plusMonths(6)
        ));

        mantenimientos.add(new Mantenimiento(
                "ABC-123",
                LocalDateTime.now().minusMonths(3),
                55000,
                "CAMBIO_LLANTAS",
                1200000.0,
                "Cambio de las 4 llantas delanteras y traseras por desgaste",
                null
        ));

        mantenimientos.add(new Mantenimiento(
                "DEF-456",
                LocalDateTime.now().minusMonths(2),
                30000,
                "CAMBIO_ACEITE",
                180000.0,
                "Cambio de aceite sintético y filtro de aceite",
                LocalDateTime.now().plusMonths(4)
        ));

        // Marcar algunos como completados
        if (mantenimientos.size() > 0) {
            mantenimientos.get(0).setCompletado(true);
        }
        if (mantenimientos.size() > 1) {
            mantenimientos.get(1).setCompletado(true);
        }

        try {
            saveToJson();
            System.out.println("✅ Datos demo de mantenimientos inicializados");
        } catch (Exception e) {
            System.err.println("Error al guardar datos demo: " + e.getMessage());
        }
    }
}

