import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { createPlaza } from "./../plaza.service.js";

import { getPuestos } from "./../../puestos/puesto.service.js";
import { getOrganigrama } from "./../../departamento/services/departamento.service.js";

//agregar departamentoid a los props o propon otra cosa mejor
export const AddPlazaModal = ({
  isOpen,
  onClose,
  onSuccess,
  departamentoid,
}) => {
  const [noplaza, setNoPlaza] = useState("");
  const [puestoid, setPuestoId] = useState("");
  const [plazapadreid, setPlazaPadreId] = useState("");

  console.log(noplaza, puestoid, departamentoid);

  // Estados para el manejo de la UI y los datos
  const [puestosList, setPuestosList] = useState([]);
  const [plazasList, setPlazasList] = useState([]); // Nuevo estado para las plazas
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false); // Cargador unificado
  const [error, setError] = useState(null);

  // Efecto para cargar los puestos cuando se abre el modal
  useEffect(() => {
    if (isOpen && departamentoid) {
      const fetchData = async () => {
        try {
          setIsFetchingData(true);

          // Ejecutamos ambas peticiones al mismo tiempo para mayor velocidad
          const [puestosRes, plazasRes] = await Promise.all([
            getPuestos(),
            getOrganigrama(departamentoid), // Llama a tu endpoint que trae las plazas del depa
          ]);

          // Filtramos solo los puestos activos
          const puestosActivos = (puestosRes.data || puestosRes).filter(
            (p) => p.activo,
          );
          setPuestosList(puestosActivos);

          // Guardamos las plazas para el dropdown de jerarquía
          setPlazasList(plazasRes.data || plazasRes);
        } catch (err) {
          setError("Error al cargar los datos necesarios.");
        } finally {
          setIsFetchingData(false);
        }
      };

      fetchData();
    } else {
      // Limpiamos los estados al cerrar el modal
      setNoPlaza("");
      setPuestoId("");
      setPlazaPadreId("");
      setError(null);
    }
  }, [isOpen, departamentoid]);

  if (!isOpen) return null;

  console.log("la dta", plazasList);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const padreIdToSend = plazapadreid === "" ? null : plazapadreid;

      await createPlaza(noplaza, puestoid, departamentoid, padreIdToSend);

      setNoPlaza("");
      setPuestoId("");
      onSuccess(); // Recarga la lista en el componente padre
      onClose(); // Cierra el modal
    } catch (err) {
      setError(err.message || "Error al crear la plaza");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Nueva Plaza</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campo: Número de Plaza */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Número / Clave de Plaza
            </label>
            <input
              type="text"
              value={noplaza}
              onChange={(e) => setNoPlaza(e.target.value)}
              placeholder="Ej. PLZ-001"
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase"
              required
              autoFocus
            />
          </div>

          {/* Campo: Selector de Puesto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Puesto Asociado
            </label>
            <select
              value={puestoid}
              onChange={(e) => setPuestoId(e.target.value)}
              required
              disabled={isFetchingData}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white disabled:bg-gray-100"
            >
              <option value="" disabled>
                {isFetchingData
                  ? "Cargando puestos..."
                  : "-- Selecciona un puesto --"}
              </option>

              {puestosList.map((puesto) => (
                <option key={puesto.puestoid} value={puesto.puestoid}>
                  {puesto.nombrepuesto}
                </option>
              ))}
            </select>
          </div>

          {/* NUEVO CAMPO: Selector de Plaza Padre (Jerarquía) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reporta a (Plaza Superior)
            </label>
            <select
              value={plazapadreid}
              onChange={(e) => setPlazaPadreId(e.target.value)}
              disabled={isFetchingData || plazasList.length === 0}
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white disabled:bg-gray-100"
            >
              <option value="">
                {isFetchingData
                  ? "Cargando plazas..."
                  : plazasList.length === 0
                    ? "Cabeza de departamento (Sin superior)"
                    : "-- Selecciona (Dejar vacío si es cabeza) --"}
              </option>

              {plazasList.map((plaza) => (
                <option key={plaza.plazaid} value={plaza.plazaid}>
                  {plaza.nombrepuesto} ({plaza.noplaza})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !puestoid} // Deshabilitado si no ha seleccionado un puesto
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "Dar de alta Plaza"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
