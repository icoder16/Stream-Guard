import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({});
  const [type, setType] = useState("create");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      const res = await api.post("/auth/register", {
        ...form,
        orgType: type
      });

      toast.success("Registration successful!");
      login(res.data.token, res.data.user);

      nav("/dashboard");
    } catch(err){
      const message = err.response?.data?.message || "Please fill all details";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="form-box" onSubmit={submit}>
        <h2>Register</h2>

        <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input type="password" placeholder="Password" onChange={(e)=>setForm({...form,password:e.target.value})}/>

        <select onChange={(e)=>setType(e.target.value)}>
          <option value="create">Create Org</option>
          <option value="join">Join Org</option>
        </select>

        {type==="create" && (
          <input placeholder="Org Name" onChange={(e)=>setForm({...form,orgName:e.target.value})}/>
        )}

        {type==="join" && (
          <input placeholder="Invite Code" onChange={(e)=>setForm({...form,inviteCode:e.target.value})}/>
        )}

        <div className="nav-form-link">
          <span>Already have an account? </span>
          <Link to="/">Login here</Link>
        </div>

        <button className="btn" disabled={loading}>Register</button>
      </form>
    </div>
  );
}
