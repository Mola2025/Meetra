import { useEffect, useState } from "react";
import socket from "../socket/socket";

function MeetingRoom() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);

  const [participants, setParticipants] = useState([]);

  const [isMuted, setIsMuted] = useState(false);
  const [audioTrack, setAudioTrack] = useState(null);

  useEffect(() => {
    socket.on("room-users", (users) => {
      setParticipants(users);
    });

    return () => {
      socket.off("room-users");
    };
  }, []);

  const joinRoom = async () => {
    if (!roomId || !userName) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      const track = stream.getAudioTracks()[0];
      setAudioTrack(track);

      socket.emit("join-room", {
        roomId,
        userName,
      });

      setJoined(true);
    } catch (error) {
      console.log(error);
      alert("Camera or microphone access denied");
    }
  };

  const toggleMute = () => {
    if (!audioTrack) return;

    if (isMuted) {
      audioTrack.enabled = true;
      setIsMuted(false);
    } else {
      audioTrack.enabled = false;
      setIsMuted(true);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1020",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "100px",
      }}
    >
      <h1 style={{ fontSize: "60px" }}>Meetra WebRTC Test</h1>

      {!joined ? (
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            width: "300px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Meeting Room</h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <button
            onClick={joinRoom}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Join Room
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: "50px",
            textAlign: "center",
          }}
        >
          <h2>Meeting Room</h2>

          <h3>Room: {roomId}</h3>

          <p>You joined as: {userName}</p>

          <button
            onClick={toggleMute}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: isMuted ? "#ff4d4d" : "#4caf50",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {isMuted ? "Unmute Microphone" : "Mute Microphone"}
          </button>

          <div style={{ marginTop: "40px" }}>
            <h3>Participants</h3>

            {participants.map((user, index) => (
              <p key={index}>{user}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;