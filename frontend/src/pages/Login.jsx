import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/user/login", { email, password });
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed! Check credentials.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br /><br />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>Register</span></p>
    </div>
  );
}

export default Login;
