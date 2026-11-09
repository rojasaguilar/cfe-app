// src/components/PlazaNode.jsx
import { useState } from "react";
import { User, UserX } from "lucide-react";
import { EditPlazaModal } from "./EditPlazaModal"; // Importamos el modal

export const PlazaNode = ({ plaza, departamentoid, onSuccess }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isVacant = !plaza.empleadoId && !plaza.empleadoid;
  const noPlaza = plaza.noPlaza || plaza.noplaza;
  const nombrePuesto = plaza.nombrePuesto || plaza.nombrepuesto;
  const empleadoNombres = plaza.empleado_nombres || "";
  const rpe = plaza.rpe;

  return (
    <div className="flex flex-col items-center">
      {/* 1. LA TARJETA DE LA PLAZA */}
      <div className="flex flex-col items-center relative z-10">
        <div className="w-px h-6 bg-gray-400"></div>

        <div
          // Agregamos cursor-pointer y onClick
          onClick={() => setIsEditModalOpen(true)}
          className={`w-64 p-4 rounded-xl border-2 shadow-sm bg-white transition-all hover:shadow-lg hover:border-blue-400 cursor-pointer hover:-translate-y-1
          ${isVacant ? "border-dashed border-gray-300" : "border-solid border-blue-200"}`}
        >
          {/* Cabecera: Puesto y No. Plaza */}
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

          {/* Cuerpo: Empleado o Vacante */}
          <div className="flex flex-col items-center justify-center min-h-[60px] pointer-events-none">
            {isVacant ? (
              <div className="flex flex-col items-center text-gray-400">
                <UserX size={24} className="mb-1 opacity-50" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">Vacante</span>
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
      </div>

      {/* 2. MODAL DE EDICIÓN PARA ESTA PLAZA */}
      <EditPlazaModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        plazaToEdit={plaza}
        departamentoid={departamentoid}
        onSuccess={onSuccess}
      />

      {/* 3. RENDERIZADO RECURSIVO DE LOS HIJOS */}
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
                // MUY IMPORTANTE: Pasar los props hacia abajo en la recursión
                departamentoid={departamentoid}
                onSuccess={onSuccess}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};