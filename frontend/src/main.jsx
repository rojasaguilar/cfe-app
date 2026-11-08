import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 1. Importaciones de MUI
import { StyledEngineProvider, CssBaseline } from "@mui/material";

// 2. Importación de tu CSS de Tailwind
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* injectFirst manda el CSS de MUI al inicio del <head> */}
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <App />
    </StyledEngineProvider>
  </React.StrictMode>
);