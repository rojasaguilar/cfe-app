import { Plus } from "lucide-react";

export const AddDepartmentBtn = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center z-50"
      title="Agregar Departamento"
    >
      <Plus size={28} />
    </button>
  );
};