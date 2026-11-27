import { useState } from "react";
import { Divider, Paper, Tab, Tabs } from "@mui/material";
// import { KardexCard } from "./KardexCard";
import KardexTable from "./KardexTable";

const formatDate = (date) => {
  if (!date) return "No disponible";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2.5 border-b border-slate-100 last:border-b-0">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:w-40 shrink-0">
      {label}
    </span>
    <span className="text-sm font-medium text-slate-800 wrap-break-word">
      {value || "No disponible"}
    </span>
  </div>
);

const DatosPersonales = ({ empleado }) => {
  const datos = empleado?.datosPersonales || empleado || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">Identidad</h3>
        <InfoItem
          label="Fecha de nacimiento"
          value={formatDate(datos.fechanacimiento)}
        />
        {/* <InfoItem label="Género" value={datos.genero} /> */}
        <InfoItem label="Estado civil" value={datos.estadocivil} />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Información de contacto
        </h3>
        <InfoItem label="Domicilio" value={datos.domicilio} />
        <InfoItem label="Teléfono" value={datos.telefono} />
        <InfoItem label="Correo" value={datos.correo} />
      </div>
    </div>
  );
};

export const ExpedienteTabsCard = ({ empleado, kardex }) => {
  const [informationTab, setInformationTab] = useState(0);

  return (
    <Paper
      elevation={0}
      className="rounded-2xl border border-slate-200 overflow-hidden"
    >
      <Tabs
        value={informationTab}
        onChange={(_, newValue) => setInformationTab(newValue)}
        sx={{
          borderBottom: "1px solid #e2e8f0",
          px: 2,
          "& .MuiTab-root": {
            minHeight: 54,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#2563eb",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        <Tab label="Datos personales" />
        <Tab label="Kardex" />
      </Tabs>

      <Divider />

      {informationTab === 0 ? (
        <DatosPersonales empleado={empleado} />
      ) : (
        <div className="p-6">
          {/* <KardexCard kardex={kardex} /> */}
          <KardexTable cursos={kardex?.cursos} />
        </div>
      )}
    </Paper>
  );
};
