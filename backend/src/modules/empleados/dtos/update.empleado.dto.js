import { z } from "zod";

export const baseEmpleado = z.object({
  nombres: z
    .string()
    .min(3, { error: "Los nombres deben tener al menos 3 caracteres" })
    .max(56, {
      error: "Los nombres pueden tener un máximo de 56 caracteres",
    })
    .toLowerCase()
    .trim(),

  apellidos: z
    .string()
    .min(6, { error: "Los apellidos deben tener al menos 6 caracteres" })
    .max(56, {
      error: "Los apellidos pueden tener un máximo de 56 caracteres",
    })
    .toLowerCase()
    .trim(),

  rfc: z
    .string()
    .min(12, { error: "Formato de RFC incorrecto" })
    .max(13, { error: "Formato de RFC incorrecto" })
    .toUpperCase(),

  curp: z
    .string()
    .length(18, { error: "Formato de CURP incorrecto" })
    .toUpperCase(),
  // activo: z.boolean(),
});

export const updateEmpleadoSchema = baseEmpleado
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Por favor, proporciona al menos un dato válido para actualizar.",
  });
