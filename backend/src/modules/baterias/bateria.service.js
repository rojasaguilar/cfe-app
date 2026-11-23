import { Database } from "../../config/Database.js";
import { AppError } from "../../utils/error.js";
import { getPlaza } from "../plazas/plaza.service.js";

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

export const getBateria = async (bateriaId, params = {}) => {
  const db = Database.getInstance();

  if (!bateriaId) {
    return null;
  }

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

  conditions.push(`b.bateriaid = $${paramCounter}`);
  values.push(bateriaId);
  paramCounter++;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (key === "bateriaId") continue;

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

  baseQuery += ` WHERE ${conditions.join(" AND ")}`;

  const { rows: baterias } = await db.query(baseQuery, values);

  if (baterias.length === 0) {
    return null;
  }

  const bateria = baterias[0];

  const { rows: cursosRows } = await db.query(
    `
      SELECT
        cb.cursoid AS "cursoId",
        c.codigocurso AS "codigoCurso",
        c.nombre AS "nombreCurso",
        c.horaspracticas AS "horasPracticas",
        c.horasteoria AS "horasTeoria",
        c.generadc3 AS "generaDC3",
        c.activo AS "activoCurso"
      FROM curso_bateria cb
      INNER JOIN curso c ON cb.cursoid = c.cursoid
      WHERE cb.bateriaid = $1::uuid
      ORDER BY c.nombre ASC
    `,
    [bateria.bateriaid],
  );

  return {
    ...bateria,
    cursos: cursosRows,
  };
};

export const getBateriasByEmpleado = async (empleadoId) => {
  const db = Database.getInstance();

  const plazaExists = await db.query(
    `SELECT plazaid FROM empleado WHERE empleadoid = $1`,
    [empleadoId],
  );

  if (!plazaExists.rowCount === 0)
    throw new AppError(
      "bateria_service",
      "Este empleado no tiene una plaza adjunta, por lo que no es posible obtener sus baterias",
      400,
    );

  const plazaId = plazaExists.rows[0].plazaid;

  if (plazaId.rowCount === 0)
    throw new AppError(
      `bateria_service`,
      "No se tiene asignada una plaza para este trabajador",
      400,
    );

  let queryToGetPuestoId = `
    SELECT puestoId, departamentoid FROM plaza WHERE plazaid=$1
  `;

  const resPuestoIdDepartamentoId = await db.query(queryToGetPuestoId, [
    plazaId,
  ]);

  const { puestoid, departamentoid } = resPuestoIdDepartamentoId.rows[0];

  const queryBateriaId = `SELECT bateriaid FROM bateria WHERE puestoid=$1 AND departamentoid=$2`;

  const bateriaId = await db.query(queryBateriaId, [puestoid, departamentoid]);

  if (bateriaId.rowCount === 0)
    throw new AppError(
      "bateria_service",
      "No existe una bateria asociada al puesto y departamento de este empleado",
      404,
    );

  const bateriaActual = await getBateria(bateriaId.rows[0].bateriaid);

  const plazaPadreId = await getPlaza(plazaId);

  console.log(plazaPadreId.plazapadreid);
  let bateriaSuperior = {};

  if (plazaPadreId.plazapadreid) {
    const resPuestoIdDepartamentoId = await db.query(
      ` SELECT puestoId, departamentoid FROM plaza WHERE plazaid=$1`,
      [plazaPadreId.plazapadreid],
    );

    const { puestoid, departamentoid } = resPuestoIdDepartamentoId.rows[0];

    const queryBateriaId = `SELECT bateriaid FROM bateria WHERE puestoid=$1 AND departamentoid=$2`;

    const bateriaId = await db.query(queryBateriaId, [
      puestoid,
      departamentoid,
    ]);

    if (bateriaId.rowCount === 0)
      throw new AppError(
        "bateria_service",
        "No existe una bateria asociada al puesto y departamento de este empleado",
        404,
      );

    bateriaSuperior = await getBateria(bateriaId.rows[0].bateriaid);
  }

  return {
    bateriaActual,
    bateriaSuperior,
  };
};

// --- ACTUALIZAR (Update) ---
export const updateBateriaCursos = async (bateriaId, payload) => {
  const db = Database.getInstance();
  const cursosSolicitados = payload?.cursos ?? [];

  if (!Array.isArray(cursosSolicitados) || cursosSolicitados.length === 0) {
    throw new AppError(
      "bateria_service",
      "La batería debe tener al menos un curso asignado",
      400,
    );
  }

  const uniqueCursoIds = Array.from(
    new Set(cursosSolicitados.map((item) => item.cursoId)),
  );

  return db.transaction(async (client) => {
    const bateriaResult = await db.query(
      `SELECT bateriaid, activo FROM bateria WHERE bateriaid = $1`,
      [bateriaId],
      client,
    );

    if (bateriaResult.rowCount === 0) {
      throw new AppError(
        "bateria_service",
        "La batería especificada no existe",
        404,
      );
    }

    if (!bateriaResult.rows[0].activo) {
      throw new AppError(
        "bateria_service",
        "No se pueden modificar los cursos de una batería inactiva",
        409,
      );
    }

    const cursosExistentes = await db.query(
      `SELECT cursoid FROM curso WHERE cursoid = ANY($1::uuid[])`,
      [uniqueCursoIds],
      client,
    );

    if (cursosExistentes.rowCount !== uniqueCursoIds.length) {
      const encontrados = new Set(
        cursosExistentes.rows.map((row) => row.cursoid),
      );
      const faltantes = uniqueCursoIds.filter((id) => !encontrados.has(id));

      throw new AppError(
        "bateria_service",
        `Uno o más cursos no existen: ${faltantes.join(", ")}`,
        400,
      );
    }

    await db.query(
      `DELETE FROM curso_bateria WHERE bateriaid = $1`,
      [bateriaId],
      client,
    );

    const bateriaIds = new Array(uniqueCursoIds.length).fill(bateriaId);

    await db.query(
      `INSERT INTO curso_bateria (bateriaid, cursoid)
       SELECT * FROM UNNEST($1::uuid[], $2::uuid[])`,
      [bateriaIds, uniqueCursoIds],
      client,
    );

    return {
      bateriaid: bateriaId,
      cursos: uniqueCursoIds.map((cursoId) => ({ cursoId })),
    };
  });
};

export const deactivateBateria = async (bateriaId) => {
  const db = Database.getInstance();

  const result = await db.query(
    `UPDATE bateria
     SET activo = false
     WHERE bateriaid = $1
     RETURNING bateriaid, puestoid, departamentoid, activo`,
    [bateriaId],
  );

  if (result.rowCount === 0) {
    throw new AppError(
      "bateria_service",
      "La batería especificada no existe",
      404,
    );
  }

  return result.rows[0];
};
