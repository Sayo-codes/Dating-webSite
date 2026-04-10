"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    if (socketRef.current?.connected) return;

    try {
      const res = await fetch("/api/auth/socket-token");
      if (!res.ok) return;
      const { token } = (await res.json()) as { token: string };
      if (!token) return;

      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("Socket connected");
        setConnected(true);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setConnected(false);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setConnected(false);
      });
    } catch (err) {
      console.error("Failed to connect to socket:", err);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [connect]);

  const join = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join", conversationId);
    }
  }, []);

  const leave = useCallback((conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave", conversationId);
    }
  }, []);

  const onMessageNew = useCallback((callback: (data: any) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};
    s.on("message:new", callback);
    return () => s.off("message:new", callback);
  }, []);

  return { connected, join, leave, onMessageNew, socket: socketRef.current };
}
