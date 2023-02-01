const express = require("express");
const authMiddleware = require("../../core/middlewares/authMiddleware");

const userController = require("./userController");

const router = express.Router();
router.route("/").get(userController.getAllUsers);
router.route("/change-password/:id").put(authMiddleware,userController.updateUserPassword);
router.route("/:id").put(authMiddleware,userController.updateUser);

router
  .route("/:id")
  .get(authMiddleware,userController.getById)
  .delete(authMiddleware,userController.deleteUser);

module.exports = router;
