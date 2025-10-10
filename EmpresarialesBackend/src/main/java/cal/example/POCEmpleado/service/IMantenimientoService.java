package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Mantenimiento;
import java.util.List;
import java.util.Map;

/**
 * Interfaz de servicio para Mantenimiento
 * Define el contrato de operaciones CRUD y búsquedas
 */
public interface IMantenimientoService {

    /**
     * Guarda o actualiza un mantenimiento
     * @param mantenimiento El mantenimiento a guardar
     * @return El mantenimiento guardado
     */
    Mantenimiento save(Mantenimiento mantenimiento);

    /**
     * Lista mantenimientos con filtros opcionales
     * @param filtros Mapa de filtros (id, placaCarro, tipoMantenimiento, etc.)
     * @return Lista de mantenimientos que cumplen los filtros
     */
    List<Mantenimiento> listar(Map<String, Object> filtros);

    /**
     * Elimina un mantenimiento por su ID
     * @param id El ID del mantenimiento a eliminar
     * @return true si se eliminó, false si no existe
     */
    boolean deleteById(String id);

    /**
     * Obtiene todos los mantenimientos de un carro específico
     * @param placaCarro La placa del carro
     * @return Lista de mantenimientos del carro
     */
    List<Mantenimiento> getMantenimientosPorCarro(String placaCarro);

    /**
     * Cuenta el total de mantenimientos
     * @return Número total de mantenimientos
     */
    long count();

    /**
     * Calcula el costo total de mantenimientos
     * @return Suma total de todos los costos
     */
    double getCostoTotal();

    /**
     * Calcula el costo promedio de mantenimientos
     * @return Promedio de los costos
     */
    double getCostoPromedio();

    /**
     * Obtiene mantenimientos urgentes (próximos en menos de 7 días)
     * @return Lista de mantenimientos urgentes
     */
    List<Mantenimiento> getMantenimientosUrgentes();

    /**
     * Guarda los datos en archivo JSON (persistencia manual)
     * @throws Exception Si hay error al guardar
     */
    void saveToJson() throws Exception;

    /**
     * Carga los datos desde archivo JSON
     * @throws Exception Si hay error al cargar
     */
    void loadFromJson() throws Exception;
}
