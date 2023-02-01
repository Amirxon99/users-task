const express = require("express");
const errorController = require("./core/middlewares/errorController");
const AppError = require("./core/utils/appError");
const authMiddleware = require("./core/middlewares/authMiddleware");
const cors = require("cors");

const userRouter = require("./modules/user/userRouter");
const authRouter = require("./modules/auth/authRouter");

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users",authMiddleware, userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Path ${req.path} not found`, 404));
});
app.use(errorController);
module.exports = app;
