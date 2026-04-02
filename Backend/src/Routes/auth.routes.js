const express = require("express");
const authController = require("../Controllers/auth.controller")
const authMiddleware = require("../Middleware/auth.middleware");
const checkRole = require("../Middleware/checkRole.middleware");

const router  = express.Router();

router.post("/register",authController.register);
router.post("/login",authController.login);

//role based crud operations .
router.get("/users",authMiddleware,checkRole('admin'),authController.getAllUsers);
router.get("/user/:id",authMiddleware,checkRole('admin'),authController.getUserById);
router.patch("/user/:id/role",authMiddleware,checkRole('admin'),authController.assignRole);




module.exports = router;