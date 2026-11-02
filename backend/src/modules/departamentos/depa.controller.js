import catchAsync from "../../utils/catchAsync.js";
import { AppError } from "../../utils/error.js";
import * as depaService from "./depa.service.js";

// --- CREAR ---
export const createDepa = catchAsync(async (req, res, next) => {
  const data = req.body;

  // Solo enviamos el nombre, el ID lo genera PostgreSQL automáticamente
  const newDepa = await depaService.createDepa({
    nombre: data.nombre,
  });

  if (!newDepa) {
    throw new AppError(
      "Error al registrar departamento. Intenta más tarde",
      500,
    );
  }

  res.status(201).json({
    success: true,
    data: newDepa,
  });
});

// --- OBTENER UNO ---
export const getDepa = catchAsync(async (req, res, next) => {
  const { departamentoId } = req.params;

  const depa = await depaService.getDepa(departamentoId);

  res.status(200).json({
    success: true,
    data: depa,
  });
});

// --- OBTENER TODOS ---
export const getAllDepas = catchAsync(async (req, res, next) => {
  // Verificamos si en la URL mandaron ?incluirInactivos=true
  const params = req.query;

  const depas = await depaService.getAllDepas(params);

  res.status(200).json({
    success: true,
    results: depas.length,
    data: depas,
  });
});

// --- ACTUALIZAR ---
export const updateDepa = catchAsync(async (req, res, next) => {
  const { departamentoId } = req.params;
  const { nombre, activo } = req.body;

  const updatedDepa = await depaService.updateDepa(departamentoId, {
    nombre,
    activo,
  });

  res.status(200).json({
    success: true,
    data: updatedDepa,
  });
});

// --- ELIMINAR (Soft Delete) ---
export const deleteDepa = catchAsync(async (req, res, next) => {
  const { departamentoId } = req.params;

  // El servicio se encarga de cambiar el estatus 'activo' a false
  await depaService.deleteDepa(departamentoId);

  res.status(200).json({
    success: true,
    message: "Departamento desactivado correctamente",
    data: null, // Puedes devolver deletedDepa si el frontend necesita los datos actualizados
  });
});
