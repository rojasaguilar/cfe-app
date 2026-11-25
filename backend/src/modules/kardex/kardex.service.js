import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";

export const getKardexFromEmpleado = async (empleadoId) => {
  if (!empleadoId) {
    throw new AppError(
      "kardex_service",
      "Por favor, ingresa el ID del empleado",
      400,
    );
  }

  const db = Database.getInstance();

  const empleadoExists = await db.query(
    `select * from empleado where empleadoid = $1`,
    [empleadoId],
  );

  if(empleadoExists.rowCount === 0)
    throw new AppError(
      "kardex_service",
      `Empleado con id: ${empleadoId} no existe`,
      404,
    );

  const kardex = await db.query(
    `
      SELECT
        e.empleadoid,
        e.rpe,
        c.cursoid,
        c.codigocurso,
        c.nombre AS nombreCurso,
        c.horaspracticas,
        c.horasteoria,
        c.tipocurso,
        ck.modalidad,
        c.generadc3,
        ck.fechainiciocurso,
        ck.fechaterminocurso,
        ck.calificacion,
        ck.estadocurso
      FROM kardex k
      INNER JOIN empleado e ON e.empleadoid = k.empleadoid
      LEFT JOIN cursokardex ck ON ck.kardexid = k.kardexid
      LEFT JOIN curso c ON c.cursoid = ck.cursoid
      WHERE e.empleadoid = $1
    `,
    [empleadoId],
  );

  if (kardex.rows.length === 0) {
    return null;
  }

  const { empleadoid, rpe } = kardex.rows[0];

  const cursos = kardex.rows
    .filter((row) => row.cursoid !== null)
    .map(({ empleadoid, rpe, ...curso }) => curso);

  return {
    empleadoid,
    rpe,
    cursos,
  };
};
