import { useState, useEffect, useCallback } from "react";
// Importa tu servicio real aquí:
import { getDepartamentos } from "../services/departamento.service";
import { ViewToggle } from "./../components/ViewToggle";
import { DepartmentList } from "./../components/DepartmentList";
import { DepartmentTree } from "./../components/DepartmentTree";
import { AddDepartmentBtn } from "./../components/AddDepartmentBtn";
import { AddDepartmentModal } from "../components/AddDepartmentModal";

export const OrganigramaPage = () => {
  const [view, setView] = useState("list"); // 'list' o 'tree'
  const [departments, setDepartments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Efecto para cargar los departamentos al montar el componente
  const fetchDepartamentos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getDepartamentos();
      setDepartments(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartamentos();
  }, [fetchDepartamentos]);

  // Lógica para cambiar de departamento con la rueda del mouse
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < departments.length - 1 ? prev + 1 : 0)); // Vuelve al inicio si es el último
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : departments.length - 1)); // Va al último si es el primero
  };

  const handleSelectDepartment = (index) => {
    setCurrentIndex(index); // Seteamos el departamento clickeado como el actual
    setView("tree"); // Cambiamos la vista automáticamente al árbol
  };

  // Renderizado condicional del loader/error
  if (isLoading)
    return <div className="p-8 text-gray-500">Cargando departamentos...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  return (
    <div className="p-8 relative h-full flex flex-col">
      <ViewToggle view={view} setView={setView} />

      <div className="flex-1">
        {view === "list" ? (
          <DepartmentList
            departments={departments}
            onSelectDepartment={handleSelectDepartment} // <-- Pasamos la función aquí
          />
        ) : (
          <DepartmentTree
            department={departments[currentIndex]}
            onNext={handleNext}
            onPrev={handlePrev}
            onStatusChange={fetchDepartamentos}
          />
        )}
      </div>

      {/* Botón flotante - Abre el modal */}
      <AddDepartmentBtn onClick={() => setIsModalOpen(true)} />

      {/* Modal - Le pasamos fetchDepartamentos para que recargue la lista al tener éxito */}
      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDepartamentos}
      />
    </div>
  );
};
