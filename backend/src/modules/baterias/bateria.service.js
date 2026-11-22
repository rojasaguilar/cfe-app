import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";

export const createBateria = async (bateriaData) => {
  const db = Database.getInstance();

  return db.transaction(async (client) => {
    const newBateriaRes = await db.query(
      `INSERT INTO bateria ("puestoid", "departamentoid")
       VALUES ($1, $2)
       RETURNING *`,
      [bateriaData.puestoId, bateriaData.departamentoId],
      client,
    );

    if (newBateriaRes.rowCount === 0) {
      throw new AppError("bateria_service", "Error al crear batería.", 500);
    }

    const bateriaCreada = newBateriaRes.rows[0];
    // Ajusta a bateriaCreada.bateriaid o bateriaCreada.bateriaId según tu columna en Postgres
    const bateriaId = bateriaCreada.bateriaid ?? bateriaCreada.bateriaId;

    const cursosResults = await Promise.all(
      bateriaData.cursos.map((curso) =>
        db.query(
          `INSERT INTO curso_bateria ("bateriaid", "cursoid")
           VALUES ($1, $2)
           RETURNING *`,
          [bateriaId, curso.cursoId],
          client,
        ),
      ),
    );

    const cursosInsertados = cursosResults.flatMap((res) => res.rows);

    if (cursosInsertados.length !== bateriaData.cursos.length) {
      throw new AppError(
        "bateria_service",
        "No se pudieron asociar todos los cursos a la batería.",
        500,
      );
    }
    console.log(bateriaCreada);
    return bateriaCreada;
  });
};

// --- LEER UNO (Read) ---
// export const getPuesto = async (puestoId) => {
//   if (!puestoId)
//     throw new AppError(
//       "puesto_service",
//       "Por favor, ingresa todos los campos",
//       404,
//     );

//   const db = Database.getInstance();

//   const depa = await db.query("SELECT * FROM puesto WHERE puestoId = $1", [
//     puestoId,
//   ]);

//   if (depa.rowCount === 0)
//     throw new AppError("puesto_service", "El puesto no existe", 404);

//   return depa.rows[0];
// };

const COLUMN_MAP = {
  bateriaId: "b.bateriaid",
  puestoId: "b.puestoid",
  departamentoId: "b.departamentoid",
  activo: "b.activo",
};

export const getAllBaterias = async (params = {}) => {
  const db = Database.getInstance();

  let baseQuery = `
    SELECT
      b.bateriaid,
      b.puestoid,
      p.nombrepuesto,
      b.departamentoid,
      d.nombre AS nombredepartamento
    FROM bateria b
    INNER JOIN puesto p ON p.puestoid = b.puestoid
    INNER JOIN departamento d ON d.departamentoid = b.departamentoid
  `;

  const conditions = [];
  const values = [];
  let paramCounter = 1;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Object.prototype.hasOwnProperty.call(COLUMN_MAP, key)) {
      conditions.push(`${COLUMN_MAP[key]} = $${paramCounter}`);
      values.push(value);
      paramCounter++;
    } else if (key === "nombre") {
      conditions.push(`d.nombre ILIKE $${paramCounter}`);
      values.push(`%${value}%`);
      paramCounter++;
    }
  }

  if (conditions.length > 0) {
    baseQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  const { rows: baterias } = await db.query(baseQuery, values);

  if (baterias.length === 0) {
    return [];
  }

  const bateriaIds = baterias.map((b) => b.bateriaid);

  const { rows: cursosRows } = await db.query(
    `
      SELECT
        cb.bateriaid,
        cb.cursoid AS "cursoId",
        c.codigocurso AS "codigoCurso",
        c.nombre AS "nombreCurso",
        c.horaspracticas AS "horasPracticas",
        c.horasteoria AS "horasTeoria",
        c.generadc3 AS "generaDC3",
        c.activo AS "activoCurso"
      FROM curso_bateria cb
      INNER JOIN curso c ON cb.cursoid = c.cursoid
      WHERE cb.bateriaid = ANY($1::uuid[])
      ORDER BY c.nombre ASC
    `,
    [bateriaIds],
  );

  const cursosPorBateria = new Map();
  for (const row of cursosRows) {
    const { bateriaid, ...cursoData } = row;
    if (!cursosPorBateria.has(bateriaid)) {
      cursosPorBateria.set(bateriaid, []);
    }
    cursosPorBateria.get(bateriaid).push(cursoData);
  }

  return baterias.map((bateria) => ({
    ...bateria,
    cursos: cursosPorBateria.get(bateria.bateriaid) ?? [],
  }));
};

