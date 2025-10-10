using System;
using System.Collections.Generic;
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
                var response = await _httpClient.GetAsync($"{BASE_URL}?placa={placa}");
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
                var query = string.Join("&", criterios.Select(kv => $"{kv.Key}={kv.Value}"));
                var response = await _httpClient.GetAsync($"{BASE_URL}?{query}");
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
