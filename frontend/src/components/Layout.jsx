import { useState } from "react";
import {
  Home,
  Network,
  Users,
  AlertCircle,
  ClipboardList,
  MessageSquare,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Outlet, Link } from "react-router-dom"; 

export const Layout = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Función específica para cerrar un menú al hacer clic en un enlace
  const closeMenu = (menuId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: false,
    }));
  };

  const navItems = [
    { 
      id: "home", 
      icon: Home, 
      label: "Inicio", 
      href: "/home" 
    },
    { 
      id: "organigrama", 
      icon: Network, 
      label: "Organigrama", 
      subItems: [
        { label: "Departamentos", href: "/organigrama" },
        { label: "Puestos", href: "/puestos" }
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-28 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm z-10 overflow-y-auto">
          
          <nav className="flex flex-col gap-2 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isOpen = openMenus[item.id];

              if (item.subItems) {
                return (
                  <div key={item.id} className="flex flex-col w-full">
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 py-3 w-full transition-colors hover:bg-gray-50
                        ${isOpen ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                    >
                      <Icon size={24} strokeWidth={1.5} />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-center leading-tight">
                          {item.label}
                        </span>
                        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="flex flex-col items-center bg-gray-50 border-y border-gray-100 py-3 w-full gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                        {item.subItems.map((sub, idx) => (
                          <Link
                            key={idx}
                            to={sub.href}
                            // Ejecutamos la función de cierre al hacer clic
                            onClick={() => closeMenu(item.id)}
                            className="text-[10px] font-medium text-gray-500 hover:text-blue-600 transition-colors w-full text-center"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 w-full transition-colors hover:bg-gray-50
                    ${item.active ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                >
                  <Icon size={24} strokeWidth={1.5} />
                  <span className="text-[10px] text-center leading-tight px-1">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex-1"></div>

          <div className="flex flex-col gap-6 mt-8 text-gray-500 w-full items-center">
            <button className="hover:text-gray-800 transition-colors">
              <MessageSquare size={24} strokeWidth={1.5} />
            </button>
            <button className="hover:text-gray-800 transition-colors">
              <Bell size={24} strokeWidth={1.5} />
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-gray-50 relative overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};