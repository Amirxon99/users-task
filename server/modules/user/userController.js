const User = require("./User");
const AppError = require("../../core/utils/appError");
const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator/src");
const QueryBuilder=require('../../core/utils/queryBuilder')
const { compare } = require("bcrypt");

exports.getAllUsers = catchAsync(async (req, res) => {
  const queryBuilder = new QueryBuilder(req.query);
  queryBuilder
    .filter()
    .paginate()
    .limitFields()
    .search(["firstName", "lastName"])
    .sort();
  let allUsers = await User.findAndCountAll({...queryBuilder.queryOptions,
     where:{role:{[Op.eq]:"USER"}}
   });
  allUsers = queryBuilder.createPage(allUsers);

  res.json({
    status: "success",
    message: "",
    error: null,
    data: {
      allUsers,
    },
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userById = await User.findByPk(id);
  if (!userById) {
    return next(new AppError("Bunday Id li User topilmadi"), 404);
  }
  res.json({
    status: "success",
    message: "",
    error: null,
    data: {
      userById,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userById = await User.findByPk(id);
  if (!userById) {
    return next(new AppError("Bunday Id li user topilmadi", 404));
  }
  await userById.destroy();
  res.status(201).json({
    status: "success",
    message: "Deleted User",
    error: null,
    data: null,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("This username or email already exists", 400);
    err.name = "validationError";
    err.errors = validationErrors.errors;
    err.isOperational = false;
    return next(err);
  }

  const { id } = req.params;
  const userById = await User.findByPk(id);
 
  if (!userById) {
    return next(new AppError(`${id} bunday idli User mavjud emas!!`), 404);
  }
  const updatedUser = await userById.update(req.body);

  res.json({
    status: "success",
    message: "User informations successfuly edited!!",
    error: null,
    data: {
    },
  });
});


exports.updateUserPassword = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("validation Error ", 400);
    err.name = "validationError";
    err.errors = validationErrors.errors;
    err.isOperational = false;
    return next(err);
  }

  const { id } = req.params;
  const userById = await User.findByPk(id);
  if (!userById) {
    return next(new AppError(`${id} bunday idli User mavjud emas!!`), 404);
  }
   const passwordIsMatch= await  compare(req.body.password, userById.password)
   if (!passwordIsMatch) {
    return next(new AppError("Paroll hato kiritildi!!", 400));
  }
   await  userById.update({password:req.body.newPassword});
  res.json({
    status: "success",
    message: "Password successfuly edited!!",
    error: null,
    data: {
    },
  });
});
