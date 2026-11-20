import express from "express";
import * as bateriaController from "./bateria.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.data.js";
import { createBateriaSchema } from "./dtos/createBateria.dto.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("administrador"), bateriaController.getAllBaterias)
  .post(
    restrictTo("administrador"),
    validate(createBateriaSchema),
    bateriaController.createBateria,
  );

// router
//   .route("/:bateriaId")
//   .get(bateriaController.getBateria)
//   .patch(restrictTo("administrador"), bateriaController.updateBateria)
//   .delete(restrictTo("administrador"), bateriaController.deleteBateria);

export default router;
