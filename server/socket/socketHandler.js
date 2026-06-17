import { SOCKET_EVENTS } from "./events.js";

const activeRooms = {};

export const handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId, userName }) => {
      socket.join(roomId);

      if (!activeRooms[roomId]) {
        activeRooms[roomId] = [];
      }

      activeRooms[roomId].push({
        socketId: socket.id,
        userName,
      });

      io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, activeRooms[roomId]);
      socket.to(roomId).emit(SOCKET_EVENTS.USER_JOINED, {
        socketId: socket.id,
        userName,
      });
    });

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, ({ roomId, userName }) => {
      socket.leave(roomId);

      activeRooms[roomId] = (activeRooms[roomId] || []).filter(
        (user) => user.socketId !== socket.id
      );

      io.to(roomId).emit(SOCKET_EVENTS.ROOM_USERS, activeRooms[roomId]);
      socket.to(roomId).emit(SOCKET_EVENTS.USER_LEFT, {
        socketId: socket.id,
        userName,
      });
    });

    socket.on(SOCKET_EVENTS.OFFER, (data) => {
      socket.to(data.roomId).emit(SOCKET_EVENTS.OFFER, data);
    });

    socket.on(SOCKET_EVENTS.ANSWER, (data) => {
      socket.to(data.roomId).emit(SOCKET_EVENTS.ANSWER, data);
    });

    socket.on(SOCKET_EVENTS.ICE_CANDIDATE, (data) => {
      socket.to(data.roomId).emit(SOCKET_EVENTS.ICE_CANDIDATE, data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};