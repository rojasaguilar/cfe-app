import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as planService from "./plan.service.js";

// --- CREAR ---
export const createPlan = catchAsync(async (req, res, next) => {
  const data = req.body;

  const newPlan = await planService.createPlan(data);

  if (!newPlan) {
    throw new AppError(
      "plan_controller",
      "Error al crear puesto. Intenta más tarde",
      500,
    );
  }

  res.status(201).json({
    success: true,
    data: newPlan,
  });
});

// --- OBTENER UNO ---
export const getPlaza = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const puesto = await planService.getPlaza(puestoId);

  res.status(200).json({
    success: true,
    data: puesto,
  });
});

// --- OBTENER TODOS ---
export const getAllPlanes = catchAsync(async (req, res, next) => {
  const params = req.query;

  const planes = await planService.getAllPlanes(params);

  res.status(200).json({
    success: true,
    results: planes.length,
    data: planes,
  });
});

// --- ACTUALIZAR ---
export const updatePlaza = catchAsync(async (req, res, next) => {
  const { plazaId } = req.params;

  const {
    noplaza = null,
    puestoid = null,
    plazapadreid = null,
    activo = null,
  } = req.body ?? {};

  console.log(req.body);

  const updatedPlaza = await planService.updatePlaza(plazaId, {
    noplaza,
    puestoid,
    plazapadreid,
    activo,
  });

  res.status(200).json({
    success: true,
    data: updatedPlaza,
  });
});

// --- ELIMINAR (Soft Delete) ---
export const deletePlaza = catchAsync(async (req, res, next) => {
  const { plazaId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await planService.deletePlaza(plazaId);

  res.status(200).json({
    success: true,
    message: "Plaza desactivado correctamente",
    data: null,
  });
});
