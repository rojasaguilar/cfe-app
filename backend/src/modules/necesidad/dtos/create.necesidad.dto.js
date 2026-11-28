import { z } from "zod";

export const createNecesidadSchema = z.strictObject({
  tema: z
    .string()
    .trim()
    .min(1, "El tema de la necesidad es obligatorio"),
});