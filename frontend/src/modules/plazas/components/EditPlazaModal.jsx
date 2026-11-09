// src/components/EditPlazaModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { updatePlaza } from "./../plaza.service.js";
import { getPuestos } from "./../../puestos/puesto.service.js";
import { getOrganigrama } from "./../../departamento/services/departamento.service.js";

export const EditPlazaModal = ({
  isOpen,
  onClose,
  onSuccess,
  departamentoid,
  plazaToEdit,
}) => {
  const [noplaza, setNoPlaza] = useState("");
  const [puestoid, setPuestoId] = useState("");
  const [plazapadreid, setPlazaPadreId] = useState("");

  const [puestosList, setPuestosList] = useState([]);
  const [plazasList, setPlazasList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [error, setError] = useState(null);

  // Inicializar los campos con la data actual de la plaza
  useEffect(() => {
    if (isOpen && plazaToEdit) {
      setNoPlaza(plazaToEdit.noPlaza || plazaToEdit.noplaza || "");
      setPuestoId(plazaToEdit.puestoId || plazaToEdit.puestoid || "");

      const padreId = plazaToEdit.plazaPadreId || plazaToEdit.plazapadreid;
      setPlazaPadreId(padreId || "");
    }
  }, [isOpen, plazaToEdit]);

  useEffect(() => {
    if (isOpen && departamentoid) {
      const fetchData = async () => {
        try {
          setIsFetchingData(true);
          const [puestosRes, plazasRes] = await Promise.all([
            getPuestos(),
            getOrganigrama(departamentoid),
          ]);

          const puestosActivos = (puestosRes.data || puestosRes).filter(
            (p) => p.activo,
          );
          setPuestosList(puestosActivos);

          const todasLasPlazas = plazasRes.data || plazasRes;
          // IMPORTANTÍSIMO: Filtrar la plaza actual para que no pueda ser su propio padre
          const plazasValidas = todasLasPlazas.filter(
            (p) =>
              (p.plazaId || p.plazaid) !==
              (plazaToEdit.plazaId || plazaToEdit.plazaid),
          );
          setPlazasList(plazasValidas);
        } catch (err) {
          setError("Error al cargar los datos.");
        } finally {
          setIsFetchingData(false);
        }
      };

      fetchData();
    } else {
      setError(null);
    }
  }, [isOpen, departamentoid, plazaToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const padreIdToSend = plazapadreid === "" ? null : plazapadreid;
      const plazaId = plazaToEdit.plazaId || plazaToEdit.plazaid;

      // Usamos tu servicio dinámico enviando el objeto
      await updatePlaza(plazaId, {
        noplaza,
        puestoid,
        plazapadreid: padreIdToSend,
        // plaza
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Error al actualizar la plaza");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Editar Plaza</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Número / Clave
            </label>
            <input
              type="text"
              value={noplaza}
              onChange={(e) => setNoPlaza(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 uppercase"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Puesto Asociado
            </label>
            <select
              value={puestoid}
              onChange={(e) => setPuestoId(e.target.value)}
              required
              disabled={isFetchingData}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="" disabled>
                {isFetchingData ? "Cargando..." : "-- Selecciona --"}
              </option>
              {puestosList.map((p) => (
                <option key={p.puestoid} value={p.puestoid}>
                  {p.nombrepuesto}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reporta a
            </label>
            <select
              value={plazapadreid}
              onChange={(e) => setPlazaPadreId(e.target.value)}
              disabled={isFetchingData}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {isFetchingData
                  ? "Cargando..."
                  : "Cabeza de departamento (Sin superior)"}
              </option>
              {plazasList.map((p) => (
                <option key={p.plazaid} value={p.plazaid}>
                  {p.nombrepuesto} ({p.noplaza})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isLoading || !puestoid}
            >
              {isLoading ? "Guardando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
