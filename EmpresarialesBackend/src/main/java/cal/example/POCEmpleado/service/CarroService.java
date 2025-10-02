package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Carro;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Servicio simple para la gestión de Carros
 * Siguiendo el patrón del EmpleadoController
 */
@Service
public class CarroService {
    
    // Lista en memoria para almacenar los carros (como en EmpleadoController)
    private final List<Carro> carros = new ArrayList<>();
    
    // Métodos CRUD simples
    public Carro save(Carro carro) {
        // Verificar si ya existe un carro con esa placa
        Optional<Carro> existente = findByPlaca(carro.getPlaca());
        if (existente.isPresent()) {
            // Actualizar existente
            carros.remove(existente.get());
        }
        carros.add(carro);
        return carro;
    }
    
    public Optional<Carro> findByPlaca(String placa) {
        return carros.stream()
                .filter(carro -> carro.getPlaca().equalsIgnoreCase(placa))
                .findFirst();
    }
    
    public List<Carro> findAll() {
        return new ArrayList<>(carros);
    }
    
    public List<Carro> findByMarca(String marca) {
        return carros.stream()
                .filter(carro -> carro.getMarca().equalsIgnoreCase(marca))
                .toList();
    }
    
    public List<Carro> findByAnio(int anio) {
        return carros.stream()
                .filter(carro -> carro.getAnio() == anio)
                .toList();
    }
    
    public List<Carro> findByPrecioRange(double min, double max) {
        return carros.stream()
                .filter(carro -> carro.getPrecio() >= min && carro.getPrecio() <= max)
                .toList();
    }
    
    public boolean deleteByPlaca(String placa) {
        return carros.removeIf(carro -> carro.getPlaca().equalsIgnoreCase(placa));
    }
    
    public long count() {
        return carros.size();
    }
    
    public double getPrecioPromedio() {
        return carros.stream()
                .mapToDouble(Carro::getPrecio)
                .average()
                .orElse(0.0);
    }
}
