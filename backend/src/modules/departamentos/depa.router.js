import express from "express";
import * as depaController from "./depa.controller.js";

const router = express.Router();

router
  .route("/")
  .get(depaController.getAllDepas)
  .post(depaController.createDepa);

router
  .route("/:departamentoId")
  .get(depaController.getDepa)
  .patch(depaController.updateDepa)
  .delete(depaController.deleteDepa);

export default router;
