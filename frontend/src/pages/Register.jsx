import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/user/register", { name, email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Error during registration!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} /><br /><br />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br /><br />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span></p>
    </div>
  );
}

export default Register;
