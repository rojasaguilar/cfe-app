import { z } from "zod";

export const createEmpleadoSchema = z
  .object({
    rpe: z
      .string()
      .length(5, { error: "RPE debe contar con una longitud de 5 caracteres" })
      .toLowerCase()
      .trim()
      .optional(),

    rtt: z
      .string()
      .length(5, { error: "RTT debe contar con una longitud de 5 caracteres" })
      .toLowerCase()
      .trim()
      .optional(),

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
  })
  .refine((data) => Boolean(data.rpe) !== Boolean(data.rtt), {
    message: "Debe proporcionar RPE o RTT, pero no ambos",
    path: ["rtt"],
  });
