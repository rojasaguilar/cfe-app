import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { Login } from "./modules/auth/pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { OrganigramaPage } from "./modules/departamento/pages/OrganigramaPage";
import { Signup } from "./modules/auth/pages/SignUp";
import { LandingPage } from "./components/Landing";
import { PuestosPage } from "./modules/puestos/pages/PuestosPage";
import { EmpleadosPage } from "./modules/empleados/pages/EmpleadosPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Rutas Públicas */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* RUTAS PRIVADAS */}
          <Route element={<ProtectedRoute />}>
            {/* LAYOUT: Le quitamos el path="/home". Ahora solo envuelve. */}
            <Route element={<Layout />}>
              {/* Todas las rutas aquí adentro tendrán el Sidebar y el Topbar */}
              <Route
                path="/home"
                element={<div>Vista de Inicio (Dashboard)</div>}
              />

              <Route path="/empleados" element={<EmpleadosPage />} />

              {/* Puedes seguir agregando más rutas que usen el Layout aquí */}
              <Route path="/organigrama" element={<OrganigramaPage />} />

              <Route path="/puestos" element={<PuestosPage />} />
            </Route>
          </Route>

          {/* Ruta Catch-all (404) para cualquier URL que no exista */}
          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center">
                <h1 className="text-2xl font-bold">
                  404 - Página no encontrada
                </h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
