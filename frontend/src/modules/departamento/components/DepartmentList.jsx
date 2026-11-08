import { Building2 } from "lucide-react";

export const DepartmentList = ({ departments, onSelectDepartment }) => {
  if (departments.length === 0) {
    return <p className="text-gray-500 text-center py-10">No hay departamentos registrados.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
      {/* Agregamos el index al map para saber qué departamento se clickeó */}
      {departments.map((dep, index) => (
        <div 
          key={dep.departamentoid} 
          onClick={() => onSelectDepartment(index)}
          className={`bg-white border p-5 rounded-xl shadow-sm transition-all flex items-start gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg
            ${dep.activo ? "border-gray-200" : "border-red-100 opacity-75 grayscale-[50%]"}`}
        >
          <div className={`p-3 rounded-lg ${dep.activo ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
            <Building2 size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 capitalize truncate" title={dep.nombre}>
              {dep.nombre}
            </h3>
            
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wide
                ${dep.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {dep.activo ? "Activo" : "Inactivo"}
              </span>
              
              {/* <span className="text-xs text-gray-400 truncate">
                ID: {dep.departamentoid}
              </span> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};