import React, { useEffect, useState } from "react";
import { X, Layers, Check, AlertCircle, Pencil } from "lucide-react";
import { getCursos } from "./../../cursos/cursos.service.js";

function extraerLista(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function obtenerIdsCursosBateria(bateria) {
  const cursosActuales = bateria?.cursos ?? [];
  return Array.from(
    new Set(cursosActuales.map((c) => c.cursoId ?? c.cursoid).filter(Boolean)),
  );
}

export function EditBateriaModal({ bateria, onClose, onSubmit }) {
  const [cursos, setCursos] = useState([]);
  const [selectedCursoIds, setSelectedCursoIds] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!bateria) return;

    let active = true;
    setFormError(null);
    setSelectedCursoIds(obtenerIdsCursosBateria(bateria));

    const cargarCursos = async () => {
      try {
        setLoadingCursos(true);
        const resCursos = await getCursos();
        if (!active) return;

        const listaCursos = extraerLista(resCursos).filter(
          (c) => c.activo !== false,
        );
        setCursos(listaCursos);
      } catch (err) {
        if (!active) return;
        console.error("Error al cargar cursos disponibles:", err);
        setFormError("No fue posible cargar la lista de cursos.");
      } finally {
        if (active) setLoadingCursos(false);
      }
    };

    cargarCursos();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      active = false;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [bateria, onClose]);

  if (!bateria) return null;

  const toggleCurso = (cursoId) => {
    setFormError(null);
    setSelectedCursoIds((prev) => {
      if (prev.includes(cursoId)) {
        if (prev.length === 1) {
          setFormError("La batería debe conservar al menos un curso.");
          return prev;
        }
        return prev.filter((id) => id !== cursoId);
      }
      return [...prev, cursoId];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (selectedCursoIds.length === 0) {
      setFormError("La batería debe tener al menos un curso asignado.");
      return;
    }

    const payload = {
      cursos: selectedCursoIds.map((cursoId) => ({ cursoId })),
    };

    try {
      setSubmitting(true);
      await onSubmit(bateria.bateriaid, payload);
    } catch (err) {
      setFormError(err?.message || "No fue posible actualizar los cursos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-bateria-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="modal-editar-bateria-title"
                className="text-lg font-semibold text-slate-900 capitalize"
              >
                Editar cursos — {bateria.nombrepuesto}
              </h2>
              <p className="text-xs text-slate-500 capitalize">
                Departamento: {bateria.nombredepartamento} · Mínimo 1 curso
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de cursos con preselección */}
        <form
          id="form-editar-bateria"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {loadingCursos ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Cargando cursos disponibles...
            </div>
          ) : (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Cursos asignados ({selectedCursoIds.length} seleccionados)
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Layers className="h-3.5 w-3.5" />
                  {cursos.length} disponibles
                </span>
              </div>

              {cursos.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                  No hay cursos disponibles.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {cursos.map((curso) => {
                    const id = curso.cursoid;
                    const checked = selectedCursoIds.includes(id);
                    const horasTotal =
                      (Number(curso.horasteoria) || 0) +
                      (Number(curso.horaspracticas) || 0);

                    return (
                      <label
                        key={id}
                        className={`flex cursor-pointer items-start gap-3 p-3.5 transition ${
                          checked ? "bg-emerald-50/50" : "hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCurso(id)}
                          className="sr-only"
                        />

                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                            checked
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white text-transparent"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-medium text-slate-700">
                              {curso.codigocurso}
                            </span>
                            {curso.generadc3 && (
                              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                DC-3
                              </span>
                            )}
                            <span className="text-xs text-slate-500">
                              {horasTotal}h ({curso.horasteoria}h T /{" "}
                              {curso.horaspracticas}h P)
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {curso.nombre}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Pie del modal */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-editar-bateria"
            disabled={
              submitting || loadingCursos || selectedCursoIds.length === 0
            }
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
