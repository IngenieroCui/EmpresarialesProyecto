package cal.example.POCEmpleado.service;

import cal.example.POCEmpleado.model.Vehiculo;
import java.util.ArrayList;

public interface IServicioVehiculo {
    boolean addVehiculo(Vehiculo v);
    ArrayList<Vehiculo> getVehiculos();
    Vehiculo getVehiculoByPlaca(String placa);
    boolean updateVehiculo(Vehiculo v);
    boolean deleteVehiculo(Vehiculo v);
}
