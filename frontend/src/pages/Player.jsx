import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";

export default function Player() {
  const { id } = useParams();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/videos/stream/${id}`);
      setUrl(res.data.url);
    };

    load();
  }, []);

  return (
    <div className="container">
      <div className="player-box">
        <div>
          <h2>Player</h2>

          {url && (
            <video src={url} controls width="100%" />
          )}
        </div>
      </div>
    </div>
  );
}
