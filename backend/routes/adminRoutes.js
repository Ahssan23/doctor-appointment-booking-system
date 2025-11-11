const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} = require("../controllers/adminController"); // make sure file name matches

// ✅ Get all doctors or patients
router.get("/users", getUsers);

// ✅ Add doctor or patient
router.post("/users", addUser);

// ✅ Update doctor or patient
router.put("/users/:id", updateUser);

// ✅ Delete doctor or patient
router.delete("/users/:id", deleteUser);

module.exports = router;
