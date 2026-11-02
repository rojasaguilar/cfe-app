import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./modules/auth/auth.router.js";
import depaRouter from "./modules/departamentos/depa.router.js";
import globalErrorHandler from "./middlewares/error.handler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Montar el router bajo el prefijo '/api/v1/auth'
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/departamentos", depaRouter);

app.use(globalErrorHandler);

export default app;
