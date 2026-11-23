import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as bateriaService from "./bateria.service.js";

// --- CREAR ---
export const createBateria = catchAsync(async (req, res, next) => {
  const data = req.body;

  const newBateria = await bateriaService.createBateria(data);

  if (!newBateria) {
    throw new AppError("Error al crear bateria. Intenta más tarde", 500);
  }

  res.status(201).json({
    success: true,
    data: newBateria,
  });
});

// --- OBTENER UNO ---
export const getBateria = catchAsync(async (req, res, next) => {
  const { bateriaId } = req.params;

  const puesto = await bateriaService.getPuesto(bateriaId);

  res.status(200).json({
    success: true,
    data: puesto,
  });
});

// --- OBTENER TODOS ---
export const getAllBaterias = catchAsync(async (req, res, next) => {
  const params = req.query;

  const baterias = await bateriaService.getAllBaterias(params);

  res.status(200).json({
    success: true,
    results: baterias.length,
    data: baterias,
  });
});

// --- ACTUALIZAR ---
export const updateBateria = catchAsync(async (req, res, next) => {
  const { bateriaId } = req.params;

  const updatedBateria = await bateriaService.updateBateriaCursos(
    bateriaId,
    req.body,
  );

  res.status(200).json({
    success: true,
    data: updatedBateria,
  });
});

// --- ELIMINAR (Soft Delete) ---
export const deletePuesto = catchAsync(async (req, res, next) => {
  const { bateriaId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await bateriaService.deletePuesto(bateriaId);

  res.status(200).json({
    success: true,
    message: "Puesto desactivado correctamente",
    data: null,
  });
});
