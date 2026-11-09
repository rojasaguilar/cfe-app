import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { IconButton, Tooltip } from "@mui/material";

// Importa tu modal (ajusta la ruta según tu estructura)
import { ConfirmActionModal } from "./../../departamento/components/ConfirmActionModal";
// Importa tus servicios (ajusta la ruta según tu estructura)
import { deactivatePuesto, updatePuesto } from "./../puesto.service.js";
import { Check } from "lucide-react";

export const PuestosList = ({ puestos = [], onSuccess }) => {
  // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!puestos.length)
    return <p className="text-gray-500 text-center p-8">No hay puestos.</p>;

  // Función para abrir el modal con el puesto seleccionado
  const handleToggleClick = (puesto) => {
    console.log("selected", puesto);
    setSelectedPuesto(puesto);
    setIsModalOpen(true);
  };

  // Función que se ejecuta al escribir "confirmar" y darle al botón en el modal
  const handleConfirm = async () => {
    if (!selectedPuesto) return;

    try {
      setIsUpdating(true);

      if (selectedPuesto.activo) {
        await deactivatePuesto(selectedPuesto.puestoid);
      } else {
        await updatePuesto(selectedPuesto.puestoid, { activo: true });
      }

      setIsModalOpen(false);
      setSelectedPuesto(null);

      // Llamamos a onSuccess para que PuestosPage vuelva a hacer fetch de los datos
      if (onSuccess) onSuccess();
    } catch (error) {
      // Si la API devuelve un error (ej. 409 porque está en uso por una plaza)
      // Lo ideal es mostrarlo en una alerta.
      alert(error.message || "Error al cambiar el estado del puesto.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {puestos.map((puesto) => (
          <div
            key={puesto.puestoid}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 uppercase">
                {puesto.nombrepuesto}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">
                ID Interno: {puesto.puestoid.split("-")[0]}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${
                  puesto.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {puesto.activo ? "Activo" : "Inactivo"}
              </span>

              <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={puesto.activo ? "Desactivar" : "Activar"}>
                  {/* Agregamos el onClick aquí */}
                  <IconButton
                    onClick={() => handleToggleClick(puesto)}
                    size="small"
                    className={
                      puesto.activo ? "text-red-600" : "text-green-600"
                    }
                  >
                    {puesto.activo ? <Trash2 size={18} /> : <Check size={18} />}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Renderizamos el modal pasándole los datos del puesto seleccionado */}
      <ConfirmActionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPuesto(null);
        }}
        onConfirm={handleConfirm}
        // Usamos el nombre del puesto seleccionado
        departmentName={selectedPuesto?.nombrepuesto || ""}
        isActivating={selectedPuesto ? !selectedPuesto.activo : false}
        isLoading={isUpdating}
        entity={"Puesto"}
      />
    </>
  );
};
