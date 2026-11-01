import catchAsync from "../../utils/catchAsync";
import { createUser, createSendToken } from "./auth.service";

export const signup = catchAsync(async (req, res, next) => {
  const data = req.body;

  const newAccount = await createUser({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });

  createSendToken(newAccount, 201, res);
});
