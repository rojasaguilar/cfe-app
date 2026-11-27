import { z } from "zod";

export const createPlanSchema = z
  .object({
    // fechaApertura: z
    //   .string()
    //   .date({ error: "La fecha de apertura debe tener formato YYYY-MM-DD" }),

    validoHasta: z
      .string()
      .date({ error: "La fecha de vigencia debe tener formato YYYY-MM-DD" }),
  })
  .refine((data) => new Date(data.validoHasta).getTime() > Date.now(), {
    message: "La fecha limite debe ser posterior a la fecha actual",
    path: ["validoHasta"],
  });
// .refine(
//   (data) => {
//     return data.fechaApertura < data.validoHasta;
//   },
//   {
//     message: "La fecha de apertura debe ser anterior a la fecha de vigencia",
//     path: ["fechaApertura"],
//   },
// );
