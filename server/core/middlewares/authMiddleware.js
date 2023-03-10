const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Unauthorized", 401));
  }
  const token = authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);

  if (!user) {
    return next(new AppError("Unauthorized", 401));
  }
  req.user = user;
  next();
};
