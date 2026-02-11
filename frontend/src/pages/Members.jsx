import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";

export default function Members() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await api.get("/org/members");
    setUsers(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    try{
      await api.patch(`/users/${id}/role`, { role });
      toast.success("Role changed successfully");
      load();
    } catch(err){
      const status = err.response?.status;
      const message = status === 400 ? "Cannot change your own role" : 
                  status === 403 ? "Only admins can change roles" : 
                  "An unexpected error occurred";
      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="members-heading">Members</h2>

      {users.map((u) => (
        <div className="member-card" key={u._id}>
            <div className="member-info">
              <strong>{u.name}</strong> <br />
              {u.email} ({u.role})
            </div>

          {users._id !== u._id && (
          <select
            value={u.role}
            onChange={(e)=>changeRole(u._id, e.target.value)}
          >
            <option>admin</option>
            <option>editor</option>
            <option>viewer</option>
          </select>
          )}
        </div>
      ))}
    </div>
  );
}
