package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Mantenimiento;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio de Mantenimiento - Implementa la lógica de negocio
 * Gestiona mantenimientos en memoria usando un ArrayList
 */
@Service
public class MantenimientoService implements IMantenimientoService {

    private final List<Mantenimiento> mantenimientos = new ArrayList<>();
    private static final String JSON_FILE = "mantenimientos.json";

    public MantenimientoService() {
        try {
            loadFromJson();
        } catch (Exception e) {
            System.out.println("No se pudo cargar mantenimientos desde JSON, iniciando con lista vacía");
            inicializarDatosDePrueba();
        }
    }

    private void inicializarDatosDePrueba() {
        // Mantenimientos para el carro ABC-123
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

        // Mantenimientos para el carro DEF-456
        mantenimientos.add(new Mantenimiento(
            "DEF-456",
            LocalDateTime.now().minusMonths(2),
            30000,
            "CAMBIO_ACEITE",
            180000.0,
            "Cambio de aceite sintético y filtro de aceite",
            LocalDateTime.now().plusMonths(4)
        ));

        mantenimientos.add(new Mantenimiento(
            "DEF-456",
            LocalDateTime.now().minusDays(15),
            32000,
            "CORRECTIVO",
            450000.0,
            "Reparación del sistema de frenos: cambio de pastillas y discos",
            null
        ));

        // Marcar algunos como completados
        mantenimientos.get(0).setCompletado(true);
        mantenimientos.get(1).setCompletado(true);
    }

    @Override
    public Mantenimiento save(Mantenimiento mantenimiento) {
        if (mantenimiento.getId() == null || mantenimiento.getId().isEmpty()) {
            mantenimiento.setId(UUID.randomUUID().toString());
        }

        // Buscar si ya existe
        Optional<Mantenimiento> existente = mantenimientos.stream()
                .filter(m -> m.getId().equals(mantenimiento.getId()))
                .findFirst();

        if (existente.isPresent()) {
            // Actualizar
            mantenimientos.remove(existente.get());
            mantenimientos.add(mantenimiento);
        } else {
            // Crear nuevo
            if (mantenimiento.getFechaRegistro() == null) {
                mantenimiento.setFechaRegistro(LocalDateTime.now());
            }
            mantenimientos.add(mantenimiento);
        }

        try {
            saveToJson();
        } catch (Exception e) {
            System.err.println("Error al guardar en JSON: " + e.getMessage());
        }

        return mantenimiento;
    }

    @Override
    public List<Mantenimiento> listar(Map<String, Object> filtros) {
        if (filtros == null || filtros.isEmpty()) {
            return new ArrayList<>(mantenimientos);
        }

        return mantenimientos.stream()
                .filter(m -> cumpleFiltros(m, filtros))
                .collect(Collectors.toList());
    }

    private boolean cumpleFiltros(Mantenimiento m, Map<String, Object> filtros) {
        for (Map.Entry<String, Object> entry : filtros.entrySet()) {
            String key = entry.getKey().toLowerCase();
            Object value = entry.getValue();

            if (value == null) continue;

            switch (key) {
                case "id":
                    if (!m.getId().equalsIgnoreCase(value.toString())) return false;
                    break;
                case "placacarro":
                case "placa_carro":
                case "placa":
                    if (!m.getPlacaCarro().equalsIgnoreCase(value.toString())) return false;
                    break;
                case "tipomantenimiento":
                case "tipo_mantenimiento":
                case "tipo":
                    if (!m.getTipoMantenimiento().equalsIgnoreCase(value.toString())) return false;
                    break;
                case "kilometraje":
                    if (value instanceof Integer && m.getKilometraje() != (Integer) value) return false;
                    break;
                case "kilometraje_min":
                    if (value instanceof Integer && m.getKilometraje() < (Integer) value) return false;
                    break;
                case "kilometraje_max":
                    if (value instanceof Integer && m.getKilometraje() > (Integer) value) return false;
                    break;
                case "costo_min":
                    if (value instanceof Double && m.getCosto() < (Double) value) return false;
                    break;
                case "costo_max":
                    if (value instanceof Double && m.getCosto() > (Double) value) return false;
                    break;
                case "completado":
                    if (value instanceof Boolean && m.isCompletado() != (Boolean) value) return false;
                    break;
                case "urgente":
                    if (value instanceof Boolean && (Boolean) value && !m.esUrgente()) return false;
                    break;
            }
        }
        return true;
    }

    @Override
    public boolean deleteById(String id) {
        boolean removed = mantenimientos.removeIf(m -> m.getId().equals(id));
        if (removed) {
            try {
                saveToJson();
            } catch (Exception e) {
                System.err.println("Error al guardar en JSON: " + e.getMessage());
            }
        }
        return removed;
    }

    @Override
    public List<Mantenimiento> getMantenimientosPorCarro(String placaCarro) {
        return mantenimientos.stream()
                .filter(m -> m.getPlacaCarro().equalsIgnoreCase(placaCarro))
                .sorted(Comparator.comparing(Mantenimiento::getFechaMantenimiento).reversed())
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
        if (mantenimientos.isEmpty()) return 0.0;
        return getCostoTotal() / mantenimientos.size();
    }

    @Override
    public List<Mantenimiento> getMantenimientosUrgentes() {
        return mantenimientos.stream()
                .filter(Mantenimiento::esUrgente)
                .sorted(Comparator.comparing(Mantenimiento::getProximoMantenimiento))
                .collect(Collectors.toList());
    }

    @Override
    public void saveToJson() throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(JSON_FILE), mantenimientos);
    }

    @Override
    public void loadFromJson() throws Exception {
        File file = new File(JSON_FILE);
        if (!file.exists()) {
            throw new IOException("Archivo JSON no existe");
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        Mantenimiento[] array = mapper.readValue(file, Mantenimiento[].class);

        mantenimientos.clear();
        mantenimientos.addAll(Arrays.asList(array));
    }
}
