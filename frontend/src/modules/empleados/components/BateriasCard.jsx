import { useState } from "react";
import { Chip, LinearProgress, Paper, Tab, Tabs } from "@mui/material";
import { BatteryCharging, TrendingUp } from "lucide-react";

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

const BatteryPanel = ({ bateria, title, icon }) => {
  const rawPercentage = bateria?.porcentaje;
  const percentage =
    typeof rawPercentage === "number"
      ? Math.max(0, Math.min(100, rawPercentage))
      : null;
  const fechaInicio = bateria?.fechaInicio || bateria?.vigencia?.inicio;
  const fechaFin = bateria?.fechaFin || bateria?.vigencia?.fin;

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/50 p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          {icon}
          <span>{title}</span>
        </div>
        <Chip
          size="small"
          label={percentage != null ? "Vigente" : "Sin registro"}
          color={percentage != null ? "primary" : "default"}
          variant="outlined"
        />
      </div>

      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-blue-700">
          {percentage != null ? `${percentage}%` : "—"}
        </span>
        <span className="text-xs text-slate-500">
          Vigencia: {formatDate(fechaInicio)} — {formatDate(fechaFin)}
        </span>
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
    </div>
  );
};

export const BateriasCard = ({ bateriaActual, bateriaSuperior }) => {
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