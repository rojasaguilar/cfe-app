export class AppError extends Error {
  constructor(comingFrom, message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.comingFrom = comingFrom;

    Error.captureStackTrace(this, this.constructor);
  }
}
