import express from "express";
import * as plazaController from "./plaza.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("administrador"), plazaController.getAllPlazas)
  .post(restrictTo("administrador"), plazaController.createPlaza);

router
  .route("/:plazaId")
  .get(plazaController.getPlaza)
  .patch(restrictTo("administrador"), plazaController.updatePlaza)
  .delete(restrictTo("administrador"), plazaController.deletePlaza);

export default router;
