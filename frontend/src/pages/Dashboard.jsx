import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";
import { useSocket } from "../hooks/useSocket";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);


  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load videos
  const load = async () => {
    const res = await api.get("/videos", {
      params: {
        status: statusFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        search: search || undefined,
        page,
        limit: 6
      }
    });

    setVideos(res.data.videos);
    setPages(res.data.pages);
  };

  // Load invite code
  const loadInviteCode = async () => {
  try {
    const res = await api.get("/org/invite-code");
    setInviteCode(res.data.inviteCode);
  } catch (err) {
    // Non-admins will fail here
  }
};

  useEffect(() => {
    load();
    if (user?.role === "admin") {
      loadInviteCode();
    }
  }, [statusFilter, fromDate, toDate, search, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, fromDate, toDate, search]);


  // Socket updates
  useSocket(
    (data) => {
      setVideos((v) =>
        v.map((x) =>
          x._id === data.videoId
            ? { ...x, progress: data.progress }
            : x
        )
      );
    },
    (data) => {
      setVideos((v) =>
        v.map((x) =>
          x._id === data.videoId
            ? { ...x, status: data.status }
            : x
        )
      );
    }
  );

  // Logout
  const handleLogout = () => {
    logout();
    toast.success("Logged out")
    navigate("/");
  };

  // Avatar letter
  const avatarLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };


  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="navbar">

        {/* Left Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h3>StreamGuard</h3>

          <Link to="/upload">Upload</Link>
          <Link to="/members">Members</Link>
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

          {/* Avatar */}
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600"
            }}
            title={user?.name}
          >
            {avatarLetter}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "6px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>

        </div>
      </div>

      {/* ================= DASHBOARD ================= */}
      <div className="box">
        <h2>Welcome</h2>

        {/* Invite Code (Admin Only) */}
        {user?.role === "admin" && inviteCode && (
          <div
            style={{
              background: "#ecfeff",
              border: "1px solid #67e8f9",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "20px",
              marginBottom: "20px",
              fontSize: "14px"
            }}
          >
            <strong>Invite Code:</strong> {inviteCode}

            <span
              style={{
                marginLeft: "15px",
                color: "#2563eb",
                cursor: "pointer"
              }}
              onClick={() => {
                navigator.clipboard.writeText(inviteCode);
                toast.success("Copied");
              }}
            >
              📋 Copy
            </span>
          </div>
        )}

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap"
          }}
        >

          {/* Search */}
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              minWidth: "220px"
            }}
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="safe">Safe</option>
            <option value="flagged">Flagged</option>
            <option value="processing">Processing</option>
          </select>

          {/* From Date */}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          {/* To Date */}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

          
        {/* Video Grid */}
        <div className="video-grid">
          {videos.map((v) => (
            <div className="video-card" key={v._id}>
              <h4>{v.title}</h4>

              <p style={{ fontSize: "13px", color: "#555" }}>
                Uploaded by:{" "}
                <strong>
                  {v.uploadedBy?.name || "Unknown"}
                </strong>
              </p>

              <p style={{ fontSize: "13px", color: "#555" }}>
                Uploaded at:{" "}
                {formatDate(v.createdAt)}
              </p>

              <p>Status: {v.status}</p>

              {/* Progress Bar */}
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${v.progress}%` }}
                />
              </div>

              {/* Play Button */}
              {v.status === "flagged" ? (

                <button
                  disabled
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    background: "#9ca3af",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "not-allowed"
                  }}
                >
                  🚫 Blocked
                </button>

              ) : (

                <Link
                  className="link-btn"
                  to={`/player/${v._id}`}
                >
                  ▶ Play
                </Link>

              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pages >= 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
              alignItems: "center",
              marginTop: "30px"
            }}
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn"
              style={{ width: "100px" }}
            >
              Prev
            </button>

            <span>
              Page {page} of {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="btn"
              style={{ width: "100px" }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
