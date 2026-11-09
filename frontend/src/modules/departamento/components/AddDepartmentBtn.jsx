import { useState, useRef, useEffect } from "react";
import { Plus, Building2, UserPlus } from "lucide-react";

export const AddDepartmentBtn = ({ onAddDepartment, onAddPlaza }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3" ref={menuRef}>
      
      {/* Opciones del menú (se muestran solo si isOpen es true) */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Opción: Nueva Plaza */}
          <button
            onClick={() => {
              onAddPlaza();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700">Nueva Plaza</span>
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full group-hover:bg-emerald-200 transition-colors">
              <UserPlus size={18} />
            </div>
          </button>
          
          {/* Opción: Nuevo Departamento */}
          <button
            onClick={() => {
              onAddDepartment();
              setIsOpen(false);
            }}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700">Nuevo Departamento</span>
            <div className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
              <Building2 size={18} />
            </div>
          </button>

        </div>
      )}

      {/* Botón Principal (Gira a una 'X' cuando está abierto) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full p-4 shadow-lg transition-all flex items-center justify-center 
          ${isOpen 
            ? "bg-gray-600 hover:bg-gray-700 text-white rotate-45 shadow-gray-600/30" 
            : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-blue-600/30"
          }`}
        title="Agregar"
      >
        <Plus size={28} className="transition-transform duration-300" />
      </button>
    </div>
  );
};