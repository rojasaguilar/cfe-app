// src/services/auth.service.js
import { api } from "../../../services/api.js";
import { updateEmpleadoSchema } from "../dtos/update.empleado.dto.js";
import { createEmpleadoSchema } from "./../dtos/create.empleado.dto.js";

export const getEmpleados = async () => {
  try {
    const response = await api.get("/empleados");
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const getEmpleado = async (empleadoId) => {
  try {
    const response = await api.get(`/empleados/${empleadoId}`);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const getBateriaByEmpleado = async (empleadoId) => {
  try {
    const response = await api.get(`/empleados/${empleadoId}/baterias`);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const createEmpleado = async (data) => {
  try {
    const resultData = createEmpleadoSchema.safeParse(data);

    if (!resultData.success) throw new Error(resultData.error);

    const response = await api.post("/empleados", resultData.data);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const assignEmpleado = async (empleadoId, plazaId) => {
  try {
    const response = await api.patch(`/empleados/${empleadoId}/assign`, {
      plazaId: plazaId,
    });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const deactivateDepartamento = async (departamentoId) => {
  try {
    const response = await api.delete(`/departamentos/${departamentoId}`);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const activateDepartamento = async (departamentoId) => {
  try {
    const response = await api.patch(`/departamentos/${departamentoId}`, {
      activo: true,
    });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const updateEmpleado = async (empeladoId,data) => {
  try {
    const resultData = updateEmpleadoSchema.safeParse(data);

    if (!resultData.success) throw new Error(resultData.error);

    const response = await api.patch(`/empleados/${empeladoId}`, resultData.data);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error de servidor, intenta de nuevo mas tarde",
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const getOrganigrama = async (departamentoId) => {
  try {
    const response = await api.get(
      `/departamentos/${departamentoId}/organigrama`,
    );
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};
