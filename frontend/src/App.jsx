import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import { Login } from "./modules/auth/pages/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Si el usuario entra a la raíz "/", lo mandamos al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />

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
