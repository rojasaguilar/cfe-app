import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as puestoService from "./puesto.service.js";

// --- CREAR ---
export const createPuesto = catchAsync(async (req, res, next) => {
  const data = req.body;

  // Solo enviamos el nombre, el ID lo genera PostgreSQL automáticamente
  const newPuesto = await puestoService.createPuesto({
    nombrePuesto: data.nombrePuesto,
  });

  if (!newPuesto) {
    throw new AppError("Error al crear puesto. Intenta más tarde", 500);
  }

  res.status(201).json({
    success: true,
    data: newPuesto,
  });
});

// --- OBTENER UNO ---
export const getPuesto = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const puesto = await puestoService.getPuesto(puestoId);

  res.status(200).json({
    success: true,
    data: puesto,
  });
});

// --- OBTENER TODOS ---
export const getAllPuestos = catchAsync(async (req, res, next) => {
  const params = req.query;

  const puestos = await puestoService.getAllPuestos(params);

  res.status(200).json({
    success: true,
    results: puestos.length,
    data: puestos,
  });
});

// --- ACTUALIZAR ---
export const updatePuesto = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const updatedPuesto = await puestoService.updatePuesto(puestoId, req.body);

  res.status(200).json({
    success: true,
    data: updatedPuesto,
  });
});

// --- ELIMINAR (Soft Delete) ---
export const deletePuesto = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await puestoService.deletePuesto(puestoId);

  res.status(200).json({
    success: true,
    message: "Puesto desactivado correctamente",
    data: null,
  });
});
