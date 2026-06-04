import { useState, useEffect } from "react";

// ── Reusable Components ─────────────────────────────────────────────────
import TopBarButton      from "../../components/meeting/TopBarButton";
import ControlBarButton  from "../../components/meeting/ControlBarButton";
import ParticipantCard   from "../../components/meeting/ParticipantCard";
import MeetingChat       from "../../components/meeting/MeetingChat";
import MeetingParticipants from "../../components/meeting/MeetingParticipants";

import "./MeetingRoom.css";

/* ─── SVG asset imports ──────────────────────────────────────────────────────*/
import MicSvg          from "../../assets/mic.svg";
import MicOffSvg       from "../../assets/mic-off.svg";
import VideoSvg        from "../../assets/video.svg";
import VideoOffSvg     from "../../assets/video-off.svg";
import ScreenSvg       from "../../assets/screen.svg";
import HandSvg         from "../../assets/hand.svg";
import EmojiSvg        from "../../assets/emoji.svg";
import ChatSvg         from "../../assets/chat.svg";
import ParticipantsSvg from "../../assets/participants.svg";
import EndCallSvg      from "../../assets/end-call.svg";

/* ─── SVG icon helpers ───────────────────────────────────────────────────────*/
const Icon = {
  mic: <img src={MicSvg} width={20} height={20} alt="" />,
  micOff: <img src={MicOffSvg} width={20} height={20} alt="" />,
  video: <img src={VideoSvg} width={20} height={20} alt="" />,
  videoOff: <img src={VideoOffSvg} width={20} height={20} alt="" />,
  screen: <img src={ScreenSvg} width={20} height={20} alt="" />,
  hand: <img src={HandSvg} width={20} height={20} alt="" />,
  emoji: <img src={EmojiSvg} width={20} height={20} alt="" />,
  chat: <img src={ChatSvg} width={20} height={20} alt="" />,
  participants: <img src={ParticipantsSvg} width={20} height={20} alt="" />,
  endCall: <img src={EndCallSvg} width={22} height={22} alt="" />,
};

/* ─── Participant data ───────────────────────────────────────────────────────*/
const PARTICIPANTS = [
  { id: 1, initials: "SJ", name: "Sarah Johnson",   isSpeaking: true,  isMuted: false, avatarColor: "#6c63ff" },
  { id: 2, initials: "MC", name: "Michael Chen",    isSpeaking: false, isMuted: false, avatarColor: "#4a4080" },
  { id: 3, initials: "ER", name: "Emily Rodriguez", isSpeaking: false, isMuted: true,  avatarColor: "#4a4080" },
  { id: 4, initials: "JW", name: "James Wilson",    isSpeaking: false, isMuted: false, avatarColor: "#3d3a6c" },
  { id: 5, initials: "JD", name: "You",             isSpeaking: false, isMuted: false, avatarColor: "#3d3a6c" },
];

/* ─── Meeting timer hook ─────────────────────────────────────────────────────*/
function useMeetingTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secondsDisplay = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secondsDisplay}`;
}

/* ─── Main component ─────────────────────────────────────────────────────────*/
export default function MeetingRoom() {
  const [isMicOn,     setIsMicOn]     = useState(true);
  const [isCamOn,     setIsCamOn]     = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [activePanel, setActivePanel] = useState(null); // "chat" | "participants" | null

  const timer = useMeetingTimer();

  const togglePanel = (panel) =>
    setActivePanel((prev) => (prev === panel ? null : panel));

  return (
    <div className="meeting-root flex flex-col h-screen w-full overflow-hidden">

      {/* ══════ TOP BAR ══════════════════════════════════════════════════════ */}
      <header className="meeting-topbar flex items-center justify-between px-5 py-3 border-b border-white/8">

        {/* Left: title + recording pill */}
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">Team Standup Meeting</span>

          <button
            onClick={() => setIsRecording((r) => !r)}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className={`
              record-pill flex items-center gap-1.5
              px-3 py-1 rounded-full text-xs font-semibold
              transition-all duration-200
              ${isRecording
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-white/10 text-meetra-muted hover:bg-white/15"
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-meetra-muted"}`} />
            {isRecording ? "Recording" : "Record Meeting"}
          </button>
        </div>

        {/* Center: timer + participants count */}
        <div className="flex items-center gap-4 text-meetra-muted text-sm">
          <span className="font-mono">{timer}</span>
          <span>•</span>
          <span>{PARTICIPANTS.length} participants</span>
        </div>

        {/* Right: Chat, Participants*/}
        <div className="flex items-center gap-1">
          <TopBarButton
            icon={Icon.chat}
            label="Chat"
            active={activePanel === "chat"}
            badge={activePanel !== "chat" ? 2 : null}
            onClick={() => togglePanel("chat")}
          />
          <TopBarButton
            icon={Icon.participants}
            label="Participants"
            active={activePanel === "participants"}
            onClick={() => togglePanel("participants")}
          />
        </div>
      </header>

      {/* ══════ BODY: video grid + side panel ════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video grid */}
        <main className="flex-1 p-4 overflow-hidden">
          <div className="video-grid h-full grid gap-3">
            {PARTICIPANTS.map((p) => (
              <ParticipantCard key={p.id} {...p} />
            ))}
          </div>
        </main>

        {/* Side panel */}
        {activePanel && (
          <div className="side-panel-wrapper border-l border-white/8 w-125 flex-shrink-0 overflow-hidden">
            {activePanel === "chat" && (
              <MeetingChat onClose={() => setActivePanel(null)} />
            )}
            {activePanel === "participants" && (
              <MeetingParticipants onClose={() => setActivePanel(null)} />
            )}
          </div>
        )}
      </div>

      {/* ══════ BOTTOM CONTROL BAR ═══════════════════════════════════════════ */}
      <footer className="meeting-controlbar flex items-center justify-between px-6 py-4 border-t border-white/8">

        {/* Left: layout controls */}
        <div className="flex items-center gap-2">
        </div>

        {/* Center: main media controls */}
        <div className="flex items-center gap-3">
          <ControlBarButton
            icon={isMicOn ? Icon.mic : Icon.micOff}
            label={isMicOn ? "Mute microphone" : "Unmute microphone"}
            active={isMicOn}
            danger={!isMicOn}
            onClick={() => setIsMicOn((v) => !v)}
          />
          <ControlBarButton
            icon={isCamOn ? Icon.video : Icon.videoOff}
            label={isCamOn ? "Turn off camera" : "Turn on camera"}
            active={isCamOn}
            danger={!isCamOn}
            onClick={() => setIsCamOn((v) => !v)}
          />
          <ControlBarButton icon={Icon.screen}  label="Share screen" onClick={() => {}} />
          <ControlBarButton icon={Icon.hand}    label="Raise hand"   onClick={() => {}} />
          <ControlBarButton icon={Icon.emoji}   label="React"        onClick={() => {}} />
          <ControlBarButton icon={Icon.endCall} label="End call"     danger onClick={() => {}} />
        </div>

        {/* Right: Gap for keeping the layout centered */}
        <div className="flex items-center gap-2">
        </div>
      </footer>
    </div>
  );
}