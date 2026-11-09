// src/components/PlazaNode.jsx
import { User, UserX } from "lucide-react";

export const PlazaNode = ({ plaza }) => {
  // Manejo de variables por posibles diferencias de camelCase/lowercase desde Postgres
  const isVacant = !plaza.empleadoId && !plaza.empleadoid;
  const noPlaza = plaza.noPlaza || plaza.noplaza;
  const nombrePuesto = plaza.nombrePuesto || plaza.nombrepuesto;
  const empleadoNombres = plaza.empleado_nombres || "";
  const rpe = plaza.rpe;

  return (
    <div className="flex flex-col items-center">
      {/* 1. LA TARJETA DE LA PLAZA */}
      <div className="flex flex-col items-center relative z-10">
        {/* Pequeña línea hacia arriba (solo visual, conecta con el padre) */}
        <div className="w-px h-6 bg-gray-400"></div>

        <div
          className={`w-64 p-4 rounded-xl border-2 shadow-sm bg-white transition-all hover:shadow-md
          ${isVacant ? "border-dashed border-gray-300" : "border-solid border-blue-200"}`}
        >
          {/* Cabecera: Puesto y No. Plaza */}
          <div className="border-b border-gray-100 pb-2 mb-3">
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
          <div className="flex flex-col items-center justify-center min-h-[60px]">
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

      {/* 2. RENDERIZADO RECURSIVO DE LOS HIJOS (SUBORDINADOS) */}
      {plaza.children && plaza.children.length > 0 && (
        <div className="relative flex flex-col items-center">
          {/* Tallo principal bajando de la tarjeta */}
          <div className="w-px h-8 bg-gray-400"></div>

          {/* Línea horizontal (solo si hay más de 1 hijo para conectarlos) */}
          {plaza.children.length > 1 && (
            <div
              className="absolute top-8 left-0 right-0 h-px bg-gray-400"
              style={{
                width: `calc(100% - ${100 / plaza.children.length}%)`,
                margin: "0 auto",
              }}
            ></div>
          )}

          {/* Contenedor de las plazas hijas (Flex horizontal) */}
          <div className="flex gap-6 justify-center">
            {plaza.children.map((child) => (
              // ¡LA MAGIA RECURSIVA OCURRE AQUÍ!
              <PlazaNode key={child.plazaId || child.plazaid} plaza={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};