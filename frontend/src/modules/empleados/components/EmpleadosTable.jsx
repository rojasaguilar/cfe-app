import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

export const EmpleadosTable = ({ empleados = [], onSelect }) => {
  const handleSelect = (index) => {
    onSelect?.(index);
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell className="font-bold text-gray-700">RPE / RTT</TableCell>
              <TableCell className="font-bold text-gray-700">Nombres</TableCell>
              <TableCell className="font-bold text-gray-700">Apellidos</TableCell>
              <TableCell className="font-bold text-gray-700">RFC</TableCell>
              <TableCell className="font-bold text-gray-700">CURP</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {empleados.length > 0 ? (
              empleados.map((empleado, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleSelect(index)}
                  className="cursor-pointer transition-colors"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f0f9ff !important",
                    },
                  }}
                >
                  <TableCell>
                    <span className="font-medium text-gray-800">
                      {empleado.rpe || empleado.rtt || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell>{empleado.nombres}</TableCell>

                  <TableCell>{empleado.apellidos}</TableCell>

                  <TableCell>{empleado.rfc}</TableCell>

                  <TableCell>{empleado.curp}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <span className="text-gray-500 py-6 block">
                    No hay empleados registrados.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}