import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

function PatientDashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/dashboard/me");
        setName(res.data.name);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Welcome, {name}</h2>
      <p>View your upcoming appointments and assigned doctor here.</p>
      <button onClick={() => navigate("/patient/book-appointment")} style={{marrgin:20}}>
  Book Appointment
</button>


      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default PatientDashboard;
