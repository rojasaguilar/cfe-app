import { Edit2, PowerOff, ImageIcon } from "lucide-react";

export const DepartmentTree = ({ department, onNext, onPrev }) => {
  // Manejador del scroll con un ligero bloqueo para no disparar 100 eventos por segundo
  let scrollTimeout = null;

  const handleWheel = (e) => {
    if (scrollTimeout) return; // Si está en cooldown, ignoramos el evento
    
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
    }, 400); // 400ms de cooldown entre cada "paso" de departamento

    if (e.deltaY > 0) {
      onNext(); // Scroll abajo -> Siguiente
    } else if (e.deltaY < 0) {
      onPrev(); // Scroll arriba -> Anterior
    }
  };

  if (!department) return null;

  return (
    <div 
      className="flex flex-col h-[calc(100vh-180px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      onWheel={handleWheel}
    >
      {/* Header del departamento */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Departamento Actual</span>
          <h2 className="text-2xl font-bold text-gray-800">{department.nombre}</h2>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm">
            <Edit2 size={16} />
            Editar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm">
            <PowerOff size={16} />
            Desactivar
          </button>
        </div>
      </div>

      {/* Área del Organigrama (Placeholder) */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 relative">
        <div className="absolute top-4 text-xs text-gray-400">
          Usa la rueda del mouse para navegar entre departamentos
        </div>
        
        {/* Aquí irá el árbol real después. Por ahora, imagen representativa */}
        <div className="w-full max-w-2xl h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-white">
          <ImageIcon size={48} className="mb-4 opacity-50" />
          <p className="font-medium text-gray-500">Render del Árbol Jerárquico</p>
          <p className="text-sm mt-1 text-gray-400">(Imagen demostrativa)</p>
        </div>
      </div>
    </div>
  );
};