import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./modules/auth/auth.router.js";
import depaRouter from "./modules/departamentos/depa.router.js";
import globalErrorHandler from "./middlewares/error.handler.js";

import envVars from "./config/config.dotenv.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    //   origin: 'envVars.FRONTEND_URL', // La URL exacta de tu frontend en Vite
    credentials: true, // Permite el paso de cookies
  }),
);

// Montar el router bajo el prefijo '/api/v1/auth'
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/departamentos", depaRouter);

app.use(globalErrorHandler);

export default app;
