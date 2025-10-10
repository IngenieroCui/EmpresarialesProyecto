import { useNavigate } from 'react-router-dom';
import MantenimientoForm from '../components/MantenimientoForm';
import type { MantenimientoCreateData } from '../types/Mantenimiento';
import { createMantenimiento } from '../services/mantenimientoApi';

export default function CrearMantenimiento() {
  const navigate = useNavigate();

  const handleSubmit = async (data: MantenimientoCreateData) => {
    try {
      await createMantenimiento(data);
      alert('Mantenimiento creado exitosamente');
      navigate('/mantenimientos');
    } catch (error) {
      throw error; // El formulario manejará el error
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/mantenimientos')}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Volver a la lista
      </button>
      <MantenimientoForm onSubmit={handleSubmit} />
    </div>
  );
}
