// src/services/auth.service.js
import { api } from "../../services/api.js";

export const createPuesto = async (nombrePuesto) => {
  try {
    const response = await api.post("/puestos", { nombrePuesto });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const getPuestos = async () => {
  try {
    const response = await api.get("/puestos");
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const updatePuesto = async (puestoId, data) => {
  try {
    const response = await api.patch(`/puestos/${puestoId}`, data);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const deactivatePuesto = async (puestoId) => {
  try {
    const response = await api.delete(`/puestos/${puestoId}`);
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};
