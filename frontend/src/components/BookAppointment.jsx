import React, { useState, useEffect } from "react";
import { api } from "../utils/api";

export default function BookAppointment() {
  const [form, setForm] = useState({
    patientName: "",
    doctorId: "", // ✅ changed from doctorName → doctorId (clear meaning)
    date: "",
    time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        
        const res = await api.get("/doctors/all");
        console.log("Fetched doctors:", res.data);
        setDoctors(res.data);
        
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.doctorId || !form.date || !form.time) {
      return alert("Please fill required fields.");
    }

    setLoading(true);
    try {
      // ✅ doctorId already correct
      const res = await api.post("/appointments", {
        patientName: form.patientName,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time,
        reason: form.reason,
      });

      alert(res?.data?.message || "Appointment booked successfully ✅");
      setForm({ patientName: "", doctorId: "", date: "", time: "", reason: "" });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Server error";
      alert("Error: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "16px auto", padding: 12, borderRadius: 8 }}>
      <h3>Book Appointment</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Your name"
          required
          style={{ width: "100%", marginBottom: 8 }}
        />

    
        <select
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} ({doc.specialization})
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            style={{ flex: 1 }}
          />
        </div>

        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Reason (optional)"
          style={{ width: "100%", marginBottom: 8 }}
        />

        <button type="submit" disabled={loading} style={{ padding: "8px 12px" }}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
