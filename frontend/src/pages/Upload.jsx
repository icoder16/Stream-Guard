import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../api/axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

 // Validate if file is actually a video
  const isValidVideo = (file) => {
    if (!file) return false;
    
    // Check MIME type
    const validTypes = ['video/mp4','video/webm','video/ogg','video/quicktime','video/x-msvideo','video/x-matroska'];
    return validTypes.includes(file.type);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (!isValidVideo(selectedFile)) {
        toast.error("Please select a valid video file");
        e.target.value = null;
        setFile(null);
        return;
      }
      // Validate file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error("File too large. Max size is 10MB");
        e.target.value = null;
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const submit = async (e) => {

    e.preventDefault();

    if (!title) {
      toast.error("Please provide a title");
      return;
    }
    if (!file) {
      toast.error("Please attach a video file");
      return;
    }
    if (!isValidVideo(file)) {
      toast.error("Invalid video file");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Max size is 10MB");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", title);
      data.append("video", file);

      await api.post("/videos/upload", data);
      toast.success("Upload started");
      nav("/dashboard");
    }
    catch (err) {
      console.error(err);

      // Permission error
      if (err.response?.status === 403) {
        toast.error(
          "You do not have permission to upload. Ask an admin for access."
        );
      }
      // Other error
      else {
        toast.error("Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <form className="form-box" onSubmit={submit}>
        <h2>Upload</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
        />

        <button className="btn" disabled={loading}>{loading ? "Uploading..." : "Upload"}</button>
      </form>
    </div>
  );
}
