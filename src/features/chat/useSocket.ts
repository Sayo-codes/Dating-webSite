"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function connect() {
      const res = await fetch("/api/auth/socket-token");
      if (!res.ok || !mounted) return;
      const { token } = (await res.json()) as { token: string };
      if (!token || !mounted) return;

      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      } as any);
      socketRef.current = socket;

      socket.on("connect", () => setConnected(true));
      socket.on("disconnect", () => setConnected(false));
      socket.on("connect_error", () => setConnected(false));
    }

    connect();
    return () => {
      mounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, []);

  const join = useCallback((conversationId: string) => {
    socketRef.current?.emit("join", conversationId);
  }, []);

  const leave = useCallback((conversationId: string) => {
    socketRef.current?.emit("leave", conversationId);
  }, []);

  const onMessageNew = useCallback((callback: (data: unknown) => void) => {
    const s = socketRef.current;
    if (!s) return () => {};
    s.on("message:new", callback);
    return () => s.off("message:new", callback);
  }, []);

  return { connected, join, leave, onMessageNew };
}
