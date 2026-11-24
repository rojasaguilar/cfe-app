import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";

// --- CREAR (Create) ---
export const createEmpleado = async (empleadoData) => {
  const identificadorEmpleado = Object.hasOwn(empleadoData, "rpe")
    ? "rpe"
    : "rtt";

  console.log(identificadorEmpleado);
  const db = Database.getInstance();

  const newEmpleado = await db.query(
    `INSERT INTO empleado (${identificadorEmpleado}, nombres, apellidos, rfc, curp, fechanacimiento, estadocivil, domicilio, telefono, correo)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`,
    Object.values(empleadoData),
  );

  return newEmpleado.rows[0];
};

export const getEmpleado = async (empleadoId) => {
  if (!empleadoId)
    throw new AppError(
      "empleado_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const db = Database.getInstance();

  const empleado = await db.query(
    "SELECT * FROM empleado WHERE empleadoId = $1",
    [empleadoId],
  );

  if (empleado.rowCount === 0)
    throw new AppError("empleado_service", "El empleado no existe", 404);

  return empleado.rows[0];
};

export const getAllEmpleados = async (params = {}) => {
  const db = Database.getInstance();

  let baseQuery = "SELECT * FROM empleado";
  const conditions = [];
  const values = [];
  let paramCounter = 1;

  const camposPermitidos = ["nombrePuesto", "empleadoId", "activo"];

  // 3. Construcción dinámica de filtros
  for (const [key, value] of Object.entries(params)) {
    if (camposPermitidos.includes(key)) {
      // Si el campo es 'nombre', podríamos querer una búsqueda parcial (ILIKE) en vez de coincidencia exacta
      if (key === "nombre") {
        conditions.push(`${key} ILIKE $${paramCounter}`);
        values.push(`%${value}%`); // % permite buscar partes de la palabra
      } else {
        conditions.push(`${key} = $${paramCounter}`);
        values.push(value);
      }
      paramCounter++;
    }
  }

  if (conditions.length > 0) {
    baseQuery += " WHERE " + conditions.join(" AND ");
  }

  baseQuery += " ORDER BY nombres ASC";

  // 5. Ejecutar la consulta pasando el arreglo de valores de forma segura
  const empleados = await db.query(baseQuery, values);

  return empleados.rows;
};

const validarMinimo18Anios = (fechaStr) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(fechaStr).trim());
  if (!match) {
    throw new AppError(
      "empleado_service",
      "Formato de fecha de nacimiento inválido (se espera YYYY-MM-DD).",
      400,
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Verifica que la fecha calendarizada exista (ej. evita 2000-02-30)
  const fechaNac = new Date(Date.UTC(year, month - 1, day));
  if (
    fechaNac.getUTCFullYear() !== year ||
    fechaNac.getUTCMonth() !== month - 1 ||
    fechaNac.getUTCDate() !== day
  ) {
    throw new AppError(
      "empleado_service",
      "La fecha de nacimiento proporcionada no es válida.",
      400,
    );
  }

  const hoy = new Date();
  const limite18Anios = new Date(
    Date.UTC(hoy.getUTCFullYear() - 18, hoy.getUTCMonth(), hoy.getUTCDate()),
  );

  if (fechaNac > limite18Anios) {
    throw new AppError(
      "empleado_service",
      "El empleado debe tener al menos 18 años cumplidos.",
      400,
    );
  }
};

export const updateEmpleado = async (empleadoId, empleadoData) => {
  if (!empleadoId) {
    throw new AppError(
      "empleado_service",
      "Por favor, proporciona el ID del empleado a actualizar.",
      400,
    );
  }

  if (!empleadoData || Object.keys(empleadoData).length === 0) {
    throw new AppError(
      "empleado_service",
      "Por favor, proporciona un dato para actualizar.",
      400,
    );
  }

  const fechaNacimientoRaw =
    empleadoData.fechaNacimiento ?? empleadoData.fechanacimiento;

  if (fechaNacimientoRaw !== undefined && fechaNacimientoRaw !== null) {
    validarMinimo18Anios(fechaNacimientoRaw);
  }

  const db = Database.getInstance();

  const keys = Object.keys(empleadoData);
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const key of keys) {
    const columnName = key.toLowerCase();
    setClauses.push(`${columnName} = $${index}`);
    values.push(empleadoData[key]);
    index++;
  }

  values.push(empleadoId);

  const queryString = `
    UPDATE empleado
    SET ${setClauses.join(", ")}
    WHERE empleadoid = $${index}
    RETURNING *
  `;

  const updatedEmpleado = await db.query(queryString, values);

  if (updatedEmpleado.rowCount === 0) {
    throw new AppError(
      "empleado_service",
      "El empleado que intentas actualizar no existe.",
      404,
    );
  }

  return updatedEmpleado.rows[0];
};

export const deleteEmpleado = async (empleadoId) => {
  if (!empleadoId) {
    throw new AppError(
      "empleado_service",
      "Por favor, proporciona el ID del empleado a eliminar.",
      400,
    );
  }

  const db = Database.getInstance();

  const plazasActivasCheck = await db.query(
    `SELECT empleadoId 
     FROM empleado 
     WHERE empleadoId = $1 AND activo = true AND plazaId IS NOT NULL
     LIMIT 1`,
    [empleadoId],
  );

  if (plazasActivasCheck.rowCount > 0) {
    throw new AppError(
      "empleado_service",
      "No se puede desactivar este empleado porque actualmente está ocupando una plaza. Haz los cambios pertientes para poder desactivar",
      409,
    );
  }

  // Actualizamos el campo 'activo' a false en lugar de hacer un DELETE FROM
  const deletedEmpleado = await db.query(
    `UPDATE empleado 
     SET activo = false 
     WHERE empleadoId = $1 
     RETURNING *`,
    [empleadoId],
  );

  if (deletedEmpleado.rowCount === 0) {
    throw new AppError("El empleado no existe o ya fue eliminado.", 404);
  }

  return deletedEmpleado.rows[0];
};

export const assignPlaza = async (empleadoId, plazaId) => {
  if (!plazaId) {
    throw new AppError(
      "empleado_service",
      "Por favor, proporciona el ID de la plaza a asignar.",
      400,
    );
  }

  const db = Database.getInstance();

  const isPlazaDesactivada = await db.query(
    `SELECT plazaId 
     FROM plaza 
     WHERE plazaId = $1 AND activo = false 
     LIMIT 1`,
    [plazaId],
  );

  if (isPlazaDesactivada.rowCount > 0) {
    throw new AppError(
      "empleado_service",
      "No se puede asignar esta plaza porque está desactivada",
    );
  }

  // Actualizamos el campo 'activo' a false en lugar de hacer un DELETE FROM
  const empleadoAssigned = await db.query(
    `UPDATE empleado 
     SET plazaId = $1 
     WHERE empleadoId = $2 
     RETURNING *`,
    [plazaId, empleadoId],
  );

  if (empleadoAssigned.rowCount === 0) {
    throw new AppError("El puesto no existe o ya fue eliminado.", 404);
  }

  return empleadoAssigned.rows[0];
};
