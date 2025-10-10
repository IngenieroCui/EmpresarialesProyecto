package cal.example.POCEmpleado.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

/**
 * Clase Mantenimiento - Representa el detalle de los mantenimientos de un Carro
 * Relación: Carro (1) <---> (0..*) Mantenimiento
 * Cumple con los requisitos:
 * - int: kilometraje
 * - double: costo
 * - String: id, placaCarro, tipoMantenimiento, descripcion
 * - LocalDateTime: fechaMantenimiento, proximoMantenimiento
 * - boolean: completado
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Mantenimiento {

    @NotBlank(message = "El ID es obligatorio")
    private String id;

    @NotBlank(message = "La placa del carro es obligatoria")
    @Pattern(regexp = "^[A-Z]{3}-[0-9]{3}$", message = "La placa debe tener el formato ABC-123")
    private String placaCarro; // FK → Carro.placa

    @NotNull(message = "La fecha de mantenimiento es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaMantenimiento;

    @NotNull(message = "El kilometraje es obligatorio")
    @Min(value = 0, message = "El kilometraje debe ser mayor o igual a 0")
    @Max(value = 1000000, message = "El kilometraje debe ser menor a 1,000,000 km")
    private int kilometraje;

    @NotBlank(message = "El tipo de mantenimiento es obligatorio")
    @Pattern(regexp = "PREVENTIVO|CORRECTIVO|REVISION|CAMBIO_ACEITE|CAMBIO_LLANTAS|OTROS",
             message = "El tipo debe ser: PREVENTIVO, CORRECTIVO, REVISION, CAMBIO_ACEITE, CAMBIO_LLANTAS u OTROS")
    private String tipoMantenimiento;

    @NotNull(message = "El costo es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El costo debe ser mayor o igual a 0")
    private double costo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    private String descripcion;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime proximoMantenimiento;

    private boolean completado;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaRegistro;

    // Constructor por defecto
    public Mantenimiento() {
        this.id = UUID.randomUUID().toString();
        this.fechaRegistro = LocalDateTime.now();
        this.completado = false;
    }

    // Constructor completo
    public Mantenimiento(String placaCarro, LocalDateTime fechaMantenimiento, int kilometraje,
                        String tipoMantenimiento, double costo, String descripcion,
                        LocalDateTime proximoMantenimiento) {
        this.id = UUID.randomUUID().toString();
        this.placaCarro = placaCarro;
        this.fechaMantenimiento = fechaMantenimiento;
        this.kilometraje = kilometraje;
        this.tipoMantenimiento = tipoMantenimiento;
        this.costo = costo;
        this.descripcion = descripcion;
        this.proximoMantenimiento = proximoMantenimiento;
        this.completado = false;
        this.fechaRegistro = LocalDateTime.now();
    }

    // Métodos de negocio
    public boolean esUrgente() {
        if (proximoMantenimiento == null) {
            return false;
        }
        LocalDateTime ahora = LocalDateTime.now();
        return proximoMantenimiento.isBefore(ahora.plusDays(7));
    }

    public String getEstadoMantenimiento() {
        if (completado) {
            return "COMPLETADO";
        }
        if (esUrgente()) {
            return "URGENTE";
        }
        return "PENDIENTE";
    }

    public double calcularCostoConImpuesto() {
        return costo * 1.19; // IVA del 19%
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlacaCarro() {
        return placaCarro;
    }

    public void setPlacaCarro(String placaCarro) {
        this.placaCarro = placaCarro;
    }

    public LocalDateTime getFechaMantenimiento() {
        return fechaMantenimiento;
    }

    public void setFechaMantenimiento(LocalDateTime fechaMantenimiento) {
        this.fechaMantenimiento = fechaMantenimiento;
    }

    public int getKilometraje() {
        return kilometraje;
    }

    public void setKilometraje(int kilometraje) {
        this.kilometraje = kilometraje;
    }

    public String getTipoMantenimiento() {
        return tipoMantenimiento;
    }

    public void setTipoMantenimiento(String tipoMantenimiento) {
        this.tipoMantenimiento = tipoMantenimiento;
    }

    public double getCosto() {
        return costo;
    }

    public void setCosto(double costo) {
        this.costo = costo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getProximoMantenimiento() {
        return proximoMantenimiento;
    }

    public void setProximoMantenimiento(LocalDateTime proximoMantenimiento) {
        this.proximoMantenimiento = proximoMantenimiento;
    }

    public boolean isCompletado() {
        return completado;
    }

    public void setCompletado(boolean completado) {
        this.completado = completado;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Mantenimiento that = (Mantenimiento) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Mantenimiento{" +
                "id='" + id + '\'' +
                ", placaCarro='" + placaCarro + '\'' +
                ", fechaMantenimiento=" + fechaMantenimiento +
                ", kilometraje=" + kilometraje +
                ", tipoMantenimiento='" + tipoMantenimiento + '\'' +
                ", costo=" + costo +
                ", completado=" + completado +
                '}';
    }
}
