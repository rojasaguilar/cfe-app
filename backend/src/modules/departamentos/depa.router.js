import express from "express";
import * as depaController from "./depa.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("administrador"), depaController.getAllDepas)
  .post(depaController.createDepa);

router
  .route("/:departamentoId")
  .get(depaController.getDepa)
  .patch(depaController.updateDepa)
  .delete(depaController.deleteDepa);

// router.get("/departamentoId/organigrama", depaController.getOrganigrama);

export default router;
