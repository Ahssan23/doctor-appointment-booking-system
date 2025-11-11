const Service = require("../models/Service");
const Doctor = require("../models/Doctor");

// Get logged-in doctor info
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all services for logged-in doctor
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ doctor: req.user.id });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const service = new Service({
      doctor: req.user.id,
      name,
      description,
      price,
    });

    const saved = await service.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, doctor: req.user.id });
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;
    service.price = req.body.price || service.price;

    const updated = await service.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, doctor: req.user.id });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
