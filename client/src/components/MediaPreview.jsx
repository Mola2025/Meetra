import { useEffect, useRef } from "react";
import { testMediaDevices } from "../webrtc/mediaTest";

function MediaPreview() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      testMediaDevices(videoRef.current);
    }
  }, []);

  return (
    <div>
      <h2>Camera Preview</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        width="500"
        style={{ borderRadius: "12px", marginTop: "20px" }}
      />
    </div>
  );
}

export default MediaPreview;