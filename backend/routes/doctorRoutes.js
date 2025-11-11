const express = require("express");
const {
  getDoctorProfile,
  updateDoctorProfile,
  getMyServices,
  createService,
  updateService,
  deleteService
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Doctor profile routes
router.get("/me", protect(["doctor"]), getDoctorProfile);
router.put("/me", protect(["doctor"]), updateDoctorProfile);

// Doctor services routes
router.get("/services", protect(["doctor"]), getMyServices);
router.post("/services", protect(["doctor"]), createService);
router.put("/services/:id", protect(["doctor"]), updateService);
router.delete("/services/:id", protect(["doctor"]), deleteService);

module.exports = router;
