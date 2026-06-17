import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { handleSocketConnection } from "../socket/socketHandler.js";

import authRoutes from "./routes/AuthenticationRoutes.js";
import profileRoutes from "./routes/ProfileRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes

app.get("/", (req, res) => res.json({ status: "Meetra server is running" }));

app.use("/auth", authRoutes);
app.use("/hub", profileRoutes);

// Socket.IO

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

handleSocketConnection(io);

// Start Server

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Meetra server running on port ${PORT}`);
});
