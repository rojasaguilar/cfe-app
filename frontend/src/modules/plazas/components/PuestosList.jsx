import { Edit2, Trash2 } from "lucide-react";
import { IconButton, Tooltip } from "@mui/material";

export const PuestosList = ({ puestos = [] }) => {
  if (!puestos.length) return <p className="text-gray-500 text-center p-8">No hay puestos.</p>;

  return (
    // Reducimos el ancho máximo para que no se estire por toda la pantalla
    <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
      {puestos.map((puesto) => (
        <div key={puesto.puestoid} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
          
          {/* Información principal a la izquierda */}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 uppercase">{puesto.nombrepuesto}</span>
            <span className="text-xs text-gray-400 mt-0.5">ID Interno: {puesto.puestoid.split("-")[0]}</span>
          </div>

          {/* Estado y Acciones a la derecha */}
          <div className="flex items-center gap-4">
            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase rounded-full ${
                puesto.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}>
              {puesto.activo ? "Activo" : "Inactivo"}
            </span>

            <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
              <Tooltip title="Editar">
                <IconButton size="small" className="text-blue-600 hover:bg-blue-50">
                  <Edit2 size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title={puesto.activo ? "Desactivar" : "Activar"}>
                <IconButton size="small" className={puesto.activo ? "text-red-600" : "text-green-600"}>
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};