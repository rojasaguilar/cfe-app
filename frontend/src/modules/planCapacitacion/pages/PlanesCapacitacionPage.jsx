import { useState, useCallback, useEffect } from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  Plus,
  ChevronDown,
  History,
  CalendarDays,
  CalendarPlus,
  AlertCircle,
  RefreshCw,
  Layers,
} from "lucide-react";

import { getPlanes } from "../plan.service.js";
import { PlanCard } from "../components/PlanCard/PlanCard.jsx";

export const PlanesCapacitacionPage = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlanes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPlanes();

      setPlanes(
        Array.isArray(response?.data) ? response.data : []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los planes de capacitación"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanes();
  }, [fetchPlanes]);

  const planActivo = planes.find(
    (plan) => plan.estado === "ABIERTO"
  );

  const planesAnteriores = planes
    .filter((plan) => plan.estado !== "ABIERTO")
    .sort(
      (a, b) =>
        new Date(b.fechaapertura) - new Date(a.fechaapertura)
    );

  const handleOpenPlan = () => {
    // Abrir modal de creación del plan
  };

  const handleSelectPlan = (planId) => {
    // Navegar al detalle del plan
    console.log(planId);
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-6">

      {/* Encabezado de página */}
      <header className="space-y-5 border-b border-slate-200 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <Layers size={16} strokeWidth={2} />

            <span className="text-xs font-semibold uppercase tracking-widest">
              Gestión de capacitación
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Planes de capacitación
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Administra los periodos de planificación y consulta
            el historial de planes de capacitación.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="contained"
            disableElevation
            startIcon={<Plus size={19} />}
            onClick={handleOpenPlan}
            disabled={loading || Boolean(error) || Boolean(planActivo)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "10px 18px",
              backgroundColor: "#047857",
              "&:hover": {
                backgroundColor: "#065f46",
              },
            }}
          >
            Aperturar plan de capacitación
          </Button>

          <span className="text-sm text-slate-500">
            {planes.length} planes registrados
          </span>
        </div>
      </header>

      {/* Estado de carga */}
      {loading && (
        <div
          role="status"
          className="flex min-h-64 flex-col items-center justify-center gap-4"
        >
          <CircularProgress
            size={30}
            sx={{ color: "#047857" }}
          />

          <p className="text-sm font-medium text-slate-500">
            Cargando planes de capacitación...
          </p>
        </div>
      )}

      {/* Estado de error */}
      {!loading && error && (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertCircle size={20} />

            <h3 className="font-semibold">
              No se pudieron cargar los planes
            </h3>
          </div>

          <p className="text-sm text-rose-600">{error}</p>

          <Button
            variant="outlined"
            color="error"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchPlanes}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Sección del plan activo */}
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CalendarDays size={22} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-800">
                  Plan actual activo
                </h2>

                <p className="text-sm text-slate-500">
                  Periodo de capacitación abierto actualmente.
                </p>
              </div>
            </div>

            {planActivo ? (
              <div className="w-full max-w-xl ">
                <PlanCard
                  plan={planActivo}
                  onClick={handleSelectPlan}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400">
                  <CalendarPlus size={28} strokeWidth={1.5} />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No hay un plan activo
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                  Apertura un nuevo plan de capacitación para
                  iniciar un periodo de planificación.
                </p>

                <Button
                  startIcon={<Plus size={17} />}
                  onClick={handleOpenPlan}
                  sx={{
                    mt: 2,
                    color: "#047857",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Aperturar nuevo plan
                </Button>
              </div>
            )}
          </section>

          {/* Historial de planes */}
          <section>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                border: "1px solid #e2e8f0",
                borderRadius: "16px !important",
                overflow: "hidden",
                "&::before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                id="historial-header"
                aria-controls="historial-content"
                expandIcon={
                  <ChevronDown size={21} className="text-slate-500" />
                }
                sx={{
                  px: 3,
                  py: 1,
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                <div className="flex w-full items-center gap-3 pr-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <History size={23} strokeWidth={1.8} />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-base font-semibold text-slate-800">
                      Historial de planes
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      Consulta los periodos cerrados o cancelados.
                    </p>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {planesAnteriores.length}
                  </span>
                </div>
              </AccordionSummary>

              <AccordionDetails
                sx={{
                  padding: 3,
                  borderTop: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                }}
              >
                {planesAnteriores.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {planesAnteriores.map((plan) => (
                      <PlanCard
                        key={plan.planid}
                        plan={plan}
                        onClick={handleSelectPlan}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <History
                      size={32}
                      strokeWidth={1.5}
                      className="mb-2 text-slate-300"
                    />

                    <p className="text-sm font-semibold text-slate-600">
                      No hay planes anteriores
                    </p>

                    <p className="text-xs text-slate-400">
                      Los planes cerrados y cancelados aparecerán aquí.
                    </p>
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          </section>
        </>
      )}
    </main>
  );
};