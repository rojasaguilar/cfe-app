import { useState, useEffect } from "react";
import { Edit2, PowerOff, Power, Check, X } from "lucide-react";
import { ConfirmActionModal } from "./ConfirmActionModal";
import {
  deactivateDepartamento,
  activateDepartamento,
  updateDepartamento,
  getOrganigrama,
} from "./../services/departamento.service.js";

import { PlazaNode } from "./../../plazas/components/PlazaNode";
import { buildPlazaTree } from "./../../plazas/utils/treeBuilder.js";

export const DepartmentTree = ({
  department,
  onNext,
  onPrev,
  onStatusChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  // Nuevo estado para las plazas del departamento actual
  const [plazas, setPlazas] = useState([]);
  const [plazasTree, setPlazasTree] = useState([]);
  const [isLoadingPlazas, setIsLoadingPlazas] = useState(false);

  const fetchPlazas = async () => {
    if (!department?.departamentoid) return;

    try {
      setIsLoadingPlazas(true);
      // Traemos la data plana de la base de datos
      const response = await getOrganigrama(department.departamentoid);
      const dataPlana = response.data || response;

      // Pasamos la data por nuestra función constructora
      console.log(dataPlana);
      const arbol = buildPlazaTree(dataPlana);

      // Guardamos el árbol procesado en el estado
      setPlazasTree(arbol);
    } catch (error) {
      console.error("Error al cargar plazas", error);
    } finally {
      setIsLoadingPlazas(false);
    }
  };

  useEffect(() => {
    setIsEditing(false);
    setEditName("");

    // Cargar las plazas al cambiar de departamento

    fetchPlazas();
  }, [department]);
  console.log(plazas);

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

  const handleEditClick = () => {
    setEditName(department.nombre);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    // Evitar peticiones innecesarias si el nombre es el mismo o está vacío
    if (
      !editName.trim() ||
      editName.trim().toLowerCase() === department.nombre.toLowerCase()
    ) {
      setIsEditing(false);
      return;
    }

    try {
      setIsUpdating(true);
      await updateDepartamento(department.departamentoid, {
        nombre: editName.trim(),
      });

      setIsEditing(false);
      if (onStatusChange) onStatusChange(); // Recargamos para ver el nuevo nombre
    } catch (error) {
      alert(error.message || "Error al actualizar el departamento");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!department) return null;

  return (
    <>
      <div
        className="flex flex-col h-[calc(100vh-180px)] bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        onWheel={handleWheel}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          {/* SECCIÓN DEL NOMBRE / INPUT */}
          <div className="flex-1 mr-4">
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

            {/* Renderizado condicional: Input vs H2 */}
            {isEditing ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-2xl font-bold text-gray-800 uppercase bg-white border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
                  autoFocus
                  disabled={isUpdating}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") setIsEditing(false);
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editName.trim()}
                  className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                  title="Guardar"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                  className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                  title="Cancelar"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 capitalize mt-1 truncate">
                {department.nombre}
              </h2>
            )}
          </div>

          {/* SECCIÓN DE BOTONES DE ACCIÓN (Se ocultan si estamos editando) */}
          {!isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
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
          )}
        </div>

        {/* ZONA DEL ORGANIGRAMA (Sustituye la imagen anterior) */}
        {/* === ZONA DEL ORGANIGRAMA === */}
        <div className="flex-1 overflow-auto p-8 relative">
          {isLoadingPlazas ? (
            <div className="h-full flex items-center justify-center text-gray-500 gap-3">
              <div className="w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              Generando organigrama...
            </div>
          ) : (
            <div className="min-w-max flex flex-col items-center pt-4 pb-16 relative z-10">
              {/* LÍNEAS Y NODOS HIJOS (Las Plazas) */}
              {plazasTree.length > 0 ? (
                <div className="flex gap-12 mt-0">
                  {/* Mapeamos los nodos raíces (usualmente es 1, pero mapeamos por si acaso) */}
                  {plazasTree.map((plazaRaiz) => (
                    <PlazaNode
                      key={plazaRaiz.plazaId || plazaRaiz.plazaid}
                      plaza={plazaRaiz}
                      departamentoid={department.departamentoid}
                      onSuccess={fetchPlazas}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-12 p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium bg-white">
                  No hay plazas registradas en este departamento
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        departmentName={department.nombre}
        isActivating={!department.activo}
        isLoading={isUpdating}
        entity={"Departamento"}
      />
    </>
  );
};
