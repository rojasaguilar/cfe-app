import { Link } from "react-router-dom";
import {
  Zap,
  Users,
  Network,
  BookOpen,
  BarChart3,
  ChevronRight,
} from "lucide-react";

export const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Gestión de Empleados",
      description:
        "Administra expedientes, puestos y plazas (confianza o sindicalizados) de todo el personal de la zona de transmisión de forma centralizada.",
    },
    {
      icon: Network,
      title: "Organigrama Dinámico",
      description:
        "Visualiza y edita la estructura jerárquica de departamentos, superintendencias y subestaciones con una interfaz interactiva de árbol.",
    },
    {
      icon: BookOpen,
      title: "Plan de Capacitaciones",
      description:
        "Programa, asigna y da seguimiento a los cursos y formularios DC-3 para garantizar el cumplimiento normativo del personal.",
    },
    {
      icon: BarChart3,
      title: "Métricas Avanzadas",
      description:
        "Analiza el progreso de capacitación, similitud de cursos y estadísticas de cumplimiento a través de tableros automatizados en tiempo real.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Corporativo */}
          <div className="flex items-center justify-center gap-2">
            <div className="  rounded-md text-white h-14 w-14 flex items-center">
              <img src="cfe.png"></img>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              <span className="font-light text-gray-500 border-l border-gray-300 ml-2 pl-2">
                SIC
              </span>
            </span>
          </div>

          {/* Botones de Autenticación */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#007b5e] transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-[#007b5e] text-white px-5 py-2 rounded-lg hover:bg-[#00664e] transition-colors shadow-sm"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden flex-1 flex items-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-green-50 text-[#007b5e] text-xs font-semibold uppercase tracking-wider mb-6 border border-green-100">
            Zona de Transmisión Nayarit
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Sistema Integral de{" "}
            <span className="text-[#007b5e]">Capacitación</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Plataforma centralizada para la gestión de recursos humanos, control
            de estructura organizacional y automatización de métricas de
            capacitación.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-[#007b5e] text-white font-semibold rounded-lg hover:bg-[#00664e] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Acceder al Sistema
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Solución Completa de Gestión
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para optimizar los procesos
              administrativos e impulsar el desarrollo del talento interno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-green-50 text-[#007b5e] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Zap size={16} className="text-[#007b5e]" />
            <span>
              © {new Date().getFullYear()} Comisión Federal de Electricidad.
              Todos los derechos reservados.
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Desarrollado para CFE - Zona de transmición de Nayarit
          </div>
        </div>
      </footer>
    </div>
  );
};