export const getBateria = async (bateriaId) => {
  const db = Database.getInstance();

  let baseQuery = `
    SELECT
      b.bateriaid,
      b.puestoid,
      p.nombrepuesto,
      b.departamentoid,
      d.nombre AS nombredepartamento
    FROM bateria b
    INNER JOIN puesto p ON p.puestoid = b.puestoid
    INNER JOIN departamento d ON d.departamentoid = b.departamentoid
  `;

  const conditions = [];
  const values = [];
  let paramCounter = 1;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;

    if (Object.prototype.hasOwnProperty.call(COLUMN_MAP, key)) {
      conditions.push(`${COLUMN_MAP[key]} = $${paramCounter}`);
      values.push(value);
      paramCounter++;
    } else if (key === "nombre") {
      conditions.push(`d.nombre ILIKE $${paramCounter}`);
      values.push(`%${value}%`);
      paramCounter++;
    }
  }

  if (conditions.length > 0) {
    baseQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  ((baseQuery += ` WHERE bateriaid = $1`), [bateriaId]);

  const { rows: baterias } = await db.query(baseQuery, values);

  if (baterias.length === 0) {
    return [];
  }

  const bateriaIds = baterias.map((b) => b.bateriaid);

  const { rows: cursosRows } = await db.query(
    `
      SELECT
        cb.bateriaid,
        cb.cursoid AS "cursoId",
        c.codigocurso AS "codigoCurso",
        c.nombre AS "nombreCurso",
        c.horaspracticas AS "horasPracticas",
        c.horasteoria AS "horasTeoria",
        c.generadc3 AS "generaDC3",
        c.activo AS "activoCurso"
      FROM curso_bateria cb
      INNER JOIN curso c ON cb.cursoid = c.cursoid
      WHERE cb.bateriaid = ANY($1::uuid[])
      ORDER BY c.nombre ASC
    `,
    [bateriaIds],
  );

  const cursosPorBateria = new Map();
  for (const row of cursosRows) {
    const { bateriaid, ...cursoData } = row;
    if (!cursosPorBateria.has(bateriaid)) {
      cursosPorBateria.set(bateriaid, []);
    }
    cursosPorBateria.get(bateriaid).push(cursoData);
  }

  return baterias.map((bateria) => ({
    ...bateria,
    cursos: cursosPorBateria.get(bateria.bateriaid) ?? [],
  }));
};

export const getBateriasByPlaza = async (empleadoId) => {
  const db = Database.getInstance();

  const plazaExists = await db.query(
    `SELECT plazaId FROM empleado WHERE empleadoid = $1`,
    [empleadoId],
  );

  const plazaId = plazaExists.rows[0].plazaid;

  console.log(plazaId);

  // if (!plazaId.rows[0])
  //   throw new AppError(
  //     `bateria_service`,
  //     "No se tiene asignada una plaza para este trabajador",
  //     400,
  //   );

  let queryToGetPuestoId = `
    SELECT puestoId, departamentoid FROM plaza WHERE plazaid=$1
  `;

  const res = await db.query(queryToGetPuestoId, [plazaId]);

  const { puestoid, departamentoid } = res.rows[0];

  let qq = `
    SELECT * FROM bateria WHERE puestoid=$1 AND departamentoid=$2
  `;

  const res2 = await db.query(qq, [puestoid, departamentoid]);
  console.log(res2.rows);
  // const baterias await
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
