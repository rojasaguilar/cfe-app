import catchAsync from "../../utils/catchAsync.js";
import { createUser, createSendToken } from "./auth.service.js";

export const signup = catchAsync(async (req, res, next) => {
  const data = req.body;

  const newAccount = await createUser({
    email: data.email,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });

  createSendToken(newAccount, 201, res);
});


// exports.protect = catchAsync(async (req, res, next) => {
//   //1) Getting token and check if exists
//   let token = req.headers.authorization;

//   if (!token || !token.startsWith('Bearer')) {
//     throw new AppError('You are not logged in!, please log in', 401);
//   }

//   token = token.split(' ')[1];

//   //2) Verification token
//   //promisify COMING FROM util package (built in node.js)
//   const decoded = await promisify(jwt.verify)(token, envVars.JWT_SECRET);

//   //3) Check if user still exists
//   const currentUser = await User.findById(decoded.id);

//   if (!currentUser)
//     throw new AppError('Token no longer valid. Please log in again', 401);

//   //4) Check if user changed passwords after the token was issued

//   if (currentUser.changedPasswordAfter(decoded.iat))
//     throw new AppError('Password changed. Please log in again', 401);

//   //GRANT ACCESS TO PROTECTED ROUTE
//   req.user = currentUser;
//   next();
// });

// //WRAPPER FUNCTION to have access to custom params
// exports.restrictTo =
//   (...roles) =>
//   //ACTUAL MIDDLEWARE
//   (req, res, next) => {
//     //roles is an array.
//     //are the params we pass on tourRoutes
//     if (!roles.includes(req.user.role))
//       next(
//         new AppError("You don't have permission to perfom this action!", 403),
//       );

//     next();
//   };
