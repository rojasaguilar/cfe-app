import { useState, useEffect } from "react";
import { Chip, LinearProgress, Paper, Tab, Tabs } from "@mui/material";
import { BatteryCharging, TrendingUp } from "lucide-react";

const parsePercentage = (rawPercentage) => {
  if (
    rawPercentage === null ||
    rawPercentage === undefined ||
    rawPercentage === ""
  ) {
    return null;
  }
  const numeric = Number(rawPercentage);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, numeric));
};

const BatteryPanel = ({ bateria, title, icon }) => {
  const [horasTotales, setHorasTotales] = useState(0);

  if (!bateria) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center space-y-1">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold">
          {icon}
          <span>{title}</span>
        </div>
        <p className="text-sm text-slate-500">
          No hay información disponible para este rubro.
        </p>
      </div>
    );
  }

  const percentage = parsePercentage(bateria?.porcentaje);
  const cursos = Array.isArray(bateria?.cursos) ? bateria.cursos : [];

  const calculateHoras = () => {
    const horasTotalesCalculadas = cursos.reduce((acc, curso) => {
      const practicas = Number(curso?.horasPracticas) || 0;
      const teoria = Number(curso?.horasTeoria) || 0;
      return acc + practicas + teoria;
    }, 0);

    setHorasTotales(horasTotalesCalculadas);
  };

  useEffect(() => {
    calculateHoras();
  }, [cursos]);
  return (
    <div className="rounded-xl border border-slate-200 bg-linear-to-br from-slate-50 to-blue-50/50 p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2 text-slate-800 font-semibold">
          <div className="flex items-center gap-1.5">
            {icon}
            <h3>{title}</h3>
          </div>
          <div className="flex gap-1.5">
            <h3>Horas totales:</h3>
            <h4>{horasTotales}</h4>
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        {/* <span className="text-3xl font-bold tracking-tight text-blue-700">
          {percentage != null ? `${percentage}%` : "—"}
        </span> */}
      </div>

      <LinearProgress
        variant="determinate"
        value={percentage ?? 0}
        sx={{
          height: 8,
          borderRadius: 999,
          backgroundColor: "#dbeafe",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            backgroundColor: "#2563eb",
          },
        }}
      />

      {cursos.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-4">
            <p className="col-span-2">Nombre del curso</p>
            <p>Horas de practica</p>
            <p>Horas teoría</p>
          </div>
          {cursos.map((curso, index) => (
            <div
              key={curso?.cursoId}
              className="grid grid-cols-4 text-sm text-slate-700"
            >
              <p className="col-span-2">
                {curso?.nombreCurso ?? "Curso sin nombre"}
              </p>
              <p>{curso.horasPracticas}</p>
              <p>{curso.horasTeoria}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">Sin cursos registrados.</p>
      )}
    </div>
  );
};

export const BateriasCard = ({
  bateriaActual = null,
  bateriaSuperior = null,
}) => {
  const [batteryTab, setBatteryTab] = useState(0);

  return (
    <Paper
      elevation={0}
      className="lg:col-span-5 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between"
    >
      <div className="space-y-4">
        <Tabs
          value={batteryTab}
          onChange={(_, newValue) => setBatteryTab(newValue)}
          variant="fullWidth"
          sx={{
            bgcolor: "#f1f5f9",
            p: 0.5,
            borderRadius: "12px",
            minHeight: 44,
            "& .MuiTab-root": {
              minHeight: 38,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              borderRadius: "9px",
              color: "#475569",
            },
            "& .Mui-selected": {
              color: "#1e3a8a !important",
              bgcolor: "#ffffff",
              boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab label="Batería actual" />
          <Tab label="Batería superior" />
        </Tabs>

        {batteryTab === 0 ? (
          <BatteryPanel
            bateria={bateriaActual}
            title="Batería actual"
            icon={<BatteryCharging size={18} className="text-blue-600" />}
          />
        ) : (
          <BatteryPanel
            bateria={bateriaSuperior}
            title="Batería superior"
            icon={<TrendingUp size={18} className="text-blue-600" />}
          />
        )}
      </div>
    </Paper>
  );
};
