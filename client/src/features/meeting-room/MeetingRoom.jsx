import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import socket from "../../socket/socket";
import { SOCKET_EVENTS } from "../../socket/events";

import TopBarButton from "../../components/meeting/TopBarButton";
import ControlBarButton from "../../components/meeting/ControlBarButton";
import ParticipantCard from "../../components/meeting/ParticipantCard";
import MeetingChat from "../../components/meeting/MeetingChat";
import MeetingParticipants from "../../components/meeting/MeetingParticipants";

import "./MeetingRoom.css";

import MicSvg from "../../assets/mic.svg";
import MicOffSvg from "../../assets/mic-off.svg";
import VideoSvg from "../../assets/video.svg";
import VideoOffSvg from "../../assets/video-off.svg";
import ScreenSvg from "../../assets/screen.svg";
import HandSvg from "../../assets/hand.svg";
import EmojiSvg from "../../assets/emoji.svg";
import ChatSvg from "../../assets/chat.svg";
import ParticipantsSvg from "../../assets/participants.svg";
import EndCallSvg from "../../assets/end-call.svg";

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

function useMeetingTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return `${hours}:${minutes}:${secs}`;
}

export default function MeetingRoom() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room") || "room1";
  const userName = searchParams.get("name") || "You";

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [mediaError, setMediaError] = useState(null);

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const timer = useMeetingTimer();

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

      setIsMicOn(true);
      setIsCamOn(true);
      setMediaError(null);
    } catch (error) {
      console.error("Camera/microphone error:", error);
      setMediaError("Camera or microphone access denied. Please check permissions.");
      setIsMicOn(false);
      setIsCamOn(false);
    }
  };

  const stopLocalMedia = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    startLocalMedia();

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, userName });

    socket.on(SOCKET_EVENTS.ROOM_USERS, (users) => {
      setParticipants(users);
    });

    socket.on(SOCKET_EVENTS.USER_JOINED, (data) => {
      setParticipants(data.users || []);
    });

    socket.on(SOCKET_EVENTS.USER_LEFT, (data) => {
      setParticipants(data.users || []);
    });

    return () => {
      stopLocalMedia();
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userName });
      socket.off(SOCKET_EVENTS.ROOM_USERS);
      socket.off(SOCKET_EVENTS.USER_JOINED);
      socket.off(SOCKET_EVENTS.USER_LEFT);
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isCamOn && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [isCamOn]);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const toggleMicrophone = async () => {
    if (!localStreamRef.current) {
      await startLocalMedia();
      return;
    }

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMicOn((v) => !v);
  };

  const toggleCamera = async () => {
    if (!localStreamRef.current) {
      await startLocalMedia();
      return;
    }

    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsCamOn((v) => !v);
  };

  const endCall = () => {
    stopLocalMedia();

    socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userName });

    setParticipants([]);
    setIsMicOn(false);
    setIsCamOn(false);
  };

  return (
    <div className="meeting-root flex flex-col h-screen w-full overflow-hidden">
      <header className="meeting-topbar flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold text-sm">
            {roomId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>

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

        <div className="flex items-center gap-4 text-meetra-muted text-sm">
          <span className="font-mono">{timer}</span>
          <span>•</span>
          <span>{participants.length} participant{participants.length !== 1 ? "s" : ""}</span>
        </div>

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

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-4 overflow-hidden">
          {mediaError && (
            <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-xl text-center">
              {mediaError}
            </div>
          )}

          <div className="video-grid h-full grid gap-3">
            <ParticipantCard
              initials={userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
              name={userName}
              isMuted={!isMicOn}
              videoRef={isCamOn ? localVideoRef : null}
            />

            {participants
              .filter((p) => p.userName !== userName)
              .map((p) => (
                <ParticipantCard
                  key={p.socketId}
                  initials={p.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                  name={p.userName}
                />
              ))}
          </div>
        </main>

        {activePanel && (
          <div className="side-panel-wrapper border-l border-white/8 w-125 flex-shrink-0 overflow-hidden">
            {activePanel === "chat" && (
              <MeetingChat onClose={() => setActivePanel(null)} />
            )}
            {activePanel === "participants" && (
              <MeetingParticipants
                onClose={() => setActivePanel(null)}
                participants={participants}
              />
            )}
          </div>
        )}
      </div>

      <footer className="meeting-controlbar flex items-center justify-between px-6 py-4 border-t border-white/8">
        <div className="flex items-center gap-2"></div>

        <div className="flex items-center gap-3">
          <ControlBarButton
            icon={isMicOn ? Icon.mic : Icon.micOff}
            label={isMicOn ? "Mute microphone" : "Unmute microphone"}
            active={isMicOn}
            danger={!isMicOn}
            onClick={toggleMicrophone}
          />
          <ControlBarButton
            icon={isCamOn ? Icon.video : Icon.videoOff}
            label={isCamOn ? "Turn off camera" : "Turn on camera"}
            active={isCamOn}
            danger={!isCamOn}
            onClick={toggleCamera}
          />
          <ControlBarButton icon={Icon.screen} label="Share screen" onClick={() => {}} />
          <ControlBarButton icon={Icon.hand} label="Raise hand" onClick={() => {}} />
          <ControlBarButton icon={Icon.emoji} label="React" onClick={() => {}} />
          <ControlBarButton icon={Icon.endCall} label="End call" danger onClick={endCall} />
        </div>

        <div className="flex items-center gap-2"></div>
      </footer>
    </div>
  );
}
