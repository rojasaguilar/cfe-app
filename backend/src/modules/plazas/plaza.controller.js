import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as plazaService from "./plaza.service.js";

// --- CREAR ---
export const createPlaza = catchAsync(async (req, res, next) => {
  const data = req.body;

  const newPlaza = await plazaService.createPlaza({
    noPlaza: data.noPlaza,
    puestoId: data.puestoId,
    departamentoId: data.departamentoId,
    plazaPadreId: data.plazaPadreId,
  });

  if (!newPlaza) {
    throw new AppError("Error al crear puesto. Intenta más tarde", 500);
  }

  res.status(201).json({
    success: true,
    data: newPlaza,
  });
});

// --- OBTENER UNO ---
export const getPlaza = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const puesto = await plazaService.getPlaza(puestoId);

  res.status(200).json({
    success: true,
    data: puesto,
  });
});

// --- OBTENER TODOS ---
export const getAllPlazas = catchAsync(async (req, res, next) => {
  const params = req.query;

  const puestos = await plazaService.getAllPuestos(params);

  res.status(200).json({
    success: true,
    results: puestos.length,
    data: puestos,
  });
});

// --- ACTUALIZAR ---
export const updatePlaza = catchAsync(async (req, res, next) => {
  const { plazaId } = req.params;

  const {
    noPlaza = null,
    puestoId = null,
    plazaPadreId = null,
  } = req.body ?? {};

  console.log(req.body);

  const updatedPlaza = await plazaService.updatePlaza(plazaId, {
    noPlaza,
    puestoId,
    plazaPadreId,
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
  await plazaService.deletePlaza(plazaId);

  res.status(200).json({
    success: true,
    message: "Plaza desactivado correctamente",
    data: null,
  });
});
