using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using EmpresarialesClienteCSharp.Models;

namespace EmpresarialesClienteCSharp.Services
{
    public class CarroService
    {
        private readonly HttpClient _httpClient;
        private const string BASE_URL = "http://localhost:8080/api/carro";

        public CarroService()
        {
            _httpClient = new HttpClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(30);

            // Configurar autenticación Basic Auth para Spring Security
            var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes("admin:admin"));
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", credentials);

            // Configurar headers adicionales
            _httpClient.DefaultRequestHeaders.Accept.Add(
                new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        }

        // Listar todos los carros
        public async Task<List<Carro>> ObtenerTodosLosCarrosAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync(BASE_URL);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<Carro>>(content) ?? new List<Carro>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al obtener los carros: {ex.Message}", ex);
            }
        }

        // Buscar carro por placa
        public async Task<Carro?> BuscarPorPlacaAsync(string placa)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BASE_URL}?placa={Uri.EscapeDataString(placa)}");
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                var carros = JsonConvert.DeserializeObject<List<Carro>>(content);
                return carros?.Count > 0 ? carros[0] : null;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al buscar el carro: {ex.Message}", ex);
            }
        }

        // Buscar carros por criterios
        public async Task<List<Carro>> BuscarPorCriteriosAsync(Dictionary<string, string> criterios)
        {
            try
            {
                if (criterios == null || criterios.Count == 0)
                {
                    return await ObtenerTodosLosCarrosAsync();
                }

                var mappedParams = new Dictionary<string, string>();

                foreach (var kvp in criterios)
                {
                    if (string.IsNullOrWhiteSpace(kvp.Value))
                    {
                        continue;
                    }

                    var value = kvp.Value.Trim();

                    switch (kvp.Key)
                    {
                        case "tieneAireAcondicionado":
                            mappedParams["aire_acondicionado"] = value;
                            break;
                        case "numeroPuertas":
                            mappedParams["numero_puertas"] = value;
                            break;
                        case "tipoTransmision":
                            mappedParams["transmision"] = value;
                            break;
                        case "precioMin":
                            mappedParams["precio_min"] = value;
                            break;
                        case "precioMax":
                            mappedParams["precio_max"] = value;
                            break;
                        case "fechaDesde":
                            mappedParams["fechadesde"] = value;
                            break;
                        case "fechaHasta":
                            mappedParams["fechahasta"] = value;
                            break;
                        default:
                            mappedParams[kvp.Key] = value;
                            break;
                    }
                }

                if (mappedParams.Count == 0)
                {
                    return await ObtenerTodosLosCarrosAsync();
                }

                var query = string.Join("&", mappedParams.Select(kv => $"{kv.Key}={Uri.EscapeDataString(kv.Value)}"));
                var url = string.IsNullOrEmpty(query) ? BASE_URL : $"{BASE_URL}?{query}";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<Carro>>(content) ?? new List<Carro>();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al buscar carros: {ex.Message}", ex);
            }
        }

        // Crear nuevo carro
        public async Task<Carro> CrearCarroAsync(Carro carro)
        {
            try
            {
                var json = JsonConvert.SerializeObject(carro);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(BASE_URL, content);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Carro>(responseContent) ?? throw new Exception("No se pudo crear el carro");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear el carro: {ex.Message}", ex);
            }
        }

        // Actualizar carro existente
        public async Task<Carro> ActualizarCarroAsync(string placa, Carro carro)
        {
            try
            {
                var json = JsonConvert.SerializeObject(carro);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _httpClient.PutAsync($"{BASE_URL}/{placa}", content);
                response.EnsureSuccessStatusCode();
                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Carro>(responseContent) ?? throw new Exception("No se pudo actualizar el carro");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el carro: {ex.Message}", ex);
            }
        }

        // Eliminar carro
        public async Task<bool> EliminarCarroAsync(string placa)
        {
            try
            {
                var response = await _httpClient.DeleteAsync($"{BASE_URL}/{placa}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al eliminar el carro: {ex.Message}", ex);
            }
        }
    }
}
