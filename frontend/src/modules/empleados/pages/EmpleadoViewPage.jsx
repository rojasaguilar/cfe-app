import React, { useState } from "react";

import {
  Paper,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Button,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

// Componente reutilizable para mostrar información
const InfoItem = ({ label, value }) => (
  <div className="grid grid-cols-[125px_1fr] items-start gap-3 py-2">
    <span className="text-sm md:text-base text-gray-500">{label}:</span>

    <span className="text-sm md:text-base font-medium text-gray-900 break-words">
      {value || "No disponible"}
    </span>
  </div>
);

// Icono de batería
const BatteryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="5" width="14" height="18" rx="2" />
    <path d="M10 2h4v3h-4z" />
    <path d="m13 8-4 7h3l-1 4 4-7h-3z" />
  </svg>
);

// Panel de información de batería
const BatteryPanel = ({ bateria, title }) => {
  const percentage = bateria?.porcentaje;

  const fechaInicio = bateria?.fechaInicio || bateria?.vigencia?.inicio;

  const fechaFin = bateria?.fechaFin || bateria?.vigencia?.fin;

  const formatDate = (date) => {
    if (!date) return "No disponible";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("es-MX");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-blue-200 bg-blue-50/70 p-6 min-h-[190px]">
      <div className="flex items-center justify-center text-blue-600">
        {/* <BatteryIcon /> */}
      </div>

      <div className="hidden sm:block h-32 border-l border-blue-300" />

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-blue-900">{title}</h3>

        <p className="text-4xl font-bold text-blue-600 mt-1">
          {percentage != null ? `${percentage}%` : "—"}
        </p>

        <p className="text-sm text-gray-600 mt-3">
          Vigencia: {formatDate(fechaInicio)} - {formatDate(fechaFin)}
        </p>
      </div>
    </div>
  );
};

// Contenido de datos personales
const DatosPersonales = ({ empleado }) => {
  const datos = empleado?.datosPersonales || empleado || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-6">
      <div>
        <InfoItem label="Fecha de nacimiento" value={datos.fechaNacimiento} />

        <InfoItem label="Género" value={datos.genero} />

        <InfoItem label="Estado civil" value={datos.estadoCivil} />
      </div>

      <Divider orientation="vertical" flexItem className="hidden md:block" />

      <div>
        <InfoItem label="Domicilio" value={datos.domicilio} />

        <InfoItem label="Teléfono" value={datos.telefono} />

        <InfoItem label="Correo" value={datos.correo} />
      </div>
    </div>
  );
};

