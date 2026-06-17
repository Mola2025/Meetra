import { useState, useEffect, useRef } from "react";

export default function MeetingRoom() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();

    return () => {
      stopMedia();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTracks = streamRef.current.getAudioTracks();

    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMicOn(!isMicOn);
  };

  const toggleCamera = async () => {
    if (!streamRef.current) return;

    const videoTracks = streamRef.current.getVideoTracks();

    if (isCamOn) {
      videoTracks.forEach((track) => {
        track.enabled = false;
      });
    } else {
      videoTracks.forEach((track) => {
        track.enabled = true;
      });
    }

    setIsCamOn(!isCamOn);
  };

  const endCall = () => {
    stopMedia();

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsMicOn(false);
    setIsCamOn(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0b18",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>Meetra Meeting Room</h1>

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

      <div
        style={{
          marginTop: "25px",
          display: "flex",
          gap: "15px",
        }}
      >
        <button onClick={toggleMic}>
          {isMicOn ? "Mute Microphone" : "Unmute Microphone"}
        </button>

        <button onClick={toggleCamera}>
          {isCamOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        <button onClick={endCall}>End Call</button>
      </div>
    </div>
  );
}