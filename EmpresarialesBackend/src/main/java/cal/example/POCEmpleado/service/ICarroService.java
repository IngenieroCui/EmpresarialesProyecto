package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Carro;

import java.util.List;
import java.util.Map;

/**
 * Interfaz del servicio de Carros - Principio de Segregación de Interfaces (ISP)
 * Define las operaciones básicas CRUD y consultas para la gestión de carros
 */
public interface ICarroService {

    // Operaciones CRUD básicas
    Carro save(Carro carro);
    boolean deleteByPlaca(String placa);

    // MÉTODO UNIFICADO - Único método de consulta que maneja todos los casos
    // - Sin filtros: retorna todos los carros
    // - Con placa: retorna un carro específico (como lista de 1 elemento)
    // - Con otros filtros: retorna carros filtrados
    List<Carro> listar(Map<String, Object> filtros);

    // Operaciones de estadísticas
    long count();
    double getPrecioPromedio();

    // Persistencia JSON
    void saveToJson();
    void loadFromJson();
}
