import { api } from "../../services/api.js";

export const createPlaza = async (
  noplaza,
  puestoid,
  departamentoid,
  plazapadreid,
) => {
  try {
    const response = await api.post("/plazas", {
      noPlaza: noplaza,
      puestoId: puestoid,
      departamentoId: departamentoid,
      plazaPadreId: plazapadreid,
    });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

export const updatePlaza = async (plazaid, noplaza, puestoid, plazapadreid) => {
  try {
    const response = await api.patch(`/plazas/${plazaid}`, {
      noPlaza: noplaza,
      puestoId: puestoid,
      plazaPadreId: plazapadreid,
    });
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Error al iniciar sesión");
    }
    throw new Error("Error de conexión al servidor");
  }
};

// export const getPlazas = async () => {
//   try {
//     const response = await api.get("/puestos");
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.message || "Error al iniciar sesión");
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const loginService = async (email, password) => {
//   try {
//     const response = await api.post("/auth/login", {
//       email,
//       password,
//     });
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(error.response.data.message || "Error al iniciar sesión");
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const getMeService = async () => {
//   // No necesita try/catch aquí porque el Contexto manejará el error si falla (ej. si no hay sesión)
//   const response = await api.get("/auth/me");
//   return response.data.data;
// };
