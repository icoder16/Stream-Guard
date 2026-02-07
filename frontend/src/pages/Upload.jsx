import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const submit = async (e) => {

    e.preventDefault();

    if (!file || !title) {
      setError("Title and file are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = new FormData();
      data.append("title", title);
      data.append("video", file);

      await api.post("/videos/upload", data);

      nav("/dashboard");
    }
    catch (err) {
      console.error(err);

      // Permission error
      if (err.response?.status === 403) {
        setError(
          "You do not have permission to upload. Ask an admin for access."
        );
      }
      // Other error
      else {
        setError("Upload failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="form-box" onSubmit={submit}>
        <h2>Upload</h2>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px"
            }}
          >
            {error}
          </div>
        )}

        <input
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn" disabled={loading}>Upload</button>
      </form>
    </div>
  );
}
