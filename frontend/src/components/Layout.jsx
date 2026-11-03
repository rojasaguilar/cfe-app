import {
  Home,
  Network,
  Users,
  AlertCircle,
  ClipboardList,
  MessageSquare,
  Bell,
} from "lucide-react";
import { Outlet } from "react-router-dom";
// import { Link, Outlet } from "react-router-dom"; // Descomenta si usas React Router

export const Layout = () => {
  // Arreglo de navegación para limpiar el código del sidebar
  const navItems = [
    // { icon: Home, label: "Inicio", href: "/dashboard" },
    { icon: Network, label: "Organigrama", href: "/organigrama" },
    // { icon: Users, label: "Empleados", href: "/empleados", active: true }, // Simulando estado activo
    // { icon: AlertCircle, label: "Necesidades", href: "/necesidades" },
    // { icon: ClipboardList, label: "Plan de capacitacion", href: "/capacitacion" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Barra superior (Top bar oscuro) */}
      {/* <header className="bg-[#2d2d2d] text-gray-400 px-4 py-1.5 text-xs flex items-center w-full"> */}
      
        {/* Aquí puedes hacer dinámico el título según la ruta */}
      {/* </header> */}

      {/* Contenedor principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Lateral */}
        <aside className="w-28 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm z-10 overflow-y-auto">
          {/* Navegación Principal */}
          <nav className="flex flex-col gap-6 w-full">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href} // Cambia a <Link to={item.href}> si usas React Router
                  className={`flex flex-col items-center justify-center gap-1.5 px-2 transition-colors
                    ${item.active ? "text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
                >
                  <Icon size={24} strokeWidth={1.5} />
                  <span className="text-[10px] text-center leading-tight px-1">
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Espaciador flexible para empujar iconos al fondo si se requiere */}
          <div className="flex-1"></div>

          {/* Iconos inferiores (Chat / Notificaciones) */}
          <div className="flex flex-col gap-6 mt-8 text-gray-500 w-full items-center">
            <button className="hover:text-gray-800 transition-colors">
              <MessageSquare size={24} strokeWidth={1.5} />
            </button>
            <button className="hover:text-gray-800 transition-colors">
              <Bell size={24} strokeWidth={1.5} />
            </button>
          </div>
        </aside>

        {/* Área de Contenido Principal */}
        <main className="flex-1 bg-white relative overflow-y-auto">
          {/* Si usas react-router-dom, aquí puedes poner <Outlet /> en lugar de {children} */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
