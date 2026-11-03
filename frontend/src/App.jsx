import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { Login } from "./modules/auth/pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { OrganigramaPage } from "./modules/organigrama/pages/OrganigramaPage";
import { Signup } from "./modules/auth/pages/SignUp";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Si el usuario entra a la raíz "/", lo mandamos al login */}
          <Route path="/" element={<Navigate to="/organigrama" replace />} />

          {/* Rutas Públicas */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* RUTAS PRIVADAS */}
          <Route element={<ProtectedRoute />}>
            {/* LAYOUT: Le quitamos el path="/home". Ahora solo envuelve. */}
            <Route element={<Layout />}>
              {/* Todas las rutas aquí adentro tendrán el Sidebar y el Topbar */}
              <Route
                path="/home"
                element={<div>Vista de Inicio (Dashboard)</div>}
              />

              <Route
                path="/empleados"
                element={<div>Vista de Empleados</div>}
              />

              {/* Puedes seguir agregando más rutas que usen el Layout aquí */}
              <Route path="/organigrama" element={<OrganigramaPage />} />
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
