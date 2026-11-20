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

export const getEmpleado = catchAsync(async (req, res, next) => {
  const { empleadoId } = req.params;

  const empelado = await empleadoService.getEmpleado(empleadoId);

  res.status(200).json({
    success: true,
    data: empelado,
  });
});

export const getAllEmpleados = catchAsync(async (req, res, next) => {
  const params = req.query;

  const empleados = await empleadoService.getAllEmpleados(params);

  res.status(200).json({
    success: true,
    results: empleados.length,
    data: empleados,
  });
});

export const updateEmpleado = catchAsync(async (req, res, next) => {
  const { empleadoId } = req.params;

  const updatedEmpleado = await empleadoService.updateEmpleado(
    empleadoId,
    req.body,
  );

  res.status(200).json({
    success: true,
    data: updatedEmpleado,
  });
});

export const deleteEmpleado = catchAsync(async (req, res, next) => {
  const { empleadoId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await empleadoService.deleteEmpleado(empleadoId);

  res.status(200).json({
    success: true,
    message: "Empleado desactivado correctamente",
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
