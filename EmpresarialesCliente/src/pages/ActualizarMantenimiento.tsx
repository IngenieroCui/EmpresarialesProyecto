import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MantenimientoForm from '../components/MantenimientoForm';
import type { Mantenimiento, MantenimientoCreateData } from '../types/Mantenimiento';
import { getMantenimientoById, updateMantenimiento } from '../services/mantenimientoApi';

export default function ActualizarMantenimiento() {
  const navigate = useNavigate();
  const { id: idFromParams } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const idFromQuery = searchParams.get('id');
  const id = idFromParams || idFromQuery;

  const [mantenimiento, setMantenimiento] = useState<Mantenimiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('⚠️ ID de mantenimiento no proporcionado. No es posible cargar la información.');
      setLoading(false);
      return;
    }

    cargarMantenimiento();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarMantenimiento = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getMantenimientoById(id);
      if (data) {
        setMantenimiento(data);
      } else {
        setError('⚠️ No se encontró el mantenimiento solicitado. Es posible que haya sido eliminado.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '❌ Error al cargar la información del mantenimiento. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: MantenimientoCreateData) => {
    if (!id) {
      throw new Error('⚠️ ID de mantenimiento no disponible para realizar la actualización');
    }

    try {
      await updateMantenimiento(id, { ...data, id });
      alert('✅ Mantenimiento actualizado exitosamente\n\nLa información del mantenimiento ha sido actualizada correctamente en el sistema.');
      navigate('/mantenimientos');
    } catch (error) {
      throw error; // El formulario manejará el error
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Cargando mantenimiento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/mantenimientos')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Volver a la lista
        </button>
      </div>
    );
  }

  if (!mantenimiento) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Mantenimiento no encontrado</div>
        <button
          onClick={() => navigate('/mantenimientos')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/mantenimientos')}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Volver a la lista
      </button>
      <MantenimientoForm
        onSubmit={handleSubmit}
        initialData={mantenimiento}
        isEditing={true}
      />
    </div>
  );
}
