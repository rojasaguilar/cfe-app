import express from "express";
import * as puestoController from "./puesto.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("administrador"), puestoController.getAllPuestos)
  .post(restrictTo("administrador"), puestoController.createPuesto);

router
  .route("/:puestoId")
  .get(puestoController.getPuesto)
  .patch(restrictTo("administrador"), puestoController.updatePuesto)
  .delete(restrictTo("administrador"), puestoController.deletePuesto);

export default router;
