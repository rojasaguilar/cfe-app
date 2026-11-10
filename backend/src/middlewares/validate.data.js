export const validate = (schema) => {
  return (req, res, next) => {
    const resultData = schema.safeParse(req.body);

    if (!resultData.success) return next(resultData.error);

    req.body = resultData.data;

    next();
  };
};
