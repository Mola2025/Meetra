import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./LobbyWaitingRoom.css";

function CameraIcon({ muted }) {
  return muted ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h2a2 2 0 0 1 2 2v9.34" />
      <path d="M17 9l4-2v10l-4-2" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="15" height="12" rx="2" />
      <path d="M17 9l5-3v12l-5-3V9z" />
    </svg>
  );
}

function MicIcon({ muted }) {
  return muted ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function VideoCallInfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="15" height="12" rx="2" />
      <path d="M17 9l5-3v12l-5-3V9z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

export default function LobbyWaitingRoom({
  meetingTitle = "Team Standup Meeting",
  hostName = "Sarah Johnson",
  participantCount = 8,
  userInitials = "JD",
  userName = "You",
  features = "Screen sharing, recording, AI transcription enabled",
  onJoin,
  onCancel,
}) {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camera, setCamera] = useState("Built-in Camera");
  const [microphone, setMicrophone] = useState("Built-in Microphone");
  const [speaker, setSpeaker] = useState("Built-in Speaker");
  const [waitingApproval, setWaitingApproval] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room") || "room1";

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    startLocalMedia();
    return () => stopLocalMedia();
  }, []);

  const startLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera preview error:", error);
    }
  };

  const stopLocalMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  };

  const handleToggleCamera = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCameraOn((v) => !v);
  };

  const handleToggleMic = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMicOn((v) => !v);
  };

  const cameraOptions = ["Built-in Camera", "External Webcam", "Virtual Camera"];
  const micOptions = ["Built-in Microphone", "External Microphone", "Headset Mic"];
  const speakerOptions = ["Built-in Speaker", "Headphones", "External Speaker"];

  return (
    <div className="lwr-root flex items-center justify-center min-h-screen w-full px-6 py-10">
      <div className="lwr-layout grid gap-8 w-full max-w-5xl">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* Camera preview */}
          <div className="lwr-preview-card flex flex-col items-center justify-between rounded-2xl overflow-hidden">
            <div className="lwr-preview-area flex flex-col items-center justify-center flex-1 w-full gap-3 py-8 relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: cameraOn ? "block" : "none" }}
              />
              {!cameraOn && (
                <>
                  <div className="lwr-avatar flex items-center justify-center rounded-full font-bold z-10">
                    {userInitials}
                  </div>
                  <span className="lwr-preview-label text-sm z-10">Camera Off</span>
                </>
              )}
            </div>
            <div className="lwr-controls flex items-center gap-3 pb-5">
              <button
                onClick={handleToggleCamera}
                className={`lwr-ctrl-btn flex items-center justify-center rounded-full transition-all duration-200 ${!cameraOn ? "lwr-ctrl-btn--muted" : ""}`}
                title={cameraOn ? "Turn off camera" : "Turn on camera"}
              >
                <CameraIcon muted={!cameraOn} />
              </button>
              <button
                onClick={handleToggleMic}
                className={`lwr-ctrl-btn flex items-center justify-center rounded-full transition-all duration-200 ${!micOn ? "lwr-ctrl-btn--muted" : ""}`}
                title={micOn ? "Mute microphone" : "Unmute microphone"}
              >
                <MicIcon muted={!micOn} />
              </button>
            </div>
          </div>

          {/* Audio & Video settings */}
          <div className="lwr-settings-card flex flex-col gap-4 rounded-2xl p-5">
            <h2 className="lwr-settings-title font-bold text-base">Audio &amp; Video Settings</h2>

            <div className="flex flex-col gap-1.5">
              <label className="lwr-select-label text-xs font-semibold">Camera</label>
              <select
                className="lwr-select w-full px-4 py-3 text-sm rounded-xl outline-none"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
              >
                {cameraOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="lwr-select-label text-xs font-semibold">Microphone</label>
              <select
                className="lwr-select w-full px-4 py-3 text-sm rounded-xl outline-none"
                value={microphone}
                onChange={(e) => setMicrophone(e.target.value)}
              >
                {micOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="lwr-select-label text-xs font-semibold">Speaker</label>
              <select
                className="lwr-select w-full px-4 py-3 text-sm rounded-xl outline-none"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
              >
                {speakerOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col justify-center gap-6">

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1 className="lwr-title font-bold">Ready to join?</h1>
            <p className="lwr-subtitle">{meetingTitle}</p>
          </div>

          {/* Info card */}
          <div className="lwr-info-card flex flex-col gap-4 rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <div className="lwr-info-icon-wrap flex items-center justify-center rounded-lg flex-shrink-0">
                <VideoCallInfoIcon />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="lwr-info-title text-sm font-bold">Host: {hostName}</span>
                <span className="lwr-info-sub text-sm">{participantCount} participants in waiting room</span>
              </div>
            </div>
            <div className="lwr-info-divider" />
            <div className="flex items-start gap-4">
              <div className="lwr-info-icon-wrap flex items-center justify-center rounded-lg flex-shrink-0">
                <MonitorIcon />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="lwr-info-title text-sm font-bold">Meeting Features</span>
                <span className="lwr-info-sub text-sm">{features}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
            {!waitingApproval ? (
            <div className="flex flex-col rounded-2xl overflow-hidden">
                <button
                onClick={() => {
                    stopLocalMedia();

                    navigate(`/meeting?room=${roomId}&name=${encodeURIComponent(userName)}`);
                }}
                className="lwr-btn-join py-4 text-sm font-bold tracking-widest transition-all duration-200"
                >
                JOIN MEETING
                </button>

                <button
                onClick={() => {
                    stopLocalMedia();
                    navigate("/home");
                }}
                className="lwr-btn-cancel py-4 text-sm font-bold tracking-widest transition-all duration-200"
                >
                CANCEL
                </button>
            </div>
            ) : (
            <div className="lwr-waiting-card rounded-2xl p-6 flex flex-col items-center gap-4">
                <div className="lwr-spinner"></div>

                <h3 className="lwr-waiting-title">
                Waiting for host approval
                </h3>

                <p className="lwr-waiting-text">
                Your request has been sent. The host will admit you shortly.
                </p>
            </div>
            )}

          {/* Legal */}
          <p className="lwr-legal text-xs text-center">
            By joining, you agree to our{" "}
            <a href="#" className="lwr-legal-link">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="lwr-legal-link">Privacy Policy</a>
          </p>
        </div>

      </div>
    </div>
  );
}