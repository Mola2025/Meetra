import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import authRoutes from "./routes/AuthenticationRoutes.js";

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

// Socket.IO

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start Server

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Meetra server running on port ${PORT}`);
});
