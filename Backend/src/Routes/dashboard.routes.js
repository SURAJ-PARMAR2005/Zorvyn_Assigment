const express = require("express");
const dashboardController = require("../Controllers/dashboard.controller");
const authMiddleware = require("../Middleware/auth.middleware");
const checkRole = require("../Middleware/checkRole.middleware");
const router  = express.Router();

router.get("/summary",authMiddleware,checkRole("admin","analyst","viewer"),dashboardController.getSummary);
router.get("/categories",authMiddleware,checkRole("admin","analyst","viewer"),dashboardController.getCategoryTotal);
router.get("/trends/monthly",authMiddleware,checkRole("admin","analyst","viewer"),dashboardController.getMonthlyTrends);
router.get("/trends/weekly",authMiddleware,checkRole("admin","analyst","viewer"),dashboardController.getWeeklyTrends);
router.get("/recent",authMiddleware,checkRole("admin","analyst","viewer"),dashboardController.getRecentActivity);

module.exports = router;