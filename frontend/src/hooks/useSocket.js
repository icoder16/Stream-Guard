import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocket = (onProgress, onDone) => {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("video-progress", onProgress);
    socket.on("video-done", onDone);

    return () => socket.disconnect();
  }, []);
};
