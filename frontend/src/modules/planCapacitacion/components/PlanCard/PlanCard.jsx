import {
  CalendarDays,
  CalendarCheck,
  CalendarX,
  ArrowRight,
  GraduationCap,
  Clock,
} from "lucide-react";

import { Button, LinearProgress } from "@mui/material";

import { DateItem } from "./DateItem";

const estados = {
  ABIERTO: {
    card: "border-emerald-300 bg-gradient-to-br from-white to-emerald-50/80 ring-1 ring-emerald-100 shadow-md shadow-emerald-900/5",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    icon: "bg-emerald-100 text-emerald-700",
  },
  CERRADO: {
    card: "border-slate-200 bg-white shadow-sm",
    badge: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    icon: "bg-slate-100 text-slate-500",
  },
  CANCELADO: {
    card: "border-slate-200 bg-white shadow-sm",
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
    icon: "bg-slate-100 text-slate-500",
  },
};

const buttonStyles = {
  textTransform: "none",
  fontWeight: 600,
  fontSize: 13,
  borderRadius: "10px",
  padding: "11px 16px",
  justifyContent: "space-between",
};

export const PlanCard = ({ plan, onClick }) => {
  if (!plan) return null;

  const { planid, fechaapertura, fechacierre, validohasta, estado } = plan;

  const isOpen = estado === "ABIERTO";
  const config = estados[estado] ?? estados.CERRADO;

  const inicio = new Date(fechaapertura).getTime();
  const fin = new Date(validohasta).getTime();
  const ahora = Date.now();

  const diasRestantes = Number.isFinite(fin)
    ? Math.max(0, Math.ceil((fin - ahora) / 86400000))
    : null;

  const progreso =
    fin > inicio
      ? Math.min(100, Math.max(0, ((ahora - inicio) / (fin - inicio)) * 100))
      : 0;

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden
        rounded-2xl border p-6 transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg ${config.card}`}
    >
      {/* Indicador superior */}
      {isOpen && (
        <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
      )}

      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4">
        <div
          className={`flex size-12 items-center justify-center
            rounded-xl ${config.icon}`}
        >
          <GraduationCap size={26} strokeWidth={1.8} />
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full
            px-3 py-1.5 text-xs font-semibold ${config.badge}`}
        >
          <span
            className={`size-2 rounded-full ${config.dot}
              ${isOpen ? "motion-safe:animate-pulse" : ""}`}
          />

          <span className="capitalize">
            {estado?.toLowerCase() ?? "Desconocido"}
          </span>
        </span>
      </div>

      {/* Título */}
      <div className="mt-2  w-full ">
        {/* <p
          className={`mb-1 text-[10px] font-bold uppercase tracking-widest
            ${isOpen ? "text-emerald-700" : "text-slate-400"}`}
        >
          {isOpen ? "Plan de capacitación activo" : "Plan de capacitación"}
        </p> */}

        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Plan{" "}
          {Number.isFinite(inicio)
            ? new Date(inicio).getFullYear()
            : "sin fecha"}
        </h2>

        {/* Vigencia */}
        {isOpen && (
          <div className=" rounded-xl border border-emerald-200/70 bg-white/70 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-emerald-700">
              <div className="flex items-center gap-2">
                <Clock size={17} strokeWidth={1.8} />

                <span className="text-xs font-semibold">Vigencia</span>
              </div>

              <span className="text-xs font-bold">
                {diasRestantes === null
                  ? "Sin vigencia definida"
                  : `${diasRestantes} días restantes`}
              </span>
            </div>

            <LinearProgress
              variant="determinate"
              value={progreso}
              aria-label="Periodo de vigencia transcurrido"
              sx={{
                height: 6,
                borderRadius: 10,
                backgroundColor: "#d1fae5",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#059669",
                  borderRadius: 10,
                },
              }}
            />

            <p className="mt-2 text-[11px] text-slate-500">
              {fin > inicio
                ? `${Math.round(progreso)}% del periodo transcurrido`
                : "Periodo de vigencia no disponible"}
            </p>
          </div>
        )}
      </div>

      {/* Fechas */}
      <div className="space-y-4 border-t border-slate-200/80 py-5">
        <DateItem
          icon={CalendarDays}
          label="Fecha de apertura"
          date={fechaapertura}
        />

        <DateItem
          icon={CalendarCheck}
          label="Vigencia hasta"
          date={validohasta}
        />

        <DateItem icon={CalendarX} label="Fecha de cierre" date={fechacierre} />
      </div>

      {/* Acciones */}
      <div className="mt-auto pt-2">
        <Button
          fullWidth
          disableElevation
          variant={isOpen ? "contained" : "outlined"}
          endIcon={<ArrowRight size={18} />}
          onClick={() => onClick?.(planid)}
          sx={{
            ...buttonStyles,
            ...(isOpen
              ? {
                  backgroundColor: "#047857",
                  "&:hover": {
                    backgroundColor: "#065f46",
                  },
                }
              : {
                  color: "#475569",
                  borderColor: "#cbd5e1",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    backgroundColor: "#f8fafc",
                  },
                }),
          }}
        >
          {isOpen ? "Gestionar plan" : "Consultar plan"}
        </Button>
      </div>
    </article>
  );
};
