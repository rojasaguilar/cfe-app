import React, { useEffect, useState } from "react";
import { X, Layers, Check, AlertCircle } from "lucide-react";
import { getPuestos } from "./../../puestos/puesto.service.js";
import { getDepartamentos } from "./../../departamento/services/departamento.service.js";
import { getCursos } from "./../../cursos/cursos.service.js";

function extraerLista(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

export function CreateBateriaModal({ isOpen, onClose, onSubmit }) {
  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [puestoId, setPuestoId] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [selectedCursoIds, setSelectedCursoIds] = useState([]);

  const [loadingCatalogos, setLoadingCatalogos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setFormError(null);
    setPuestoId("");
    setDepartamentoId("");
    setSelectedCursoIds([]);

    const cargarCatalogos = async () => {
      try {
        setLoadingCatalogos(true);
        const [resPuestos, resDepartamentos, resCursos] = await Promise.all([
          getPuestos(),
          getDepartamentos(),
          getCursos(),
        ]);

        if (!active) return;

        const listaPuestos = extraerLista(resPuestos).filter(
          (p) => p.activo !== false
        );
        const listaDepartamentos = extraerLista(resDepartamentos).filter(
          (d) => d.activo !== false
        );
        const listaCursos = extraerLista(resCursos).filter(
          (c) => c.activo !== false
        );

        setPuestos(listaPuestos);
        setDepartamentos(listaDepartamentos);
        setCursos(listaCursos);
      } catch (err) {
        if (!active) return;
        console.error("Error al cargar catálogos de batería:", err);
        setFormError(
          "No fue posible cargar puestos, departamentos o cursos."
        );
      } finally {
        if (active) setLoadingCatalogos(false);
      }
    };

    cargarCatalogos();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      active = false;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleCurso = (cursoId) => {
    setFormError(null);
    setSelectedCursoIds((prev) =>
      prev.includes(cursoId)
        ? prev.filter((id) => id !== cursoId)
        : [...prev, cursoId]
    );
  };

  const handleSelectAll = () => {
    setFormError(null);
    if (selectedCursoIds.length === cursos.length) {
      setSelectedCursoIds([]);
    } else {
      setSelectedCursoIds(cursos.map((c) => c.cursoid));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!puestoId) {
      setFormError("Selecciona un puesto.");
      return;
    }
    if (!departamentoId) {
      setFormError("Selecciona un departamento.");
      return;
    }
    if (selectedCursoIds.length === 0) {
      setFormError("Selecciona al menos un curso para la batería.");
      return;
    }

    const payload = {
      puestoId,
      departamentoId,
      cursos: selectedCursoIds.map((cursoId) => ({ cursoId })),
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (err) {
      setFormError(err?.message || "No fue posible crear la batería.");
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
      aria-labelledby="modal-nueva-bateria-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="modal-nueva-bateria-title"
                className="text-lg font-semibold text-slate-900"
              >
                Nueva batería de capacitación
              </h2>
              <p className="text-xs text-slate-500">
                Asigna puesto, departamento y cursos correspondientes.
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

        {/* Formulario */}
        <form
          id="form-nueva-bateria"
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {loadingCatalogos ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Cargando puestos, departamentos y cursos...
            </div>
          ) : (
            <>
              {/* 1 y 2. Selectores de Puesto y Departamento */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="select-puesto"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Puesto
                  </label>
                  <select
                    id="select-puesto"
                    value={puestoId}
                    onChange={(e) => {
                      setFormError(null);
                      setPuestoId(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 capitalize outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Selecciona un puesto...</option>
                    {puestos.map((puesto) => (
                      <option key={puesto.puestoid} value={puesto.puestoid}>
                        {puesto.nombrepuesto}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="select-departamento"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Departamento
                  </label>
                  <select
                    id="select-departamento"
                    value={departamentoId}
                    onChange={(e) => {
                      setFormError(null);
                      setDepartamentoId(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 capitalize outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Selecciona un departamento...</option>
                    {departamentos.map((depto) => (
                      <option
                        key={depto.departamentoid}
                        value={depto.departamentoid}
                      >
                        {depto.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Lista completa de cursos con checkbox */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Cursos disponibles ({selectedCursoIds.length} seleccionados)
                  </span>
                  {cursos.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs font-medium text-emerald-700 hover:underline"
                    >
                      {selectedCursoIds.length === cursos.length
                        ? "Deseleccionar todos"
                        : "Seleccionar todos"}
                    </button>
                  )}
                </div>

                {cursos.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
                    No hay cursos disponibles.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                    {cursos.map((curso) => {
                      const checked = selectedCursoIds.includes(curso.cursoid);
                      const horasTotal =
                        (Number(curso.horasteoria) || 0) +
                        (Number(curso.horaspracticas) || 0);

                      return (
                        <label
                          key={curso.cursoid}
                          className={`flex cursor-pointer items-start gap-3 p-3.5 transition ${
                            checked ? "bg-emerald-50/50" : "hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCurso(curso.cursoid)}
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
            </>
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
            form="form-nueva-bateria"
            disabled={submitting || loadingCatalogos}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Guardando..." : "Guardar batería"}
          </button>
        </div>
      </div>
    </div>
  );
}