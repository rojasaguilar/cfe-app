import { useState, useEffect, useCallback } from "react";
import { getCursos } from "../cursos.service.js";
import { CursosTable } from "../components/CursosTable";

export const CursosPage = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCursos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getCursos();
      setCursos(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los cursos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600">Cargando cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-semibold text-slate-900">Cursos</h1>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
        <button
          type="button"
          onClick={fetchCursos}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (cursos.length === 0) {
    return (
      <div className="p-6 space-y-2">
        <h1 className="text-xl font-semibold text-slate-900">Cursos</h1>
        <p className="text-sm text-slate-500">Sin cursos registrados.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Cursos</h1>
        {/* <span className="text-sm text-slate-500">{cursos.length} cursos</span> */}
      </div>

      <CursosTable cursos={cursos} />
    </div>
  );
};
