import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listMantenimientos } from '../services/mantenimientoApi';
import type { Mantenimiento } from '../types/Mantenimiento';

export default function SeleccionarMantenimientoActualizar() {
  const navigate = useNavigate();
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroPlaca, setFiltroPlaca] = useState('');

  useEffect(() => {
    cargarMantenimientos();
  }, []);

  const cargarMantenimientos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await listMantenimientos();
      setMantenimientos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '❌ Error al cargar los mantenimientos. Por favor, verifique su conexión e intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string): string => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha.replace(' ', 'T'));
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const mantenimientosFiltrados = mantenimientos.filter(m =>
    filtroPlaca === '' || m.placaCarro.toLowerCase().includes(filtroPlaca.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/mantenimientos')}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Actualizar Mantenimiento</h1>
        <p className="text-gray-600 mb-6">Seleccione el mantenimiento que desea actualizar</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Filtro */}
        <div className="mb-6">
          <label htmlFor="filtroPlaca" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Placa
          </label>
          <input
            type="text"
            id="filtroPlaca"
            value={filtroPlaca}
            onChange={(e) => setFiltroPlaca(e.target.value.toUpperCase())}
            placeholder="ABC-123"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs uppercase"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando mantenimientos...</p>
          </div>
        ) : mantenimientosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg">No hay mantenimientos disponibles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Placa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Kilometraje
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Costo
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mantenimientosFiltrados.map((mantenimiento) => (
                  <tr 
                    key={mantenimiento.id} 
                    className="hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/mantenimientos/actualizar/${mantenimiento.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {mantenimiento.id.substring(0, 8)}...
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {mantenimiento.placaCarro}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {mantenimiento.tipoMantenimiento.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatearFecha(mantenimiento.fechaMantenimiento)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {mantenimiento.kilometraje.toLocaleString()} km
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 text-right">
                      {formatearPrecio(mantenimiento.costo)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        mantenimiento.completado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {mantenimiento.completado ? 'COMPLETO' : 'PENDIENTE'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/mantenimientos/actualizar/${mantenimiento.id}`);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                      >
                        Actualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-sm text-gray-600">
              Mostrando {mantenimientosFiltrados.length} mantenimiento(s)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
