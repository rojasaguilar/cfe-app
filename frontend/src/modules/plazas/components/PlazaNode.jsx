import { User, UserX } from "lucide-react";

// Subcomponente para renderizar la tarjeta de cada plaza
export const PlazaNode = ({ plaza }) => {
  const isVacant = !plaza.empleadoId;

  return (
    <div className="flex flex-col items-center relative">
      {/* Línea vertical conectora hacia arriba */}
      <div className="w-px h-6 bg-gray-300"></div>
      
      {/* Tarjeta de la Plaza */}
      <div className={`w-64 p-4 rounded-xl border-2 shadow-sm relative z-10 bg-white transition-all hover:shadow-md
        ${isVacant ? "border-dashed border-gray-300" : "border-solid border-blue-200"}`}
      >
        {/* Cabecera: Puesto y No. Plaza */}
        <div className="border-b border-gray-100 pb-2 mb-3">
          <h4 className="text-sm font-bold text-gray-800 uppercase text-center leading-tight">
            {plaza.nombrePuesto}
          </h4>
          <div className="flex justify-center mt-1">
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono font-bold">
              {plaza.noPlaza}
            </span>
          </div>
        </div>

        {/* Cuerpo: Empleado o Vacante */}
        <div className="flex flex-col items-center justify-center min-h-[60px]">
          {isVacant ? (
            <div className="flex flex-col items-center text-gray-400">
              <UserX size={24} className="mb-1 opacity-50" />
              <span className="text-xs font-semibold uppercase tracking-wider">Vacante</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-50 p-1.5 rounded-full text-blue-600 mb-1">
                <User size={20} />
              </div>
              <span className="text-sm font-medium text-gray-700 capitalize leading-tight">
                {plaza.empleado_nombres.toLowerCase()}
              </span>
              <span className="text-xs text-blue-600 font-mono mt-1">
                RPE: {plaza.rpe}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};