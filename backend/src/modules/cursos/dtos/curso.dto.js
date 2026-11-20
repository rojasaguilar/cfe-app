import { z } from "zod";

export const createCursoSchema = z
  .object({
    codigoCurso: z
      .string({
        required_error: "El código del curso es obligatorio",
        invalid_type_error: "El código del curso debe ser un texto",
      })
      .trim()
      .min(5, { message: "El código del curso debe tener al menos 5 caracteres" })
      .max(40, { message: "El código del curso no debe tener más de 40 caracteres" })
      .toLowerCase(),

    nombre: z
      .string({
        required_error: "El nombre del curso es obligatorio",
        invalid_type_error: "El nombre del curso debe ser un texto",
      })
      .trim()
      .min(10, { message: "El nombre del curso debe tener al menos 10 caracteres" })
      .max(200, { message: "El nombre del curso no debe tener más de 200 caracteres" })
      .toLowerCase(),

    horasPracticas: z
      .number({
        required_error: "Las horas prácticas son obligatorias",
        invalid_type_error: "Las horas prácticas deben ser un número",
      })
      .min(0, { message: "Las horas prácticas no pueden ser negativas" })
      .max(40, { message: "Las horas prácticas no pueden superar las 40 horas" }),

    horasTeoria: z
      .number({
        required_error: "Las horas de teoría son obligatorias",
        invalid_type_error: "Las horas de teoría deben ser un número",
      })
      .min(0, { message: "Las horas de teoría no pueden ser negativas" })
      .max(40, { message: "Las horas de teoría no pueden superar las 40 horas" }),

    generaDC3: z.boolean({
      required_error: "Debes indicar si genera DC-3",
      invalid_type_error: "El campo generaDC3 debe ser booleano",
    }),
  })
  .refine(
    (data) => data.horasPracticas + data.horasTeoria > 0,
    {
      message: "El curso debe tener al menos 1 hora de duración en total",
      path: ["horasTeoria"],
    }
  )
  .refine(
    (data) => data.horasPracticas + data.horasTeoria <= 40,
    {
      message: "El curso no puede durar más de 40 horas en total",
      path: ["horasTeoria"],
    }
  );