import express from "express";
import * as cursoController from "./curso.controller.js";
import { protect, restrictTo } from "../auth/auth.controller.js";
import { validate } from "./../../middlewares/validate.data.js";
import { createCursoSchema } from "./dtos/curso.dto.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("administrador"), cursoController.getAllCursos)
  .post(
    restrictTo("administrador"),
    validate(createCursoSchema),
    cursoController.createCurso,
  );

router
  .route("/:puestoId")
  .get(cursoController.getCurso)
  .patch(restrictTo("administrador"), cursoController.updateCurso)
  .delete(restrictTo("administrador"), cursoController.deleteCurso);

export default router;
