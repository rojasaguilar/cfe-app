// src/services/auth.service.js
import { api } from "./../../services/api.js";
import { createBateriaSchema } from "./dtos/createBateria.dto.js";
import { updateBateriaSchema } from "./dtos/updateBateria.dto.js";

export const getBaterias = async () => {
  try {
    const response = await api.get("/baterias");
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Error al obtener baterias, intenta mas tarde",
      );
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

export const createBateria = async (data) => {
  try {
    const resultData = createBateriaSchema.safeParse(data);

    if (!resultData.success) throw new Error(resultData.error);

    const response = await api.post("/baterias", resultData.data);
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

export const updateBateria = async (bateriaId, data) => {
  try {
    const resultData = updateBateriaSchema.safeParse(data);

    if (!resultData.success) throw new Error(resultData.error);

    const response = await api.patch(`/baterias/${bateriaId}`, resultData.data);
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
