import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  getBaterias,
  createBateria,
  updateBateria,
} from "./../baterias.service.js";
import { BateriasCapacitacionView } from "../components/BateriasCapacitacionView";
import { CreateBateriaModal } from "../components/CreateBateriaModal";

export const BateriasPage = () => {
  const [baterias, setBaterias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBaterias = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBaterias();
      const lista = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : [];

      setBaterias(lista);
    } catch (err) {
      console.error("Error al obtener baterías de capacitación:", err);
      setError("No fue posible cargar las baterías de capacitación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaterias();
  }, []);

  const handleCreateBateria = async (payload) => {
    await createBateria(payload);
    setIsModalOpen(false);
    await fetchBaterias();
  };

  const handleUpdateBateria = async (bateriaId, data) => {
    await updateBateria(bateriaId, data);
    await fetchBaterias();
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Cargando baterías de capacitación...
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Baterías de capacitación
          </h1>
          <p className="text-sm text-gray-500">
            Administración de baterías por puesto y departamento.
          </p>
        </div>

        <Button variant="contained" onClick={() => setIsModalOpen(true)}>
          Nueva batería
        </Button>
      </header>

      <BateriasCapacitacionView
        payload={{ data: baterias }}
        onUpdateBateria={handleUpdateBateria}
      />

      <CreateBateriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateBateria}
      />
    </main>
  );
};
