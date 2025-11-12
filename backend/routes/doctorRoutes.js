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
const Doctor = require("../models/Doctor"); 

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "name specialization"); 
    // we only send name & specialization to keep data light
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});


// Doctor profile routes
router.get("/me", protect(["doctor"]), getDoctorProfile);
router.put("/me", protect(["doctor"]), updateDoctorProfile);

// Doctor services routes
router.get("/services", protect(["doctor"]), getMyServices);
router.post("/services", protect(["doctor"]), createService);
router.put("/services/:id", protect(["doctor"]), updateService);
router.delete("/services/:id", protect(["doctor"]), deleteService);

module.exports = router;
