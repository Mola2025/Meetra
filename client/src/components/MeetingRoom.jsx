import { useEffect, useRef, useState } from "react";
import socket from "../socket/socket";

function MeetingRoom() {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    socket.on("room-users", (users) => {
      setParticipants(users);
    });

    socket.on("user-joined", (data) => {
      setParticipants(data.users || []);
    });

    socket.on("user-left", (data) => {
      setParticipants(data.users || []);
    });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, joined]);

  const joinRoom = async () => {
    if (!roomId || !userName) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);

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

  const leaveRoom = () => {
    socket.emit("leave-room", {
      roomId,
      userName,
    });

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
    setParticipants([]);
    setJoined(false);
    setIsMuted(false);
    setCameraOff(false);
  };

  const toggleMute = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCameraOff(!cameraOff);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1020",
        color: "white",
        paddingTop: "50px",
        textAlign: "center",
      }}
    >
      {!joined ? (
        <>
          <h1>Join Meeting Room</h1>

          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              padding: "12px",
              margin: "10px",
              borderRadius: "8px",
              width: "250px",
            }}
          />

          <br />

          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{
              padding: "12px",
              margin: "10px",
              borderRadius: "8px",
              width: "250px",
            }}
          />

          <br />

          <button
            onClick={joinRoom}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Join Room
          </button>
        </>
      ) : (
        <>
          <h1>Meeting Room</h1>

          <h3>Room: {roomId}</h3>

          <p>Joined as: {userName}</p>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "500px",
              maxWidth: "90%",
              borderRadius: "20px",
              marginTop: "20px",
              background: "#000",
            }}
          />

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={toggleMute}
              style={{
                padding: "12px 20px",
                marginRight: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                background: isMuted ? "#ff4d4d" : "#4caf50",
                color: "white",
                border: "none",
              }}
            >
              {isMuted ? "Unmute Microphone" : "Mute Microphone"}
            </button>

            <button
              onClick={toggleCamera}
              style={{
                padding: "12px 20px",
                marginRight: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                background: cameraOff ? "#ff4d4d" : "#2196f3",
                color: "white",
                border: "none",
              }}
            >
              {cameraOff ? "Turn Camera On" : "Turn Camera Off"}
            </button>

            <button
              onClick={leaveRoom}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#777",
                color: "white",
                border: "none",
              }}
            >
              Leave Room
            </button>
          </div>

          <div style={{ marginTop: "40px" }}>
            <h2>Participants</h2>

            {participants.length === 0 ? (
              <p>No participants connected</p>
            ) : (
              participants.map((user, index) => (
                <p key={index}>{user.userName}</p>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MeetingRoom;