import express from "express";
import * as necesidadController from "./necesidad.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.data.js";
import { createNecesidadSchema } from "./dtos/create.necesidad.dto.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  // .get(
  //   restrictTo("administrador", "jefe-departamento"),
  //   necesidadController.getAllNecesidades,
  // )
  .post(
    restrictTo("administrador", "jefe-departamento"),
    validate(createNecesidadSchema),
    necesidadController.createNecesidad,
  );

// router
//   .route("/:necesidadId")
//   .get(necesidadController.getNecesidad)
//   .patch(restrictTo("administrador"), necesidadController.updateNecesidad)
//   .delete(restrictTo("administrador"), necesidadController.deleteNecesidad);

export default router;
