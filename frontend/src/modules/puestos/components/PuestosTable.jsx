import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";

export const PuestosTable = ({ puestos = [] }) => {
  // Manejo de estado vacío
  if (!puestos || puestos.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-xl shadow-sm text-gray-500">
        No hay puestos registrados para mostrar.
      </div>
    );
  }

  return (
    // Usamos el componente Paper de MUI pero le inyectamos sombras y bordes de Tailwind
    <TableContainer
      component={Paper}
      className="shadow-sm border border-gray-200 rounded-xl overflow-hidden"
    >
      <Table sx={{ minWidth: 650 }} aria-label="tabla de puestos">
        {/* Cabecera de la tabla */}
        <TableHead className="bg-gray-50/80">
          <TableRow>
            <TableCell className="font-bold text-gray-600 uppercase text-xs tracking-wider">
              ID Puesto
            </TableCell>
            <TableCell className="font-bold text-gray-600 uppercase text-xs tracking-wider">
              Nombre del Puesto
            </TableCell>
            <TableCell
              align="center"
              className="font-bold text-gray-600 uppercase text-xs tracking-wider"
            >
              Estado
            </TableCell>
            <TableCell
              align="center"
              className="font-bold text-gray-600 uppercase text-xs tracking-wider"
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Cuerpo de la tabla */}
        <TableBody>
          {puestos.map((puesto) => (
            <TableRow
              key={puesto.puestoid}
              className="hover:bg-gray-50 transition-colors"
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {/* ID acortado para mejor visualización */}
              <TableCell className="text-gray-500 font-mono text-xs">
                <Tooltip title={puesto.puestoid} placement="top" arrow>
                  <span className="cursor-help border-b border-dashed border-gray-300">
                    {puesto.puestoid}...
                  </span>
                </Tooltip>
              </TableCell>

              {/* Nombre del puesto */}
              <TableCell className="font-medium text-gray-800 uppercase">
                {puesto.nombrepuesto}
              </TableCell>

              {/* Badge de Estado Activo/Inactivo */}
              <TableCell align="center">
                <span
                  className={`inline-flex px-2.5 py-1 text-[11px] font-bold uppercase rounded-full tracking-wide ${
                    puesto.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {puesto.activo ? "Activo" : "Inactivo"}
                </span>
              </TableCell>

              {/* Botones de acción (usando IconButtons de MUI + Lucide Icons) */}
              <TableCell align="center">
                <div className="flex items-center justify-center gap-2">
                  <Tooltip title="Editar puesto">
                    <IconButton
                      size="small"
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      puesto.activo ? "Desactivar puesto" : "Activar puesto"
                    }
                  >
                    <IconButton
                      size="small"
                      className={
                        puesto.activo
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
