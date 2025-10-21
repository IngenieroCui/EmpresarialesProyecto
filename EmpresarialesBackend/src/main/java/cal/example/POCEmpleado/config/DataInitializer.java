package cal.example.POCEmpleado.config;

import cal.example.POCEmpleado.service.CarroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Inicializador de datos simple para carros
 * DESACTIVADO - No se precargan datos
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CarroService carroService;

    @Override
    public void run(String... args) {
        // Precarga de datos desactivada
        // La aplicación inicia sin datos precargados
        System.out.println("ℹ️ Inicialización: Precarga de datos desactivada");
        System.out.println("ℹ️ La aplicación inicia sin datos. Use la API para crear carros.");
    }
}
