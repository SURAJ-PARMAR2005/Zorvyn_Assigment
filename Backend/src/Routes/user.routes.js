const express = require("express");
const authMiddleware = require("../Middleware/auth.middleware");
const checkRole = require("../Middleware/checkRole.middleware");
const userController = require("../Controllers/user.controller")
const router  = express.Router();

//role based crud operations .
//to get all users
router.get("/users",authMiddleware,checkRole('admin'),userController.getAllUsers);
//a specific user
router.get("/user/:id",authMiddleware,checkRole('admin'),userController.getUserById);
//to change role of particular user
router.patch("/user/:id/role",authMiddleware,checkRole('admin'),userController.assignRole);

//to change active status 
router.patch("/user/:id/status",authMiddleware,checkRole('admin'),userController.updateStatus);

//to delete a user 
router.delete("/user/:id",authMiddleware,checkRole("admin"),userController.deleteUser);


module.exports = router;