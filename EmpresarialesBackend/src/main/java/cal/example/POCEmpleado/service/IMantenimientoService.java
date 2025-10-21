package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Mantenimiento;

import java.util.List;
import java.util.Map;

/**
 * Interfaz del servicio de Mantenimientos - Principio de Segregación de Interfaces (ISP)
 * Define las operaciones básicas CRUD y consultas para la gestión de mantenimientos
 */
public interface IMantenimientoService {

    // Operaciones CRUD básicas
    Mantenimiento save(Mantenimiento mantenimiento);
    boolean deleteById(String id);

    // MÉTODO UNIFICADO - Único método de consulta que maneja todos los casos
    // - Sin filtros: retorna todos los mantenimientos
    // - Con id: retorna un mantenimiento específico (como lista de 1 elemento)
    // - Con placaCarro: retorna todos los mantenimientos de ese carro
    // - Con otros filtros: retorna mantenimientos filtrados
    List<Mantenimiento> listar(Map<String, Object> filtros);

    // Operaciones específicas
    List<Mantenimiento> getMantenimientosPorCarro(String placaCarro);
    List<Mantenimiento> getMantenimientosUrgentes();

    // Operaciones de estadísticas
    long count();
    double getCostoTotal();
    double getCostoPromedio();

    // Persistencia JSON
    void saveToJson() throws Exception;
    void loadFromJson() throws Exception;
}
