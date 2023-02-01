const catchAsync = require("../../core/utils/catchAsync");
const { Op } = require("sequelize");
const jsonWebToken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const AppError = require("../../core/utils/appError");
const User = require("../user/User");
const { compare } = require("bcrypt");
const { sendVerificationSMS } = require("../../core/utils/smsUtil");
const { sendVerificationMail } = require("../../core/utils/mailUtils");
const ShortUniqueId = require("short-unique-id");

const createVerificationCode = async () => {
  const uuid = new ShortUniqueId({ length: 8 });
  let verificationCode = uuid();
  return verificationCode;
};

const generateToken = (payload, jwtSecret, options) => {
  return new Promise((resolve, rejected) => {
    jsonWebToken.sign(payload, jwtSecret, options, (err, token) => {
      if (err) {
        rejected(err);
      } else {
        resolve(token);
      }
    });
  });
};

const findByUsername = async (username) => {
  const user = await User.findOne({
    where: { username: { [Op.eq]: username } },
  });
  if (user) {
    return user;
  }
  return null;
};

const findByEmail = async (email) => {
  const user = await User.findOne({ where: { email: { [Op.eq]: email } } });
  if (user) {
    return user;
  }
  return null;
};

exports.register = catchAsync(async (req, res, next) => {
  
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("Validation Error", 400);
    err.name = "validationError";
    err.errors = validationErrors.errors;
    err.isOperational = false;
    return next(err);
  }

  const existedUser = await findByUsername(req.body.username);

  const exEmail = await findByEmail(req.body.email);
  if (existedUser) {
    return next(new AppError("Bunday loginli  foydalanuvchi mavjud", 409));
  }
  if (exEmail) {
    return next(new AppError("Bunday  emailli  foydalanuvchi mavjud", 409));
  }

  if (req.body.role === "SUPER_ADMIN") {
    return next(new AppError("Already have Super Admin", 409));
  }
  const verificationCode = await createVerificationCode();
  const newUser = await User.create({...req.body,verificationCode});
  sendVerificationSMS({
    to: req.body.phoneNumber,
    vercode: newUser.verificationCode,
  });
  const payload = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
  };

  const token = await generateToken(payload, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "24h",
  });

  res.status(201).json({
    status: "success",
    message: `${newUser.phoneNumber} nomeriga tasdiqlash kodini jo'natdik!`,
    error: null,
    data: {
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
      jwt: token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const err = new AppError("Validation Error", 400);
    err.name = "validationError";
    err.errors = validationErrors.errors;
    err.isOperational = false;
    return next(err);
  }

  const { username, password } = req.body;
  const candidate = await findByUsername(username);

  if (!candidate) {
    return next(new AppError("Login yoki Paroll hato kiritikdi!!", 400));
  }
  if (!candidate.isVerified) {
    return next(new AppError("Verifikatsiyadan o'tmagansiz", 400));
  }
  const passwordIsMatch = await compare(password, candidate.password);

  if (!passwordIsMatch) {
    return next(new AppError("Login yoki Paroll hato kiritikdi!!", 400));
  }

  const payload = {
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    role: candidate.role,
  };
  const token = await generateToken(payload, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "24h",
  });

  res.json({
    status: "success",
    data: {
      user: {
        ...payload,
      },
      jwt: token,
    },
  });
});

exports.verify = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userByVerId = await User.findOne({
    where: { verificationCode: { [Op.eq]: id } },
  });
  if (!userByVerId) {
    return next(new AppError(`Verify Error`), 404);
  }
  await userByVerId.update({ isVerified: true });
  res.json({
    status: "success",
    message: "Registration success",
    error: null,
    data: {},
  });
});

exports.verifyByPhone = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { verCode } = req.body;
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError(`Verify Error`), 404);
  }
  if(user.verificationCode!==verCode){
    return next(new AppError(`Verify Error`), 404);
  }
  await user.update({ isVerified: true });
  res.json({
    status: "success",
    message: "Registration success, Please Login In",
    error: null,
    data: {},
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
   const user=await User.findOne({where:{email:{[Op.eq]:req.body.email}}});
   if (!user) {
    return next(new AppError(`Ushbu email registratsiyadan o'tmagan!`), 404);
  }
  const newPassword = await createVerificationCode();
  await user.update({password:newPassword});

  sendVerificationSMS({
    to: user.phoneNumber,
    vercode: newPassword,
  });
  sendVerificationMail({
    to: user.email,
    password:  newPassword
  })
  res.json({
    status: "success",
    message: `Yangi parol ${user.phoneNumber} raqamiga va ${user.email} ga yuborildi. Ushbu parol yordamida 
      tizimga kirishingiz mumkin!`,
    error: null,
    data: {},
  });
});

