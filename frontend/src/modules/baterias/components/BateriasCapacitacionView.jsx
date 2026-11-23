import React, { useEffect, useMemo, useState } from "react";
import {
  Layers,
  Building2,
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  Pencil,
  X,
} from "lucide-react";
import { EditBateriaModal } from "./../components/EditarBateriaModal";

function calcularMetricasBateria(cursos = []) {
  return cursos.reduce(
    (acc, curso) => {
      const teoria = Number(curso.horasTeoria) || 0;
      const practica = Number(curso.horasPracticas) || 0;
      acc.totalCursos += 1;
      acc.horasTeoria += teoria;
      acc.horasPracticas += practica;
      acc.horasTotales += teoria + practica;
      if (curso.generaDC3) acc.cursosDc3 += 1;
      return acc;
    },
    {
      totalCursos: 0,
      horasTeoria: 0,
      horasPracticas: 0,
      horasTotales: 0,
      cursosDc3: 0,
    },
  );
}

export function BateriasCapacitacionView({ payload, onUpdateBateria }) {
  const baterias = payload?.data ?? [];
  const [bateriaSeleccionadaId, setBateriaSeleccionadaId] = useState(null);
  const [bateriaEnEdicion, setBateriaEnEdicion] = useState(null);

  const bateriasConMetricas = useMemo(
    () =>
      baterias.map((bateria) => ({
        ...bateria,
        metricas: calcularMetricasBateria(bateria.cursos),
      })),
    [baterias],
  );

  const bateriaSeleccionada = useMemo(
    () =>
      bateriasConMetricas.find((b) => b.bateriaid === bateriaSeleccionadaId) ??
      null,
    [bateriasConMetricas, bateriaSeleccionadaId],
  );

  useEffect(() => {
    if (!bateriaSeleccionadaId || bateriaEnEdicion) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setBateriaSeleccionadaId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bateriaSeleccionadaId, bateriaEnEdicion]);

  const handleConfirmEdit = async (bateriaId, data) => {
    if (onUpdateBateria) {
      await onUpdateBateria(bateriaId, data);
    }
    setBateriaEnEdicion(null);
  };

  if (bateriasConMetricas.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No hay baterías de capacitación registradas.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {bateriasConMetricas.map((bateria) => {
          const { metricas } = bateria;
          const estaActiva = bateriaSeleccionadaId === bateria.bateriaid;

          return (
            <button
              key={bateria.bateriaid}
              type="button"
              onClick={() => setBateriaSeleccionadaId(bateria.bateriaid)}
              className={`group w-full rounded-xl border p-5 text-left transition ${
                estaActiva
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    {bateria.nombredepartamento}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 capitalize">
                    {bateria.nombrepuesto}
                  </h3>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>
                    <strong>{metricas.totalCursos}</strong> cursos
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="h-4 w-4 text-sky-600" />
                  <span>
                    <strong>{metricas.horasTotales}h</strong> totales
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Award className="h-4 w-4 text-amber-600" />
                  <span>
                    <strong>{metricas.cursosDc3}</strong> DC-3
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {bateriaSeleccionada && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              <div>
                <h4 className="font-semibold text-slate-900 capitalize">
                  Cursos — {bateriaSeleccionada.nombrepuesto} (
                  {bateriaSeleccionada.nombredepartamento})
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBateriaEnEdicion(bateriaSeleccionada)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Pencil className="h-3.5 w-3.5 text-emerald-600" />
                Editar cursos
              </button>

              <button
                type="button"
                onClick={() => setBateriaSeleccionadaId(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar detalle"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ul className="mt-4 divide-y divide-slate-100">
            {(bateriaSeleccionada.cursos ?? []).map((curso) => (
              <li
                key={curso.cursoId}
                className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
                      {curso.codigoCurso}
                    </span>
                    {curso.generaDC3 && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Genera DC-3
                      </span>
                    )}
                    {!curso.activoCurso && (
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {curso.nombreCurso}
                  </p>
                </div>

                <div className="shrink-0 text-xs text-slate-600 sm:text-right">
                  <div>
                    Teoría: <strong>{curso.horasTeoria}h</strong> · Práctica:{" "}
                    <strong>{curso.horasPracticas}h</strong>
                  </div>
                  <div className="text-slate-500">
                    Total:{" "}
                    <strong>
                      {(Number(curso.horasTeoria) || 0) +
                        (Number(curso.horasPracticas) || 0)}
                      h
                    </strong>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <EditBateriaModal
        bateria={bateriaEnEdicion}
        onClose={() => setBateriaEnEdicion(null)}
        onSubmit={handleConfirmEdit}
      />
    </div>
  );
}
