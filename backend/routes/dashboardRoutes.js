const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// ✅ use protect() since your function returns another middleware
router.get("/", protect(), getDashboard);

module.exports = router;
