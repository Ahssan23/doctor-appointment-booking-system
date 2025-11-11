const express = require("express");
const {
  addPatient,
  getPatients,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

const router = express.Router();

router.get("/", getPatients);
router.post("/", addPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;
