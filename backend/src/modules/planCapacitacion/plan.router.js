import express from "express";
import * as planController from "./plan.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.data.js";
import { createPlanSchema } from "./dtos/create.plan.dto.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(
    restrictTo("administrador", "jefe-departamento"),
    planController.getAllPlanes,
  )
  .post(
    restrictTo("administrador"),
    validate(createPlanSchema),
    planController.createPlan,
  );

// router
//   .route("/:planId")
//   .get(planController.getPlaza)
//   .patch(restrictTo("administrador"), planController.updatePlaza)
//   .delete(restrictTo("administrador"), planController.deletePlaza);

export default router;
