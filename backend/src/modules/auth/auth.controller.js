import catchAsync from "../../utils/catchAsync.js";
import * as authService from "./auth.service.js";
import { AppError } from "../../utils/error.js";

export const signup = catchAsync(async (req, res, next) => {
  const data = req.body;

  const newAccount = await authService.createUser({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });

  // createSendToken(newAccount, 201, res);
  res.status(201).json({
    status: "success",
    message: "Cuenta creada exitosamente",
  });
});

export const login = catchAsync(async (req, res, next) => {
  const credentials = req.body;

  const userAccount = await authService.login(credentials);

  // console.log(userAccount)

  authService.createSendToken(userAccount, 200, res);
});

// --- MIDDLEWARE PARA PROTEGER RUTAS ---
export const protect = catchAsync(async (req, res, next) => {
  // 1) Obtener el token desde las cookies
  // NOTA: Requiere tener configurado 'cookie-parser' en tu app.js
  let token = req.cookies?.jwt;

  // Si quisieras mantener compatibilidad con Postman usando el header Bearer como plan B:
  if (!token && req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    throw new AppError(
      "auth_controller",
      "No has iniciado sesión. Por favor, inicia sesión para acceder.",
      401,
    );

  // 2) Verificar el token
  const decoded = authService.decodeToken(token);

  console.log(decoded.id);

  const currentUser = await authService.getUserAccountData(
    decoded.id,
    decoded.iat,
  );

  delete currentUser.password;

  // // 5) Conceder acceso y guardar el usuario en la request
  req.user = currentUser;

  console.log(currentUser);

  next();
});

// --- MIDDLEWARE PARA RESTRINGIR POR ROLES ---
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Asumimos que tu tabla 'cuenta_usuario' tiene un campo 'rol' (ej. 'admin', 'user')
    if (!roles.includes(req.user.rol)) {
      return next(
        new AppError("No tienes permiso para realizar esta acción.", 403),
      );
    }

    next();
  };
};

export const getMe = (req, res) => {

  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};
