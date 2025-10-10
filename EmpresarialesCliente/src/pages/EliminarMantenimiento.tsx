import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMantenimientoById, deleteMantenimiento } from '../services/mantenimientoApi';
import type { Mantenimiento } from '../types/Mantenimiento';

export default function EliminarMantenimiento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idFromUrl = searchParams.get('id');

  const [id, setId] = useState(idFromUrl || '');
  const [mantenimiento, setMantenimiento] = useState<Mantenimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarMantenimiento = async (searchId?: string) => {
    const idToSearch = searchId || id.trim();

    if (!idToSearch) {
      setError('Por favor ingrese un ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await getMantenimientoById(idToSearch);
      if (data) {
        setMantenimiento(data);
      } else {
        setError('No se encontró un mantenimiento con ese ID');
        setMantenimiento(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar el mantenimiento');
      setMantenimiento(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idFromUrl) {
      setId(idFromUrl);
      buscarMantenimiento(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromUrl]);

  const handleEliminar = async () => {
    if (!mantenimiento) return;

    const confirmar = window.confirm(
      `¿Está seguro que desea eliminar este mantenimiento?\n\n` +
      `Placa: ${mantenimiento.placaCarro}\n` +
      `Tipo: ${mantenimiento.tipoMantenimiento}\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmar) return;

    try {
      setLoading(true);
      setError('');
      await deleteMantenimiento(mantenimiento.id);
      alert('Mantenimiento eliminado exitosamente');
      setMantenimiento(null);
      setId('');
      navigate('/mantenimientos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el mantenimiento');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string): string => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha.replace(' ', 'T'));
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => navigate('/mantenimientos')}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Volver a la lista
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Eliminar Mantenimiento</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Búsqueda */}
        <div className="mb-6">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
            ID del Mantenimiento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Ingrese el ID del mantenimiento"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && buscarMantenimiento()}
            />
            <button
              onClick={() => buscarMantenimiento()}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Información del mantenimiento */}
        {mantenimiento && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Información del Mantenimiento</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-semibold">
                ⚠️ Advertencia: Esta acción eliminará permanentemente este mantenimiento
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">ID:</span>
                <span className="text-gray-700">{mantenimiento.id}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Placa Carro:</span>
                <span className="text-gray-700">{mantenimiento.placaCarro}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Fecha:</span>
                <span className="text-gray-700">{formatearFecha(mantenimiento.fechaMantenimiento)}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Tipo:</span>
                <span className="text-gray-700">{mantenimiento.tipoMantenimiento.replace('_', ' ')}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Kilometraje:</span>
                <span className="text-gray-700">{mantenimiento.kilometraje.toLocaleString()} km</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Costo:</span>
                <span className="text-gray-700">{formatearPrecio(mantenimiento.costo)}</span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Estado:</span>
                <span className={`font-semibold ${mantenimiento.completado ? 'text-green-600' : 'text-yellow-600'}`}>
                  {mantenimiento.completado ? 'COMPLETADO' : 'PENDIENTE'}
                </span>
              </div>
              <div className="flex border-b pb-2">
                <span className="font-semibold w-1/3">Descripción:</span>
                <span className="text-gray-700">{mantenimiento.descripcion}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleEliminar}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Eliminando...' : 'Confirmar Eliminación'}
              </button>
              <button
                onClick={() => {
                  setMantenimiento(null);
                  setId('');
                }}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
