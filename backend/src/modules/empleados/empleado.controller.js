import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as empleadoService from "./empleado.service.js";

// --- CREAR ---
export const createEmpleado = catchAsync(async (req, res, next) => {
  const data = req.body;

  console.log(data);

  // // Solo enviamos el nombre, el ID lo genera PostgreSQL automáticamente
  const newEmpleado = await empleadoService.createEmpleado(data);

  if (!newEmpleado) {
    throw new AppError(
      "empleado_service",
      "Error al crear empleado. Intenta más tarde",
      500,
    );
  }

  res.status(201).json({
    success: true,
    data: newEmpleado,
  });
});

// --- OBTENER UNO ---
export const getPuesto = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const puesto = await empleadoService.getPuesto(puestoId);

  res.status(200).json({
    success: true,
    data: puesto,
  });
});

// --- OBTENER TODOS ---
export const getAllEmpleados = catchAsync(async (req, res, next) => {
  const params = req.query;

  const empleados = await empleadoService.getAllEmpleados(params);

  res.status(200).json({
    success: true,
    results: empleados.length,
    data: empleados,
  });
});

// --- ACTUALIZAR ---
export const updatePuesto = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  const updatedPuesto = await empleadoService.updatePuesto(puestoId, req.body);

  res.status(200).json({
    success: true,
    data: updatedPuesto,
  });
});

// --- ELIMINAR (Soft Delete) ---
export const deletePuesto = catchAsync(async (req, res, next) => {
  const { puestoId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await empleadoService.deletePuesto(puestoId);

  res.status(200).json({
    success: true,
    message: "Puesto desactivado correctamente",
    data: null,
  });
});

export const assignPlaza = catchAsync(async (req, res, next) => {
  const { empleadoId } = req.params;
  const { plazaId } = req.body;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await empleadoService.assignPlaza(empleadoId, plazaId);

  res.status(200).json({
    success: true,
    message: "Plaza asignada correctamente",
    data: null,
  });
});
