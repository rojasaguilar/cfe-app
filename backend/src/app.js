import express from "express";
import authRouter from "./modules/auth/auth.router.js"; // Ajusta la ruta correcta
import depaRouter from "./modules/departamentos/depa.router.js";

const app = express();

// Middleware para que Express entienda el JSON en el body de las peticiones
app.use(express.json());

// Montar el router bajo el prefijo '/api/v1/auth'
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/departamentos", depaRouter);

export default app;
