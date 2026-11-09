import { useState, useEffect, useCallback } from "react";
import { getDepartamentos } from "../services/departamento.service";
import { ViewToggle } from "./../components/ViewToggle";
import { DepartmentList } from "./../components/DepartmentList";
import { DepartmentTree } from "./../components/DepartmentTree";
import { AddDepartmentBtn } from "./../components/AddDepartmentBtn";
import { AddDepartmentModal } from "../components/AddDepartmentModal";
import { AddPlazaModal } from "./../../plazas/components/AddPlazaModal";

export const OrganigramaPage = () => {
  const [view, setView] = useState("list");
  const [departments, setDepartments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  // Estados para los modales
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isPlazaModalOpen, setIsPlazaModalOpen] = useState(false);

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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < departments.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : departments.length - 1));
  };

  const handleSelectDepartment = (index) => {
    setCurrentIndex(index);
    setView("tree");
  };

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
            onSelectDepartment={handleSelectDepartment}
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

      {/* Botón flotante actualizado con sus dos props */}
      <AddDepartmentBtn
        onAddDepartment={() => setIsDepartmentModalOpen(true)}
        onAddPlaza={() => setIsPlazaModalOpen(true)}
      />

      {/* Modal de Departamento */}
      <AddDepartmentModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        onSuccess={fetchDepartamentos}
      />

      {/* Futuro Modal de Plaza (Solo estructural por ahora) */}

      <AddPlazaModal
        isOpen={isPlazaModalOpen}
        onClose={() => setIsPlazaModalOpen(false)}
        onSuccess={fetchDepartamentos}
        departamentoid={departments[currentIndex]?.departamentoid}
      />
    </div>
  );
};
