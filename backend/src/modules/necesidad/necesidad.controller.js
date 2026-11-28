import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as necesidadService from "./necesidad.service.js";

// --- CREAR ---
export const createNecesidad = catchAsync(async (req, res, next) => {
  const data = req.body;
  // console.log(req.user);

  const {empleadoid} = req.user

  const newNecesidad = await necesidadService.createNecesidad(data, empleadoid);

  if (!newNecesidad) {
    throw new AppError(
      "plan_controller",
      "Error al crear puesto. Intenta más tarde",
      500,
    );
  }

  res.status(201).json({
    success: true,
    data: newNecesidad,
  });
});

// --- OBTENER UNO ---
export const getPlaza = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const puesto = await necesidadService.getPlaza(puestoId);

  res.status(200).json({
    success: true,
    data: puesto,
  });
});

// --- OBTENER TODOS ---
export const getAllPlanes = catchAsync(async (req, res, next) => {
  const params = req.query;

  const planes = await necesidadService.getAllPlanes(params);

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

  const updatedPlaza = await necesidadService.updatePlaza(plazaId, {
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
  await necesidadService.deletePlaza(plazaId);

  res.status(200).json({
    success: true,
    message: "Plaza desactivado correctamente",
    data: null,
  });
});
