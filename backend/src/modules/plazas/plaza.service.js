import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";

import { getDepa } from "./../departamentos/depa.service.js";
import { getPuesto } from "./../puestos/puesto.service.js";

// --- CREAR (Create) ---
export const createPlaza = async (plazaData) => {
  const {
    noPlaza,
    puestoId,
    departamentoId,
    plazaPadreId = null,
  } = plazaData ?? {};

  await getPuesto(puestoId);

  await getDepa(departamentoId);

  if (plazaPadreId) await getPlaza(plazaPadreId);

  if (!noPlaza || !puestoId || !departamentoId)
    throw new AppError(
      "plaza_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const db = Database.getInstance();

  const newPlaza = await db.query(
    `INSERT INTO plaza (noPlaza, puestoId, departamentoId, plazaPadreId)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [noPlaza, puestoId, departamentoId, plazaPadreId],
  );

  return newPlaza.rows[0];
};

// --- LEER UNO (Read) ---
export const getPlaza = async (plazaId) => {
  if (!plazaId)
    throw new AppError(
      "plaza_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const db = Database.getInstance();

  const plaza = await db.query("SELECT * FROM plaza WHERE plazaId = $1", [
    plazaId,
  ]);

  if (plaza.rowCount === 0)
    throw new AppError("plaza_service", "El puesto no existe", 404);

  return plaza.rows[0];
};

export const getAllPlazas = async (params = {}) => {
  const db = Database.getInstance();

  let baseQuery = "SELECT * FROM plaza";
  const conditions = [];
  const values = [];
  let paramCounter = 1;

  const camposPermitidos = ["noPlaza", "puestoId", "activo", "departamentoId"];

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

  baseQuery += " ORDER BY nombre ASC";

  // 5. Ejecutar la consulta pasando el arreglo de valores de forma segura
  const plazas = await db.query(baseQuery, values);

  return plazas.rows;
};

// --- ACTUALIZAR (Update) ---
export const updatePlaza = async (plazaId, plazaData) => {
  if (!plazaId) {
    throw new AppError(
      "plaza_service",
      "Por favor, proporciona los datos para actualizar.",
      400,
    );
  }

  if (!plazaData) {
    throw new AppError(
      "plaza_service",
      "Proporciona al menos un dato para actualizar.",
      400,
    );
  }

  // 1. Extraemos los campos permitidos del objeto entrante
  const { noPlaza, puestoId, plazaPadreId } = plazaData;
  const fieldsToUpdate = {};

  // 2. Filtramos: Si es null o undefined, lo ignoramos por completo
  if (noPlaza != null) fieldsToUpdate.noPlaza = noPlaza;
  if (puestoId != null) fieldsToUpdate.puestoId = puestoId;
  // if (plazaPadreId != null) 
  fieldsToUpdate.plazaPadreId = plazaPadreId;

  const keys = Object.keys(fieldsToUpdate);

  // Verificamos que quede al menos un campo válido para no romper la consulta SQL
  if (keys.length === 0) {
    throw new AppError(
      "plaza_service",
      "No hay campos válidos (no nulos) para actualizar.",
      400,
    );
  }

  // 3. Construimos el query dinámico y el arreglo de values limpio
  const setClauses = [];
  const values = [];
  let index = 1;

  for (const key of keys) {
    // Si tus columnas requieren comillas por el camelCase, usa: `"${key}" = $${index}`
    setClauses.push(`${key} = $${index}`);
    values.push(fieldsToUpdate[key]);
    index++;
  }

  // Agregamos el plazaId como el último parámetro para el WHERE
  values.push(plazaId);

  console.log(setClauses, values);
  const queryString = `
    UPDATE plaza 
    SET ${setClauses.join(", ")}
    WHERE "plazaid" = $${index} 
    RETURNING *
  `;
  console.log(queryString)

  const db = Database.getInstance();

  // 4. Ejecutamos la actualización
  const updatedPlaza = await db.query(queryString, values);

  if (updatedPlaza.rowCount === 0) {
    throw new AppError(
      "plaza_service",
      "La plaza que intentas actualizar no existe.",
      404,
    );
  }

  return updatedPlaza.rows[0];
};

// --- ELIMINAR LÓGICAMENTE (Soft Delete) ---
export const deletePlaza = async (plazaId) => {
  if (!plazaId) {
    throw new AppError(
      "Por favor, proporciona el ID de la plaza eliminar.",
      400,
    );
  }

  const db = Database.getInstance();

  const deletedPlaza = await db.query(
    `UPDATE plaza 
     SET activo = false 
     WHERE plazaId = $1 
     RETURNING *`,
    [plazaId],
  );

  if (deletedPlaza.rowCount === 0) {
    throw new AppError("La plaza ya no existe o ya fue eliminada.", 404);
  }

  return deletedPlaza.rows[0];
};
