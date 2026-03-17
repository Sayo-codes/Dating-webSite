/**
 * Standalone Socket.io server for real-time messaging.
 * Run: SOCKET_PORT=3001 npx tsx server/socket-server.ts
 * Set SOCKET_SERVER_URL in Next.js env (e.g. http://localhost:3001) for API → emit.
 */
import http from "node:http";
import { Server } from "socket.io";
import * as jose from "jose";

const PORT = Number(process.env.PORT || process.env.SOCKET_PORT || 3001);
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-change-in-production"
);
const JWT_ISSUER = "velvet-signal";
const JWT_AUDIENCE = "velvet-signal";
const INTERNAL_SECRET = process.env.SOCKET_SERVER_SECRET ?? "";

async function verifyToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return { sub: (payload.sub as string) ?? "" };
  } catch {
    return null;
  }
}

const httpServer = http.createServer((req, res) => {
  // Health check for monitoring/hosting uptime checks
  if (req.method === "GET" && (req.url === "/health" || req.url === "/")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  if (req.method === "POST" && req.url === "/internal/emit") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      if (INTERNAL_SECRET && req.headers["x-internal-secret"] !== INTERNAL_SECRET) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Forbidden" }));
        return;
      }
      try {
        const { room, event, data } = JSON.parse(body) as { room: string; event: string; data: unknown };
        if (room && event) {
          io.to(room).emit(event, data);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "room and event required" }));
        }
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: { 
    origin: process.env.NEXT_PUBLIC_APP_ORIGIN ? process.env.NEXT_PUBLIC_APP_ORIGIN.split(",") : "http://localhost:3000",
    credentials: true 
  },
});

io.on("connection", async (socket) => {
  const token = (socket.handshake.auth as { token?: string }).token ?? (socket.handshake.query as { token?: string }).token;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    socket.emit("error", { message: "Unauthorized" });
    socket.disconnect(true);
    return;
  }

  socket.on("join", (conversationId: string) => {
    if (typeof conversationId === "string" && conversationId) {
      socket.join(conversationId);
    }
  });

  socket.on("leave", (conversationId: string) => {
    if (typeof conversationId === "string" && conversationId) {
      socket.leave(conversationId);
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});