// Contenido del Kardex
const Kardex = ({ empleado }) => {
  const movimientos = empleado?.kardex || [];

  return (
    <TableContainer className="max-h-72">
      <Table>
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell>
              <strong>Fecha</strong>
            </TableCell>
            <TableCell>
              <strong>Movimiento</strong>
            </TableCell>
            <TableCell>
              <strong>Descripción</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {movimientos.length > 0 ? (
            movimientos.map((movimiento, index) => (
              <TableRow key={movimiento.id || index} hover>
                <TableCell>{movimiento.fecha || "—"}</TableCell>

                <TableCell>
                  {movimiento.tipo || movimiento.movimiento || "—"}
                </TableCell>

                <TableCell>{movimiento.descripcion || "—"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <span className="block py-6 text-gray-500">
                  No existen movimientos registrados en el Kardex.
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const EmpleadoViewPage = (empleado) => {
  const [batteryTab, setBatteryTab] = useState(0);
  const [informationTab, setInformationTab] = useState(0);

  if (!empleado) return null;

  console.log(empleado.nombres);
  //   const handleClose = () => {
  //     onClose?.();
  //   };

  const bateriaActual = empleado.bateriaActual;
  const bateriaSuperior = empleado.bateriaSuperior;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-6">
      <Paper
        elevation={0}
        className="w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-2xl flex flex-col"
      >
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <div className="flex items-center gap-4">
            <Avatar className="bg-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.5 0-8 2.3-8 5v3h16v-3c0-2.7-3.5-5-8-5Z" />
              </svg>
            </Avatar>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                Información del empleado
              </h1>
            </div>
          </div>

          {/* <IconButton onClick={handleClose} aria-label="Cerrar">
            <span className="text-2xl text-gray-500">×</span>
          </IconButton> */}
        </header>

        {/* CONTENIDO */}
        <div className="flex-1 overflow-y-auto">
          {/* SECCIÓN SUPERIOR */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
            {/* DATOS GENERALES */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4">
                <h2 className="text-xl font-bold text-blue-950">
                  Datos generales del empleado
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-center p-5 gap-6">
                <div className="flex items-center justify-center shrink-0">
                  <Avatar
                    sx={{
                      width: 140,
                      height: 140,
                      bgcolor: "#e5e7eb",
                      color: "#64748b",
                      fontSize: 65,
                    }}
                  >
                    {empleado.nombres?.charAt(0)?.toUpperCase() || "?"}
                  </Avatar>
                </div>

                <Divider
                  orientation="vertical"
                  flexItem
                  className="hidden sm:block"
                />

                <div className="flex-1 w-full">
                  <InfoItem
                    label={empleado.rpe ? "RPE" : "RTT"}
                    value={empleado.rpe || empleado.rtt}
                  />

                  <InfoItem label="Nombres" value={empleado.nombres} />

                  <InfoItem label="Apellidos" value={empleado.apellidos} />

                  <InfoItem label="RFC" value={empleado.rfc} />

                  <InfoItem label="CURP" value={empleado.curp} />
                </div>
              </div>
            </div>

            {/* BATERÍAS */}
            <div className="rounded-xl border border-gray-200 p-4">
              <Tabs
                value={batteryTab}
                onChange={(event, newValue) => setBatteryTab(newValue)}
                variant="fullWidth"
                sx={{
                  border: "1px solid #dbe2ea",
                  borderRadius: "10px",
                  minHeight: 55,
                  "& .MuiTab-root": {
                    minHeight: 55,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  },
                  "& .Mui-selected": {
                    color: "#fff !important",
                    backgroundColor: "#2563eb",
                    borderRadius: "9px",
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <Tab label="▣  Batería actual" />
                <Tab label="↗  Batería superior" />
              </Tabs>

              <div className="mt-6">
                {batteryTab === 0 ? (
                  <BatteryPanel
                    bateria={bateriaActual}
                    title="Batería actual"
                  />
                ) : (
                  <BatteryPanel
                    bateria={bateriaSuperior}
                    title="Batería superior"
                  />
                )}
              </div>
            </div>
          </section>

          <Divider />

          {/* SECCIÓN INFERIOR */}
          <section className="p-5">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {/* PESTAÑAS */}
              <Tabs
                value={informationTab}
                onChange={(event, newValue) => setInformationTab(newValue)}
                sx={{
                  borderBottom: "1px solid #e5e7eb",
                  "& .MuiTab-root": {
                    minHeight: 75,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    padding: "0 30px",
                  },
                  "& .Mui-selected": {
                    color: "#2563eb !important",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#2563eb",
                    height: 3,
                  },
                }}
              >
                <Tab label="①  Datos personales" />
                <Tab label="②  Kardex" />
              </Tabs>

              {/* CONTENIDO DE PESTAÑAS */}
              <div className="min-h-[230px]">
                {informationTab === 0 && (
                  <DatosPersonales empleado={empleado} />
                )}

                {informationTab === 1 && (
                  <div className="p-4">
                    <Kardex empleado={empleado} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="flex justify-end border-t border-gray-200 px-6 py-5 shrink-0">
          {/* <Button
            variant="outlined"
            color="inherit"
            onClick={}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "9px 28px",
            }}
          >
            Cerrar
          </Button> */}
        </footer>
      </Paper>
    </div>
  );
};
