import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [services, setServices] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: "", description: "", price: "" });
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Fetch doctor profile
  const fetchDoctor = async () => {
    try {
      const res = await axiosInstance.get("/doctors/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  // Fetch services
  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/doctors/services");
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  useEffect(() => {
    fetchDoctor();
    fetchServices();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Service handlers
  const handleServiceChange = (e) => setServiceForm({ ...serviceForm, [e.target.name]: e.target.value });

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await axiosInstance.put(`/doctors/services/${editingServiceId}`, serviceForm);
        setEditingServiceId(null);
      } else {
        await axiosInstance.post("/doctors/services", serviceForm);
      }
      setServiceForm({ name: "", description: "", price: "" });
      setShowServiceForm(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding/updating service");
    }
  };

  const handleEditService = (service) => {
    setServiceForm({ name: service.name, description: service.description, price: service.price });
    setEditingServiceId(service._id);
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await axiosInstance.delete(`/doctors/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      {/* Hero Bar */}
      <div className="hero-bar">
        <h1>Welcome, Dr. {profile.name}</h1>
        <div className="hero-actions">
          <button onClick={() => setShowServiceForm(!showServiceForm)}>
            {showServiceForm ? "Close Service Form" : editingServiceId ? "Edit Service" : "Add Service"}
          </button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      {/* Service Form */}
      {showServiceForm && (
        <div className="card service-card">
          <h2>{editingServiceId ? "Edit Service" : "Add Service"}</h2>
          <form onSubmit={handleServiceSubmit}>
            <input type="text" name="name" placeholder="Service Name" value={serviceForm.name} onChange={handleServiceChange} required />
            <input type="text" name="description" placeholder="Description" value={serviceForm.description} onChange={handleServiceChange} />
            <input type="number" name="price" placeholder="Price" value={serviceForm.price} onChange={handleServiceChange} />
            <div className="form-buttons">
              <button type="submit">{editingServiceId ? "Update Service" : "Add Service"}</button>
              <button type="button" onClick={() => { setEditingServiceId(null); setServiceForm({ name: "", description: "", price: "" }); setShowServiceForm(false); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table */}
      <div className="card services-table-card">
        <h2>My Services</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{s.price}</td>
                <td>
                  <button onClick={() => handleEditService(s)}>Edit</button>
                  <button onClick={() => handleDeleteService(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorDashboard;
