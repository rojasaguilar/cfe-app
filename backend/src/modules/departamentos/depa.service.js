import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";

// --- CREAR (Create) ---
export const createDepa = async (depaData) => {
  const { nombre } = depaData;

  if (!nombre)
    throw new AppError(
      "depa_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const formatedName = nombre.toLowerCase().trim();
  const db = Database.getInstance();

  const depaExists = await db.query(
    "SELECT departamentoId FROM departamento WHERE nombre = $1",
    [formatedName],
  );

  if (depaExists.rowCount > 0)
    throw new AppError("depa_service", "El departamento no existe", 404);

  const newDepa = await db.query(
    `INSERT INTO departamento (nombre)
     VALUES ($1)
     RETURNING *`, // Devuelve todos los campos (incluyendo 'activo')
    [formatedName],
  );

  return newDepa.rows[0];
};

// --- LEER UNO (Read) ---
export const getDepa = async (departamentoId) => {
  if (!departamentoId)
    throw new AppError(
      "depa_service",
      "Por favor, ingresa todos los campos",
      404,
    );

  const db = Database.getInstance();

  const depa = await db.query(
    "SELECT * FROM departamento WHERE departamentoId = $1",
    [departamentoId],
  );

  if (depa.rowCount === 0)
    throw new AppError("depa_service", "El departamento no existe", 404);

  return depa.rows[0];
};

export const getAllDepas = async (params = {}) => {
  const db = Database.getInstance();

  let baseQuery = "SELECT * FROM departamento";
  const conditions = [];
  const values = [];
  let paramCounter = 1; // Contador para $1, $2, $3...

  const camposPermitidos = ["nombre", "departamentoId", "activo"];

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
  const depas = await db.query(baseQuery, values);

  return depas.rows;
};

// --- ACTUALIZAR (Update) ---
export const updateDepa = async (departamentoId, depaData) => {
  const { nombre, activo } = depaData;

  if (!departamentoId) {
    throw new AppError(
      "Por favor, proporciona el ID del departamento a actualizar.",
      400,
    );
  }

  if (nombre === undefined && activo === undefined) {
    throw new AppError(
      "Proporciona al menos un dato (nombre o activo) para actualizar.",
      400,
    );
  }

  const db = Database.getInstance();

  // 1. Verificar si el departamento existe
  const depa = await db.query(
    "SELECT * FROM departamento WHERE departamentoId = $1",
    [departamentoId],
  );

  if (depa.rowCount === 0) {
    throw new AppError(
      "El departamento que intentas actualizar no existe.",
      404,
    );
  }

  // 2. Preparar los datos dinámicamente usando coalescencia
  // Si no se envía un campo, se mantiene el que ya estaba en la BD
  const nuevoNombre = nombre
    ? nombre.toLowerCase().trim()
    : depa.rows[0].nombre;
  const nuevoActivo = activo !== undefined ? activo : depa.rows[0].activo;

  // 3. Verificar que el nuevo nombre no colisione con otro departamento
  if (nombre && nuevoNombre !== depa.rows[0].nombre) {
    const nameExists = await db.query(
      "SELECT departamentoId FROM departamento WHERE nombre = $1",
      [nuevoNombre],
    );
    if (nameExists.rowCount > 0) {
      throw new AppError("Ya existe otro departamento con ese nombre.", 400);
    }
  }

  // 4. Actualizar
  const updatedDepa = await db.query(
    `UPDATE departamento 
     SET nombre = $1, activo = $2
     WHERE departamentoId = $3 
     RETURNING *`,
    [nuevoNombre, nuevoActivo, departamentoId],
  );

  return updatedDepa.rows[0];
};

// --- ELIMINAR LÓGICAMENTE (Soft Delete) ---
export const deleteDepa = async (departamentoId) => {
  if (!departamentoId) {
    throw new AppError(
      "Por favor, proporciona el ID del departamento a eliminar.",
      400,
    );
  }

  const db = Database.getInstance();

  // Actualizamos el campo 'activo' a false en lugar de hacer un DELETE FROM
  const deletedDepa = await db.query(
    `UPDATE departamento 
     SET activo = false 
     WHERE departamentoId = $1 
     RETURNING *`,
    [departamentoId],
  );

  if (deletedDepa.rowCount === 0) {
    throw new AppError("El departamento no existe o ya fue eliminado.", 404);
  }

  return deletedDepa.rows[0];
};
