import { useEffect, useState } from "react";

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
    await api.patch(`/users/${id}/role`, { role });
    load();
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
