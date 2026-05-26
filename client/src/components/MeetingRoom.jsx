import { useEffect, useState } from "react";
import socket from "../socket/socket";

function MeetingRoom() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    socket.on("user-joined", (data) => {
      setUsers(data.users || []);
    });

    socket.on("user-left", (data) => {
      setUsers(data.users || []);
    });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, []);

  const joinRoom = () => {
    if (!roomId || !userName) return;

    socket.emit("join-room", {
      roomId,
      userName,
    });

    setJoined(true);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h1>Meeting Room</h1>

      {!joined ? (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ padding: "10px", width: "250px", margin: "5px" }}
          />

          <br />

          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: "10px", width: "250px", margin: "5px" }}
          />

          <br />

          <button onClick={joinRoom} style={{ padding: "10px 20px" }}>
            Join Room
          </button>
        </>
      ) : (
        <>
          <h2>Room: {roomId}</h2>
          <p>You joined as: {userName}</p>

          <h3>Participants</h3>
          {users.length === 0 ? (
            <p>No participants yet</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {users.map((user) => (
                <li key={user.socketId}>{user.userName}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default MeetingRoom;