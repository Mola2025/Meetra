import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeRooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, userName }) => {
    socket.join(roomId);

    console.log(`${userName} joined room ${roomId}`);

    if (!activeRooms[roomId]) {
      activeRooms[roomId] = [];
    }

    activeRooms[roomId].push({
      socketId: socket.id,
      userName,
    });

    socket.emit("room-users", activeRooms[roomId]);

    io.to(roomId).emit("user-joined", {
      socketId: socket.id,
      userName,
      roomId,
      users: activeRooms[roomId],
    });
  });

  socket.on("leave-room", ({ roomId, userName }) => {
    socket.leave(roomId);

    console.log(`${userName} left room ${roomId}`);

    if (activeRooms[roomId]) {
      activeRooms[roomId] = activeRooms[roomId].filter(
        (user) => user.socketId !== socket.id
      );
    }

    io.to(roomId).emit("user-left", {
      socketId: socket.id,
      userName,
      roomId,
      users: activeRooms[roomId] || [],
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in activeRooms) {
      const user = activeRooms[roomId].find(
        (roomUser) => roomUser.socketId === socket.id
      );

      activeRooms[roomId] = activeRooms[roomId].filter(
        (roomUser) => roomUser.socketId !== socket.id
      );

      io.to(roomId).emit("user-left", {
        socketId: socket.id,
        userName: user?.userName || "Unknown user",
        roomId,
        users: activeRooms[roomId],
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Meetra server is running");
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Meetra server running on port ${PORT}`);
});