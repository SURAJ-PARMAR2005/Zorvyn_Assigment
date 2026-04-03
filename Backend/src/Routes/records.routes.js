const express = require("express");
const authMiddleware = require("../Middleware/auth.middleware");
const checkRole = require("../Middleware/checkRole.middleware");
const {validateRecord} = require("../validators/record.validator");
const validate  = require("../Middleware/validation.middleware");
const recordController = require("../Controllers/records.controllers");

const router  = express.Router();

//create a record // admin can create a record
router.post("/",authMiddleware,checkRole('admin'),validateRecord,validate,recordController.createRecord);
router.get("/",authMiddleware,checkRole('admin','analyst'),recordController.getAllRecords);
router.get("/:id",authMiddleware,checkRole("admin","analyst"),recordController.getRecordById);
router.put("/:id",authMiddleware,checkRole('admin'),validateRecord,validate,recordController.updateRecord);
router.delete("/:id",authMiddleware,checkRole("admin"), recordController.deleteRecord);


module.exports = router;