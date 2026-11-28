// src/services/auth.service.js
import { api } from "./../../services/api.js";
import { AppError } from "./../../utils/AppError.js";
// import { updateEmpleadoSchema } from "../dtos/update.empleado.dto.js";
// import { createEmpleadoSchema } from "./../dtos/create.empleado.dto.js";

export const getPlanes = async () => {
  try {
    const response = await api.get("/planes");
    return response.data; // Devuelve el JSON de tu backend
  } catch (error) {
    if (error.response) {
      throw new AppError(
        "plan_servuce.js",
        error.response.data.message ||
          "Error al obtenere planes de capacitacion",
        error.response.data.statusCode,
      );
    }
    throw new Error("Error de conexión al servidor");
  }
};

// export const getEmpleado = async (empleadoId) => {
//   try {
//     const response = await api.get(`/empleados/${empleadoId}`);
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const getKardexEmpleado = async (empleadoId) => {
//   try {
//     const response = await api.get(`/empleados/${empleadoId}/kardex`);
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const getBateriaByEmpleado = async (empleadoId) => {
//   try {
//     const response = await api.get(`/empleados/${empleadoId}/baterias`);
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new AppError(
//         error.response.data.comingFrom,
//         error.response.data.error.message,
//         error.response.data.error.statusCode,
//       );
//     }
//     throw new AppError("server", "Error de conexión al servidor", 500);
//   }
// };

// export const createEmpleado = async (data) => {
//   try {
//     const resultData = createEmpleadoSchema.safeParse(data);

//     if (!resultData.success) throw new Error(resultData.error);

//     const response = await api.post("/empleados", resultData.data);
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const assignEmpleado = async (empleadoId, plazaId) => {
//   try {
//     const response = await api.patch(`/empleados/${empleadoId}/assign`, {
//       plazaId: plazaId,
//     });
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const deactivateDepartamento = async (departamentoId) => {
//   try {
//     const response = await api.delete(`/departamentos/${departamentoId}`);
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const activateDepartamento = async (departamentoId) => {
//   try {
//     const response = await api.patch(`/departamentos/${departamentoId}`, {
//       activo: true,
//     });
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const updateEmpleado = async (empeladoId, data) => {
//   try {
//     const resultData = updateEmpleadoSchema.safeParse(data);

//     if (!resultData.success) throw new Error(resultData.error);

//     const response = await api.patch(
//       `/empleados/${empeladoId}`,
//       resultData.data,
//     );
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new Error(
//         error.response.data.message ||
//           "Error de servidor, intenta de nuevo mas tarde",
//       );
//     }
//     throw new Error("Error de conexión al servidor");
//   }
// };

// export const getOrganigrama = async (departamentoId) => {
//   try {
//     const response = await api.get(
//       `/departamentos/${departamentoId}/organigrama`,
//     );
//     return response.data; // Devuelve el JSON de tu backend
//   } catch (error) {
//     if (error.response) {
//       throw new AppError(
//         error.response.data.comingFrom,
//         error.response.data.message,
//         error.response.data.statusCode,
//       );
//     }
//     throw new AppError("server", "Error de conexión al servidor", 500);
//   }
// };
