import { AppError } from "./../utils/error.js";
import envVars from "./../config/config.dotenv.js";

// --- MANEJADORES DE ERRORES POSTGRESQL ---

// 23505: Unique violation (Equivalente al 11000 de Mongo)
const handleDuplicateFieldsDB = (err) => {
  // Postgres envía el detalle del error en err.detail. Ej: "Key (email)=(test@correo.com) already exists."
  const message = `Valor duplicado en la base de datos. ${err.detail}`;
  return new AppError("database", message, 400);
};

// 22P02: Invalid text representation (Equivalente al CastError de Mongo, ej. enviar texto a un UUID)
const handleInvalidTextRepresentationDB = (err) => {
  const message = "Formato de dato inválido detectado en la base de datos.";
  return new AppError("database", message, 400);
};

// 23503: Foreign key violation (Ej: asignar un departamentoId que no existe)
const handleForeignKeyViolationDB = (err) => {
  const message = `Violación de llave foránea. El registro referenciado no existe. ${err.detail}`;
  return new AppError("database", message, 400);
};

// 23502: Not null violation (Equivalente a algunos ValidationError de Mongo)
const handleNotNullViolationDB = (err) => {
  const message = `Falta un valor requerido en la columna: ${err.column}`;
  return new AppError("database", message, 400);
};

// --- MANEJADORES DE ERRORES JWT ---

const handleJWTError = () =>
  new AppError(
    "auth_middleware",
    "Token inválido. Por favor, inicia sesión nuevamente",
    401,
  );

const handleJWTExpired = () =>
  new AppError(
    "auth_middleware",
    "Token expirado. Por favor, inicia sesión nuevamente",
    401,
  );

// --- RESPUESTAS DEV Y PROD ---

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    comingFrom: err.comingFrom || "unknown",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      comingFrom: err.comingFrom,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error detail
  else {
    // 1) Log error for backend developers
    console.error("ERROR 🔥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      comingFrom: "global_error_handler",
      message: "Algo salió muy mal en el servidor",
    });
  }
};

// --- MIDDLEWARE GLOBAL ---

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (envVars.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (envVars.NODE_ENV === "production") {
    // Al copiar el error en JS, message, name y code pueden perderse en la desestructuración.
    // Es vital extraerlos manualmente.
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;
    error.detail = err.detail;
    error.column = err.column;
    error.comingFrom = err.comingFrom;

    // Errores específicos de PostgreSQL (Identificados por su 'code' numérico como texto)
    if (error.code === "23505") error = handleDuplicateFieldsDB(error);
    if (error.code === "22P02")
      error = handleInvalidTextRepresentationDB(error);
    if (error.code === "23503") error = handleForeignKeyViolationDB(error);
    if (error.code === "23502") error = handleNotNullViolationDB(error);

    // Errores de JSON Web Token (Identificados por su 'name')
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpired();

    sendErrorProd(error, res);
  }
};
