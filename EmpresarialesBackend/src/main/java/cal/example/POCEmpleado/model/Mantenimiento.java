package cal.example.POCEmpleado.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entidad Mantenimiento
 * Representa un registro de mantenimiento realizado a un vehículo
 * Alineado con los clientes React y C# existentes
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Mantenimiento {

    private String id;

    @NotBlank(message = "La placa del carro es obligatoria")
    @Pattern(regexp = "^[A-Z]{3}-[0-9]{3}$", message = "La placa debe tener el formato ABC-123")
    private String placaCarro;

    @NotNull(message = "La fecha de mantenimiento es obligatoria")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaMantenimiento;

    @NotNull(message = "El kilometraje es obligatorio")
    @Min(value = 0, message = "El kilometraje debe ser mayor o igual a 0")
    @Max(value = 1000000, message = "El kilometraje no puede exceder 1,000,000 km")
    private int kilometraje;

    @NotBlank(message = "El tipo de mantenimiento es obligatorio")
    private String tipoMantenimiento;

    @NotNull(message = "El costo es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El costo debe ser mayor que 0")
    private double costo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    private String descripcion;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime proximoMantenimiento;

    private boolean completado;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaRegistro;

    // Propiedades calculadas (opcionales)
    private String estadoMantenimiento;
    private Boolean esUrgente;
    private Double costoConImpuesto;

    // Constructor por defecto
    public Mantenimiento() {
        this.fechaRegistro = LocalDateTime.now();
        this.completado = false;
    }

    // Constructor con parámetros
    public Mantenimiento(String placaCarro, LocalDateTime fechaMantenimiento, int kilometraje,
                        String tipoMantenimiento, double costo, String descripcion,
                        LocalDateTime proximoMantenimiento) {
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

    // Método para calcular si es urgente
    public boolean calcularEsUrgente() {
        if (proximoMantenimiento == null || completado) {
            return false;
        }
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limiteUrgente = ahora.plusDays(15);
        return proximoMantenimiento.isBefore(limiteUrgente);
    }

    // Método para calcular estado
    public String calcularEstadoMantenimiento() {
        if (completado) {
            return "COMPLETADO";
        }
        if (calcularEsUrgente()) {
            return "URGENTE";
        }
        if (proximoMantenimiento != null && proximoMantenimiento.isBefore(LocalDateTime.now())) {
            return "VENCIDO";
        }
        return "PENDIENTE";
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

    public String getEstadoMantenimiento() {
        if (estadoMantenimiento == null) {
            estadoMantenimiento = calcularEstadoMantenimiento();
        }
        return estadoMantenimiento;
    }

    public void setEstadoMantenimiento(String estadoMantenimiento) {
        this.estadoMantenimiento = estadoMantenimiento;
    }

    public Boolean getEsUrgente() {
        if (esUrgente == null) {
            esUrgente = calcularEsUrgente();
        }
        return esUrgente;
    }

    public void setEsUrgente(Boolean esUrgente) {
        this.esUrgente = esUrgente;
    }

    public Double getCostoConImpuesto() {
        if (costoConImpuesto == null) {
            costoConImpuesto = costo * 1.19; // IVA 19%
        }
        return costoConImpuesto;
    }

    public void setCostoConImpuesto(Double costoConImpuesto) {
        this.costoConImpuesto = costoConImpuesto;
    }

    // equals y hashCode
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

    // toString
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
