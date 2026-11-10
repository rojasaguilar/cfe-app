// src/components/PlazaNode.jsx
import { useState, useRef, useEffect } from "react";

import {
  User,
  UserX,
  Edit2,
  PowerOff,
  Power,
  UserRoundPlus,
  X,
} from "lucide-react";

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";

import { EditPlazaModal } from "./EditPlazaModal";

import { ConfirmActionModal } from "./../../departamento/components/ConfirmActionModal";

import { EmpleadosList } from "./../../empleados/components/EmpleadosList.jsx";

import { updatePlaza, deactivatePlaza } from "./../plaza.service.js";

import { assignEmpleado } from "../../empleados/services/empleado.service.js";

export const PlazaNode = ({
  plaza,
  departamentoid,
  onSuccess,
  onAssignEmpleado,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // NUEVO: Modal de selección de empleados
  const [isEmpleadosModalOpen, setIsEmpleadosModalOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  const menuRef = useRef(null);

  const isVacant = !plaza.empleadoId && !plaza.empleadoid;

  // Evaluación del estado activo
  const rawActivo = plaza.activo ?? plaza.ACTIVO;

  const isActive =
    rawActivo === true || rawActivo === 1 || rawActivo === "true";

  const noPlaza = plaza.noPlaza || plaza.noplaza;
  const nombrePuesto = plaza.nombrePuesto || plaza.nombrepuesto;
  const empleadoNombres = plaza.empleado_nombres || "";

  const rpe = plaza.rpe;

  const plazaId = plaza.plazaId || plaza.plazaid;

  // Cerrar menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Activar / desactivar plaza
  const handleConfirmToggleStatus = async () => {
    if (!plazaId) {
      alert("Error crítico: El ID de la plaza no está definido.");
      return;
    }

    try {
      setIsUpdating(true);

      if (isActive) {
        await deactivatePlaza(plazaId);
      } else {
        await updatePlaza(plazaId, { activo: true });
      }

      setIsConfirmModalOpen(false);

      if (onSuccess) onSuccess();
    } catch (error) {
      alert(error.message || "Error al cambiar el estado de la plaza.");
    } finally {
      setIsUpdating(false);
    }
  };

  // NUEVO: Abrir modal de empleados
  const handleOpenEmpleadosModal = () => {
    setIsMenuOpen(false);
    setIsEmpleadosModalOpen(true);
  };

  // NUEVO: Asignar empleado a la plaza
  const handleAssignEmpleado = async (empleado) => {
    if (!plazaId) {
      throw new Error("No se pudo identificar la plaza.");
    }

    console.log(empleado.empleadoid);

    // if (!onAssignEmpleado) {
    //   throw new Error("No se configuró el servicio de asignación.");
    // }

    const empleadoId =
      empleado.empleadoId ??
      empleado.empleadoid ??
      empleado.empleado_id ??
      empleado.id;

    if (!empleadoId) {
      throw new Error("No se pudo identificar al empleado.");
    }

    try {
      await assignEmpleado(empleadoId, plazaId);

      if (onSuccess) onSuccess();
    } catch (error) {
      alert(error.message || "Error al cambiar el estado de la plaza.");
    } finally {
      setIsUpdating(false);
    }
  };

  // NUEVO: Ejecutar cuando la asignación finalizó correctamente
  const handleAssignSuccess = () => {
    setIsEmpleadosModalOpen(false);

    if (onSuccess) onSuccess();
  };

  return (
    <div className="flex flex-col items-center">
      {/* 1. TARJETA DE LA PLAZA */}
      <div
        className={`flex flex-col items-center relative ${
          isMenuOpen ? "z-[100]" : "z-10"
        }`}
        ref={menuRef}
      >
        <div className="w-px h-6 bg-gray-400"></div>

        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-64 p-4 rounded-xl border-2 shadow-sm bg-white transition-all hover:shadow-lg hover:border-blue-400 cursor-pointer hover:-translate-y-1 relative
          ${
            !isActive
              ? "opacity-60 border-gray-300 bg-gray-50"
              : isVacant
                ? "border-dashed border-gray-300"
                : "border-solid border-blue-200"
          }`}
        >
          {/* Estado */}
          <div className="absolute top-2 right-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full shadow-sm ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
              title={isActive ? "Activa" : "Inactiva"}
            />
          </div>

          {/* Puesto */}
          <div className="border-b border-gray-100 pb-2 mb-3 pointer-events-none">
            <h4 className="text-[13px] font-bold text-gray-800 uppercase text-center leading-tight">
              {nombrePuesto}
            </h4>

            <div className="flex justify-center mt-1.5">
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {noPlaza}
              </span>
            </div>
          </div>

          {/* Empleado o vacante */}
          <div className="flex flex-col items-center justify-center min-h-[60px] pointer-events-none">
            {isVacant ? (
              <div className="flex flex-col items-center text-gray-400">
                <UserX size={24} className="mb-1 opacity-50" />

                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Vacante
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-1.5 rounded-full text-blue-600 mb-1">
                  <User size={20} />
                </div>

                <span className="text-sm font-medium text-gray-700 capitalize leading-tight">
                  {empleadoNombres.toLowerCase()}
                </span>

                <span className="text-[11px] text-blue-600 font-mono mt-1 font-semibold">
                  RPE: {rpe}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. MENÚ FLOTANTE */}
        {isMenuOpen && (
          <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-[110] py-1.5 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col">
            {/* Editar */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
            >
              <Edit2 size={16} />
              <span>Editar Plaza</span>
            </button>

            {/* Activar / desactivar */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsConfirmModalOpen(true);
              }}
              className={`flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors text-left ${
                isActive
                  ? "text-red-600 hover:bg-red-50"
                  : "text-green-600 hover:bg-green-50"
              }`}
            >
              {isActive ? <PowerOff size={16} /> : <Power size={16} />}

              <span>{isActive ? "Desactivar Plaza" : "Activar Plaza"}</span>
            </button>

            {/* NUEVO: Asignar empleado */}
            {isVacant && isActive && (
              <button
                onClick={handleOpenEmpleadosModal}
                className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium transition-colors text-left text-blue-600 hover:bg-blue-50"
              >
                <UserRoundPlus size={16} />

                <span>Asignar Empleado</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. MODAL DE EDICIÓN */}
      <EditPlazaModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        plazaToEdit={plaza}
        departamentoid={departamentoid}
        onSuccess={onSuccess}
      />

      {/* 4. MODAL DE CONFIRMACIÓN */}
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmToggleStatus}
        departmentName={`${nombrePuesto} (${noPlaza})`}
        isActivating={!isActive}
        isLoading={isUpdating}
        entity={"Plaza"}
      />

      {/* 5. NUEVO MODAL DE SELECCIÓN DE EMPLEADOS */}
      <Dialog
        open={isEmpleadosModalOpen}
        onClose={() => setIsEmpleadosModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minHeight: "400px",
          },
        }}
      >
        {/* Header */}
        <DialogTitle className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Asignar empleado a plaza
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Plaza: {noPlaza} — {nombrePuesto}
            </p>
          </div>

          <IconButton
            onClick={() => setIsEmpleadosModalOpen(false)}
            size="small"
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>

        {/* Lista de empleados */}
        <DialogContent className="!p-6">
          <EmpleadosList
            onAssign={handleAssignEmpleado}
            onSuccess={handleAssignSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* 6. RENDERIZADO RECURSIVO DE LOS HIJOS */}
      {plaza.children && plaza.children.length > 0 && (
        <div className="relative flex flex-col items-center">
          <div className="w-px h-8 bg-gray-400"></div>

          {plaza.children.length > 1 && (
            <div
              className="absolute top-8 left-0 right-0 h-px bg-gray-400"
              style={{
                width: `calc(100% - ${100 / plaza.children.length}%)`,
                margin: "0 auto",
              }}
            ></div>
          )}

          <div className="flex gap-6 justify-center">
            {plaza.children.map((child) => (
              <PlazaNode
                key={child.plazaId || child.plazaid}
                plaza={child}
                departamentoid={departamentoid}
                onSuccess={onSuccess}
                onAssignEmpleado={onAssignEmpleado}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
