using System;
using Newtonsoft.Json;

namespace EmpresarialesClienteCSharp.Models
{
    public class Carro
    {
        [JsonProperty("marca")]
        public string Marca { get; set; } = string.Empty;

        [JsonProperty("color")]
        public string Color { get; set; } = string.Empty;

        [JsonProperty("placa")]
        public string Placa { get; set; } = string.Empty;

        [JsonProperty("combustible")]
        public string Combustible { get; set; } = string.Empty;

        [JsonProperty("modelo")]
        public string Modelo { get; set; } = string.Empty;

        [JsonProperty("anio")]
        public int Anio { get; set; }

        [JsonProperty("estado")]
        public string Estado { get; set; } = string.Empty;

        [JsonProperty("numeroPuertas")]
        public int NumeroPuertas { get; set; }

        [JsonProperty("tieneAireAcondicionado")]
        public bool TieneAireAcondicionado { get; set; }

        [JsonProperty("precio")]
        public double Precio { get; set; }

        [JsonProperty("tipoTransmision")]
        public string TipoTransmision { get; set; } = string.Empty;

        [JsonProperty("fechaRegistro")]
        public DateTime? FechaRegistro { get; set; }

        public override string ToString()
        {
            return $"{Marca} {Modelo} - {Placa}";
        }
    }
}
