import { useEffect, useRef, useState } from "react";
import socket from "../../socket/socket";
import { SOCKET_EVENTS } from "../../socket/events";

export default function MeetingRoom() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [roomId, setRoomId] = useState("room1");
  const [userName, setUserName] = useState("Ilyas");
  const [participants, setParticipants] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();

    socket.on(SOCKET_EVENTS.ROOM_USERS, (users) => {
      setParticipants(users);
    });

    socket.on(SOCKET_EVENTS.USER_JOINED, (data) => {
      console.log("User joined:", data);
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, (data) => {
      console.log("User left:", data);
    });

    return () => {
      stopMedia();
      socket.off(SOCKET_EVENTS.ROOM_USERS);
      socket.off(SOCKET_EVENTS.USER_JOINED);
      socket.off(SOCKET_EVENTS.USER_LEFT);
    };
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const joinRoom = () => {
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      userName,
    });
  };

  const leaveRoom = () => {
    socket.emit(SOCKET_EVENTS.LEAVE_ROOM, {
      roomId,
      userName,
    });

    setParticipants([]);
  };

  const toggleMic = () => {
    if (!streamRef.current) return;

    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMicOn((value) => !value);
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;

    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsCamOn((value) => !value);
  };

  const endCall = () => {
    leaveRoom();
    stopMedia();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsMicOn(false);
    setIsCamOn(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b18", color: "white", padding: "40px" }}>
      <h1>Meetra Meeting Room</h1>

      <input value={userName} onChange={(e) => setUserName(e.target.value)} />
      <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />

      <button onClick={joinRoom}>Join Room</button>
      <button onClick={leaveRoom}>Leave Room</button>

      <br /><br />

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: "700px",
          height: "420px",
          background: "black",
          borderRadius: "20px",
          objectFit: "cover",
        }}
      />

      <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
        <button onClick={toggleMic}>
          {isMicOn ? "Mute Microphone" : "Unmute Microphone"}
        </button>

        <button onClick={toggleCamera}>
          {isCamOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        <button onClick={endCall}>End Call</button>
      </div>

      <h2>Participants</h2>
      {participants.map((user) => (
        <p key={user.socketId}>{user.userName}</p>
      ))}
    </div>
  );
}