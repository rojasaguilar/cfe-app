import { useState } from "react";
import { Edit2, PowerOff, ImageIcon, Power } from "lucide-react";

import { ConfirmActionModal } from "./ConfirmActionModal";

import {
  deactivateDepartamento,
  activateDepartamento,
} from "./../services/departamento.service.js";

export const DepartmentTree = ({
  department,
  onNext,
  onPrev,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Manejador del scroll con un ligero bloqueo para no disparar 100 eventos por segundo
  let scrollTimeout = null;

  const handleWheel = (e) => {
    if (scrollTimeout) return; // Si está en cooldown, ignoramos el evento

    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
    }, 400); // 400ms de cooldown entre cada "paso" de departamento

    if (e.deltaY > 0) {
      onNext(); // Scroll abajo -> Siguiente
    } else if (e.deltaY < 0) {
      onPrev(); // Scroll arriba -> Anterior
    }
  };

  const handleConfirmAction = async () => {
    try {
      setIsUpdating(true);

      if (department.activo) {
        await deactivateDepartamento(department.departamentoid);
      } else {
        await activateDepartamento(department.departamentoid);
      }

      setIsModalOpen(false);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      alert(error.message || "Error al cambiar el estado");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!department) return null;

  return (
    <>
      <div
        className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        onWheel={handleWheel}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Departamento Actual
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wide
                  ${department.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
              >
                {department.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {department.nombre}
            </h2>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Edit2 size={16} />
              Editar
            </button>

            {department.activo ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
              >
                <PowerOff size={16} />
                Desactivar
              </button>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 hover:border-green-200 transition-colors shadow-sm"
              >
                <Power size={16} />
                Activar
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 relative">
          <div className="absolute top-4 text-xs text-gray-400">
            Usa la rueda del mouse para navegar entre departamentos
          </div>
          <div className="w-full max-w-2xl h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white shadow-sm">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="font-medium text-gray-500">
              Jerarquía de {department.nombre}
            </p>
          </div>
        </div>
      </div>

      {/* Renderizamos el modal de confirmación */}
      <ConfirmActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        departmentName={department.nombre}
        isActivating={!department.activo}
        isLoading={isUpdating}
      />
    </>
  );
};
