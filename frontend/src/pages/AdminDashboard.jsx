import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "doctor",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false); // control form visibility

  const fetchUsers = async (role) => {
    try {
      const res = await axiosInstance.get(`/admin/users?role=${role}`);
      const data = Array.isArray(res.data) ? res.data : [];
      role === "doctor" ? setDoctors(data) : setPatients(data);
    } catch (err) {
      console.error(`Failed to fetch ${role}s:`, err);
    }
  };

  useEffect(() => {
    fetchUsers("doctor");
    fetchUsers("patient");
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosInstance.put(`/admin/users/${editingUser._id}`, formData);
        setEditingUser(null);
      } else {
        await axiosInstance.post("/admin/users", formData);
      }
      setFormData({ name: "", email: "", password: "", role: "doctor" });
      setShowForm(false); // hide form after submit
      fetchUsers("doctor");
      fetchUsers("patient");
      alert(editingUser ? "User updated successfully" : "User added successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding/updating");
    }
  };

  const handleDelete = async (id, role) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      fetchUsers(role);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowForm(true); // show form when editing
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="top-actions">
        <button className="show-form-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Doctor / Patient"}
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <section className="form-section">
          <h2>{editingUser ? "Update User" : "Add Doctor / Patient"}</h2>
          <form onSubmit={handleSubmit} className="user-form">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
            <div className="form-buttons">
              <button type="submit">{editingUser ? "Update User" : "Add User"}</button>
              {editingUser && (
                <button type="button" onClick={() => { setEditingUser(null); setFormData({ name: "", email: "", password: "", role: "doctor" }); setShowForm(false); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <section className="users-section">
        <div className="users-card">
          <h2>Doctors</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d._id}>
                  <td>{d.name}</td><td>{d.email}</td><td>{d.role}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleEdit(d)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDelete(d._id, "doctor")}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="users-card">
          <h2>Patients</h2>
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td><td>{p.email}</td><td>{p.role}</td>
                  <td>
                    <button className="update-btn" onClick={() => handleEdit(p)}>Update</button>
                    <button className="delete-btn" onClick={() => handleDelete(p._id, "patient")}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
