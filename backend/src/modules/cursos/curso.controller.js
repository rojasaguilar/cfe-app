import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as cursoService from "./curso.service.js";

// --- CREAR ---
export const createCurso = catchAsync(async (req, res, next) => {
  const data = req.body;

  // Solo enviamos el nombre, el ID lo genera PostgreSQL automáticamente
  const newCurso = await cursoService.createCurso({
    nombreCurso: data.nombreCurso,
  });

  if (!newCurso) {
    throw new AppError("Error al crear Curso. Intenta más tarde", 500);
  }

  res.status(201).json({
    success: true,
    data: newCurso,
  });
});

// --- OBTENER UNO ---
export const getCurso = catchAsync(async (req, res, next) => {
  const { CursoId } = req.params;

  const Curso = await cursoService.getCurso(CursoId);

  res.status(200).json({
    success: true,
    data: Curso,
  });
});

// --- OBTENER TODOS ---
export const getAllCursos = catchAsync(async (req, res, next) => {
  const params = req.query;

  const cursos = await cursoService.getAllCursos(params);

  res.status(200).json({
    success: true,
    results: cursos.length,
    data: cursos,
  });
});

// --- ACTUALIZAR ---
export const updateCurso = catchAsync(async (req, res, next) => {
  const { CursoId } = req.params;

  const updatedCurso = await cursoService.updateCurso(CursoId, req.body);

  res.status(200).json({
    success: true,
    data: updatedCurso,
  });
});

// --- ELIMINAR (Soft Delete) ---
export const deleteCurso = catchAsync(async (req, res, next) => {
  const { CursoId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await cursoService.deleteCurso(CursoId);

  res.status(200).json({
    success: true,
    message: "Curso desactivado correctamente",
    data: null,
  });
});
