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
  const { nombrePuesto } = puestoData;

  if (!puestoId) {
    throw new AppError(
      "Por favor, proporciona el ID del puesto a actualizar.",
      400,
    );
  }

  if (nombrePuesto === undefined && activo === undefined) {
    throw new AppError(
      "Proporciona al menos un dato para actualizar.",
      400,
    );
  }

  const db = Database.getInstance();

  // 1. Verificar si el puesto existe
  const puesto = await db.query("SELECT * FROM puesto WHERE puestoId = $1", [
    puestoId,
  ]);

  if (puesto.rowCount === 0) {
    throw new AppError("El puesto que intentas actualizar no existe.", 404);
  }

  // 2. Preparar los datos dinámicamente usando coalescencia
  // Si no se envía un campo, se mantiene el que ya estaba en la BD
  const nuevoNombre = nombrePuesto
    ? nombrePuesto.toLowerCase().trim()
    : puesto.rows[0].nombrePuesto;
  const nuevoActivo = activo !== undefined ? activo : puesto.rows[0].activo;

  // 3. Verificar que el nuevo nombre no colisione con otro puesto
  if (nombrePuesto && nuevoNombre !== puesto.rows[0].nombrePuesto) {
    const nameExists = await db.query(
      "SELECT puestoId FROM puesto WHERE nombrePuesto = $1",
      [nuevoNombre],
    );
    if (nameExists.rowCount > 0) {
      throw new AppError("Ya existe otro puesto con ese nombrePuesto.", 400);
    }
  }

  // 4. Actualizar
  const updatedPuesto = await db.query(
    `UPDATE puesto 
     SET nombrePuesto = $1, activo = $2
     WHERE puestoId = $3 
     RETURNING *`,
    [nuevoNombre, nuevoActivo, puestoId],
  );

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
