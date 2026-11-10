import express from "express";
import * as empleadoController from "./empleado.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";

import { validate } from "../../middlewares/validate.data.js";
import { createEmpleadoSchema } from "./dtos/create.empleado.dto.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("administrador"), empleadoController.getAllEmpleados)
  .post(
    restrictTo("administrador"),
    validate(createEmpleadoSchema),
    empleadoController.createEmpleado,
  );

// router
//   .route("/:empleadoId")
//   .get(empleadoController.getEmpleado)
//   .patch(restrictTo("administrador"), empleadoController.updateEmpleado)
//   .delete(restrictTo("administrador"), empleadoController.deleteEmpleado);

router.patch("/:empleadoId/assign", empleadoController.assignPlaza)

export default router;
