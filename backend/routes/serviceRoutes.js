const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getMyServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

// All routes relative to /api/services
router.get("/", protect(["doctor"]), getMyServices);
router.post("/", protect(["doctor"]), createService);
router.put("/:id", protect(["doctor"]), updateService);
router.delete("/:id", protect(["doctor"]), deleteService);

module.exports = router;
