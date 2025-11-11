const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
});

module.exports = mongoose.model("Service", serviceSchema);
