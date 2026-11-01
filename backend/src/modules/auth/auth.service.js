import envVars from "./../../config/config.dotenv";
import { Database } from "../../config/Database";
import { AppError } from "../../utils/error";
import bcrypt from "bcrypt";

const signToken = (payload) =>
  jwt.sign({ ...payload }, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRES_IN,
  });

export const createSendToken = (user, statusCode, res) => {
  //CREATE TOKEN
  const token = signToken({
    id: user.usuarioid,
  });

  //DEFINE COOKIE OPTIONS
  const cookieOptions = {
    //EXPIRATION OF THE COOKIE
    expires: new Date(
      //COOKIE EXPIRES IN (ENV VARIABLE)
      //WE HAVE TO SPECIFY MILLISECONDS
      Date.now() + envVars.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    //secure: true, //THIS TELLS COOKIE TO WORK ON HTTPS, HTTP WONT WORK AND NOT RECOMENDED
    httpOnly: true, //WITH THIS, COOKIE CANT BE MODIFY BY THE CLIENT (BROWSER)
  };

  //JUST TO TEST OVER HTTP
  //THIS LINE INDICATES THAT IF IS IN PRODUCTION, ACTIVATE COOKIE ONLY TRAVELS ON HTTPS
  // if (envVars.NODE_ENV === "production") cookieOptions.secure = true;

  // cookieOptions.secure = true;

  //COCKIES TRAVELS IN ALL HTTP REQUESTS
  //EVERY INTERACTION CLIENT-SERVER TRAVELS ALONG WITH COOCKIES
  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "sucess",
    token,
    // data: {
    //   user,
    // },
  });
};

export const createUser = async (userData) => {
  const { email, password, passwordConfirm } = userData;

  if (!email || !password || !passwordConfirm)
    throw new Error("Por favor, proporciona todos los datos requeridos.");

  if (passwordConfirm !== password)
    throw new Error("Contraseñas no coinciden");

  const db = Database.getInstance();

  const usertExists = await db.query(
    "SELECT usuarioId FROM cuenta_usuario WHERE email = $1",
    [email],
  );

  if (usertExists.rowCount > 0)
    throw new AppError(
      "auth_service",
      "El correo electrónico ya está registrado",
      400,
    );

  const hashedPass = bcrypt.hash(password, envVars.SALT);

  const newUser = await db.query(
    `INSERT INTO cuenta_usuario (email, password)
    VALUES ($1, $2)
    RETURNING usuarioid,email,created_at
    `,
    [email, hashedPass],
  );

  return newUser.rows[0];
};
