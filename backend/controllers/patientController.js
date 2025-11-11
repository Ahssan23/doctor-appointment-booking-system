const Patient = require("../models/Patient");

// Add patient
exports.addPatient = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const patient = new Patient({ name, email, age });
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error adding/updating patient" });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { name, email, age },
      { new: true, runValidators: true }
    );

    if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });
    res.json(updatedPatient);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error adding/updating patient" });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting patient" });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching patients" });
  }
};
