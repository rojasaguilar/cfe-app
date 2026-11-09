import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";

// --- CREAR (Create) ---
export const createPuesto = async (puestoData) => {
  const { nombrePuesto } = puestoData;

  if (!nombrePuesto)
    throw new AppError(
      "puesto_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const formatedName = nombrePuesto.toLowerCase().trim();
  const db = Database.getInstance();

  const puestoExists = await db.query(
    "SELECT puestoId FROM puesto WHERE nombrePuesto = $1",
    [formatedName],
  );

  if (puestoExists.rowCount > 0)
    throw new AppError(
      "puesto_service",
      "No puede haber dos puestos con el mismo nombre",
      404,
    );

  const newPuesto = await db.query(
    `INSERT INTO puesto (nombrePuesto)
     VALUES ($1)
     RETURNING *`,
    [formatedName],
  );

  return newPuesto.rows[0];
};

// --- LEER UNO (Read) ---
export const getPuesto = async (puestoId) => {
  if (!puestoId)
    throw new AppError(
      "puesto_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const db = Database.getInstance();

  const depa = await db.query("SELECT * FROM puesto WHERE puestoId = $1", [
    puestoId,
  ]);

  if (depa.rowCount === 0)
    throw new AppError("puesto_service", "El puesto no existe", 404);

  return depa.rows[0];
};

export const getAllPuestos = async (params = {}) => {
  const db = Database.getInstance();

  let baseQuery = "SELECT * FROM puesto";
  const conditions = [];
  const values = [];
  let paramCounter = 1;

  const camposPermitidos = ["nombrePuesto", "puestoId", "activo"];

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

  baseQuery += " ORDER BY nombrePuesto ASC";

  // 5. Ejecutar la consulta pasando el arreglo de valores de forma segura
  const puestos = await db.query(baseQuery, values);

  return puestos.rows;
};

// --- ACTUALIZAR (Update) ---
export const updatePuesto = async (puestoId, puestoData) => {
  // Extraemos ambos campos. Usamos ?? {} por si puestoData es undefined
  const { nombrePuesto, activo } = puestoData ?? {};

  if (!puestoId) {
    throw new AppError(
      "Por favor, proporciona el ID del puesto a actualizar.",
      400,
    );
  }

  // Verificamos si ambos son nulos o undefined
  if (nombrePuesto == null && activo == null) {
    throw new AppError(
      "puesto_service",
      "Proporciona al menos un dato para actualizar.",
      400,
    );
  }

  const db = Database.getInstance();
  const fieldsToUpdate = {};

  // 1. Procesar y validar nombrePuesto (solo si se envió)
  if (nombrePuesto != null) {
    const nuevoNombre = nombrePuesto.toLowerCase().trim();

    // Verificar que el nuevo nombre no colisione con OTRO puesto
    const nameExists = await db.query(
      `SELECT "puestoId" FROM puesto WHERE "nombrePuesto" = $1 AND "puestoId" != $2`,
      [nuevoNombre, puestoId],
    );

    if (nameExists.rowCount > 0) {
      throw new AppError(
        "puesto_service",
        "Ya existe otro puesto con ese nombre.",
        409,
      ); // 409 Conflict
    }

    fieldsToUpdate.nombrePuesto = nuevoNombre;
  }

  // 2. Procesar activo (solo si se envió)
  if (activo != null) {
    fieldsToUpdate.activo = activo;
  }

  // 3. Construir dinámicamente el SET y los Values
  const keys = Object.keys(fieldsToUpdate);
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const key of keys) {
    // Si tus tablas usan camelCase en Postgres, asegúralo con comillas: "${key}"
    // Si usas todo en minúsculas en tu BD, puedes quitarle las comillas
    setClauses.push(`"${key}" = $${index}`);
    values.push(fieldsToUpdate[key]);
    index++;
  }

  // Agregamos el puestoId al final de los values para el WHERE
  values.push(puestoId);

  const queryString = `
    UPDATE puesto 
    SET ${setClauses.join(", ")}
    WHERE "puestoid" = $${index} 
    RETURNING *
  `;

  // 4. Ejecutar actualización
  const updatedPuesto = await db.query(queryString, values);

  if (updatedPuesto.rowCount === 0) {
    throw new AppError("El puesto que intentas actualizar no existe.", 404);
  }

  return updatedPuesto.rows[0];
};

// --- ELIMINAR LÓGICAMENTE (Soft Delete) ---
export const deletePuesto = async (puestoId) => {
  if (!puestoId) {
    throw new AppError(
      "Por favor, proporciona el ID del puesto a eliminar.",
      400,
    );
  }

  const db = Database.getInstance();

  const plazasActivasCheck = await db.query(
    `SELECT plazaId 
     FROM plaza 
     WHERE puestoId = $1 AND activo = true 
     LIMIT 1`,
    [puestoId],
  );

  if (plazasActivasCheck.rowCount > 0) {
    throw new AppError(
      "puesto_service",
      "No se puede desactivar este puesto porque actualmente hay plazas activas que lo están utilizando. Haz los cambios pertientes para poder desactivar",
      409,
    );
  }

  // Actualizamos el campo 'activo' a false en lugar de hacer un DELETE FROM
  const deletedPuesto = await db.query(
    `UPDATE puesto 
     SET activo = false 
     WHERE puestoId = $1 
     RETURNING *`,
    [puestoId],
  );

  if (deletedPuesto.rowCount === 0) {
    throw new AppError("El puesto no existe o ya fue eliminado.", 404);
  }

  return deletedPuesto.rows[0];
};
