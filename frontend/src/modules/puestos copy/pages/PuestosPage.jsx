import { useState, useEffect } from "react";
import { List, Table as TableIcon } from "lucide-react"; // Importamos los íconos
// Ajusta estas rutas según la estructura real de tus carpetas
import { getPuestos } from "../puesto.service.js";
import { PuestosTable } from "../components/PuestosTable.jsx";
import { PuestosList } from "../components/PuestosList.jsx";

export const PuestosPage = () => {
  const [puestos, setPuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Nuevo estado para controlar la vista activa ('list' o 'table')
  const [view, setView] = useState("list");

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Ejecutamos el servicio
        const response = await getPuestos();

        // Asumiendo que tu backend devuelve { success: true, data: [...] }
        setPuestos(response.data || response);
      } catch (err) {
        setError(
          err.message || "Ocurrió un error al cargar el catálogo de puestos.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPuestos();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col h-full">
      {/* Cabecera de la página */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Catálogo de Puestos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los puestos disponibles para la Zona de Transmisión.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector de Vistas (Toggle) */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setView("list")}
              title="Vista de lista"
              className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                view === "list" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setView("table")}
              title="Vista de tabla"
              className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                view === "table" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <TableIcon size={20} />
            </button>
          </div>

          {/* Botón Nuevo Puesto */}
          <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            + Nuevo Puesto
          </button>
        </div>
      </div>

      {/* Manejo de Estados: Loading, Error, o Vistas */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center p-12 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Cargando puestos...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
          Error: {error}
        </div>
      ) : (
        /* Renderizado condicional basado en el estado 'view' */
        view === "list" ? (
          <PuestosList puestos={puestos} />
        ) : (
          <PuestosTable puestos={puestos} />
        )
      )}
    </div>
  );
};