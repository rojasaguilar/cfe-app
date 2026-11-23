import { z } from "zod";

const cursoItemSchema = z.object({
  cursoId: z.uuidv4({
    required_error: "Es necesario asignar un curso a una bateria",

    invalid_type_error: "formato invalido",
  }),
});

export const updateBateriaSchema = z.object({
  cursos: z
    .array(cursoItemSchema, {
      required_error: "Debes proporcionar el arreglo de cursos",
      invalid_type_error: "El campo cursos debe ser un arreglo",
    })
    .min(1, { message: "Debe incluir al menos un curso" }),
});
