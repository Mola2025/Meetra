import { useEffect, useRef } from "react";
import { testMediaDevices } from "./webrtc/mediaTest";
import "./App.css";

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      testMediaDevices(videoRef.current);
    }
  }, []);

  return (
    <section id="center">
      <h1>Meetra WebRTC Test</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="600"
        style={{
          borderRadius: "12px",
          marginTop: "20px",
        }}
      />
    </section>
  );
}

export default App;