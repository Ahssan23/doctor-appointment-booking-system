const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

router.post("/", async (req, res) => {
  try {
    const { patientName, doctorId, date, time, reason } = req.body;

    // check required fields
    if (!patientName || !doctorId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // create appointment linked to that doctor
    const appointment = new Appointment({
      patientName,
      doctor: doctor._id,
      date,
      time,
      reason,
    });

    await appointment.save();
    res.status(201).json({
      message: "Appointment booked successfully ✅",
      appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
