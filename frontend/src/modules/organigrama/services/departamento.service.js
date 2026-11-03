// src/services/auth.service.js
import { api } from "../../../services/api.js";

export const getDepartamentos = async () => {
  try {
    const response = await api.get("/departamentos");
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const createDepartamento = async (nombre) => {
  try {
    const response = await api.post("/departamentos", { nombre });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
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
      throw new Error(error.response.data.message || "Error al iniciar sesión");
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
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const updateDepartamento = async (departamentoId, data) => {
  try {
    const response = await api.patch(`/departamentos/${departamentoId}`, {
      data,
    });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};
