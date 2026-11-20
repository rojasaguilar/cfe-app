import { Avatar, Chip, Paper } from "@mui/material";

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2.5 border-b border-slate-100 last:border-b-0">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:w-40 shrink-0">
      {label}
    </span>
    <span className="text-sm font-medium text-slate-800 break-words">
      {value || "No disponible"}
    </span>
  </div>
);

export const DatosGeneralesCard = ({ empleado }) => {
  if (!empleado) return null;

  return (
    <Paper
      elevation={0}
      className="lg:col-span-7 rounded-2xl border border-slate-200 overflow-hidden"
    >
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Datos generales</h2>
        {empleado.activo !== undefined && (
          <Chip
            size="small"
            label={empleado.activo ? "Activo" : "Inactivo"}
            color={empleado.activo ? "success" : "default"}
            variant="soft"
          />
        )}
      </div>

      <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Avatar
          sx={{
            width: 96,
            height: 96,
            bgcolor: "#eff6ff",
            color: "#1d4ed8",
            fontSize: 36,
            fontWeight: 700,
            border: "2px solid #bfdbfe",
            flexShrink: 0,
          }}
        >
          {empleado.nombres?.charAt(0)?.toUpperCase() || "?"}
        </Avatar>

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
    </Paper>
  );
};