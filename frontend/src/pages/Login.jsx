import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/login", {
      email,
      password
    });

    login(res.data.token, res.data.user);

    navigate("/dashboard");
  };

  return (
    <div className="center">
      <form className="form-box" onSubmit={submit}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="nav-form-link">
        <span>Don't have an account? </span>
        <Link to="/Register">Register here</Link>
      </div>

      <button className="btn">Login</button>
      </form>
    </div>
  );
}
