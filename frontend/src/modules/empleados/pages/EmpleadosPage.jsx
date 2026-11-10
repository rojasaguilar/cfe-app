import { useEffect, useState } from "react";
import { EmpleadosTable } from "./../components/EmpleadosTable.jsx";
import { CreateEmpleadoForm } from "./../components/CreateEmpleadoForm.jsx";
import {
  getEmpleados,
  createEmpleado,
} from "./../services/empleado.service.js";

import { Button } from "@mui/material";
import { EmpleadoViewPage } from "./EmpleadoViewPage.jsx";

export const EmpleadosPage = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getEmpleados();

      setEmpleados(response.data);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setError("No fue posible cargar los empleados.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmpleado = async (empleadoData) => {
    setError(null);
    setLoading(true);

    try {
      await createEmpleado(empleadoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowForm(false);
      fetchEmpleados();
    }
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  console.log(empleados);
  const handleEmployeeSelect = (index) => {
    setSelectedIndex(index);
  };

  const selectedEmpleado =
    selectedIndex !== null ? empleados[selectedIndex] : null;

  if (loading) {
    return <div className="p-6 text-gray-500">Cargando empleados...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Empleados</h1>
        <p className="text-sm text-gray-500">
          Administración de empleados registrados.
        </p>

        <Button variant="contained" onClick={() => setShowForm(true)}>
          Nuevo empleado
        </Button>

        {showForm && (
          <div className="mt-6">
            <CreateEmpleadoForm
              onSubmit={handleCreateEmpleado}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </header>

      <EmpleadosTable empleados={empleados} onSelect={handleEmployeeSelect} />

      {selectedEmpleado && (
        <EmpleadoViewPage empleado={selectedEmpleado} />
      )}
    </main>
  );
};
