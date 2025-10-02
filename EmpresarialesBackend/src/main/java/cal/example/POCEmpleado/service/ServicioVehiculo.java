package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Vehiculo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * Servicio simplificado para Vehículos - Sin Observer pattern
 */
@Service
public class ServicioVehiculo implements IServicioVehiculo {

    // Instancia única del Singleton
    private static ServicioVehiculo instance;

    // Lista de vehículos (estado interno)
    private final ArrayList<Vehiculo> vehiculos = new ArrayList<>();

    // Constructor privado para prevenir instanciación externa
    private ServicioVehiculo() {
    }

    public static ServicioVehiculo getInstance() {
        if (instance == null) {
            instance = new ServicioVehiculo();
        }
        return instance;
    }

    @Override
    public boolean addVehiculo(Vehiculo v) {
        if (v == null) {
            return false;
        }
        vehiculos.add(v);
        return true;
    }

    @Override
    public ArrayList<Vehiculo> getVehiculos() {
        return new ArrayList<>(vehiculos);
    }

    @Override
    public Vehiculo getVehiculoByPlaca(String placa) {
        if (placa == null) {
            return null;
        }
        for (Vehiculo v : vehiculos) {
            if (placa.equalsIgnoreCase(v.getPlaca())) {
                return v;
            }
        }
        return null;
    }

    @Override
    public boolean updateVehiculo(Vehiculo v) {
        if (v == null) {
            return false;
        }
        for (int i = 0; i < vehiculos.size(); i++) {
            Vehiculo actual = vehiculos.get(i);
            if (actual.getPlaca().equalsIgnoreCase(v.getPlaca())) {
                vehiculos.set(i, v);
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean deleteVehiculo(Vehiculo v) {
        if (v != null) {
            return vehiculos.remove(v);
        }
        return false;
    }

    // Métodos adicionales útiles
    public double calcularValorComercialTotal() {
        double valorTotal = 0.0;
        for (Vehiculo vehiculo : vehiculos) {
            valorTotal += vehiculo.calcularValorComercial();
        }
        return valorTotal;
    }

    public String obtenerReporteCompleto() {
        if (vehiculos.isEmpty()) {
            return "No hay vehiculos registrados en el sistema.";
        }

        StringBuilder reporte = new StringBuilder();
        reporte.append("=== REPORTE COMPLETO DE VEHICULOS ===\n\n");

        for (int i = 0; i < vehiculos.size(); i++) {
            Vehiculo vehiculo = vehiculos.get(i);
            reporte.append(String.format("VEHICULO #%d\n", i + 1));
            reporte.append(vehiculo.getInformacionCompleta());
            reporte.append("\n");
            reporte.append("Mantenimiento: ").append(vehiculo.obtenerInformacionMantenimiento());
            reporte.append("\n");
            reporte.append("─".repeat(50)).append("\n\n");
        }

        return reporte.toString();
    }
}
