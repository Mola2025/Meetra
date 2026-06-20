import { useState, useMemo } from "react";
import "./CreateRoom.css";

function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle-wrap flex items-center gap-3 cursor-pointer select-none">
      <div
        className={`toggle-track relative flex-shrink-0 ${checked ? "toggle-track--on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <div className={`toggle-thumb ${checked ? "toggle-thumb--on" : ""}`} />
      </div>
      <span className="toggle-label text-sm">{label}</span>
    </label>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

import { useNavigate } from "react-router-dom";

export default function CreateRoom({ onStart, onSchedule }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [copied, setCopied] = useState(false);

  const [settings, setSettings] = useState({
    waitingRoom: true,
    recordMeeting: false,
    muteOnEntry: false,
  });

  const roomId = useMemo(() => crypto.randomUUID(), []);
  const meetingLink = `${window.location.origin}/lobby-waiting-room?room=${roomId}`;

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cr-root flex flex-col items-center justify-center min-h-screen w-full px-4 py-10">
      <div className="cr-card w-full max-w-2xl flex flex-col gap-6">

        {/* Header */}
        <h1 className="cr-title font-bold">Create New Meeting</h1>

        {/* Meeting Title */}
        <div className="flex flex-col gap-2">
          <label className="cr-label text-sm font-semibold">Meeting Title</label>
          <input
            type="text"
            className="cr-input w-full px-4 py-3 text-sm rounded-xl outline-none"
            placeholder="Enter meeting title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="cr-label text-sm font-semibold">
            Description <span className="cr-label--optional font-normal">(Optional)</span>
          </label>
          <textarea
            className="cr-textarea w-full px-4 py-3 text-sm rounded-xl outline-none resize-none"
            placeholder="Add meeting description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Settings */}
        <div className="cr-settings-card flex flex-col gap-5 rounded-2xl p-5">
          <h2 className="cr-settings-title font-bold text-base">Meeting Settings</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Toggle
              checked={settings.waitingRoom}
              onChange={() => toggleSetting("waitingRoom")}
              label="Enable waiting room"
            />
            <Toggle
              checked={settings.recordMeeting}
              onChange={() => toggleSetting("recordMeeting")}
              label="Record meeting"
            />
            <Toggle
              checked={settings.muteOnEntry}
              onChange={() => toggleSetting("muteOnEntry")}
              label="Mute participants on entry"
            />
          </div>
        </div>

        {/* Meeting Link */}
        <div className="cr-link-card flex flex-col gap-3 rounded-2xl p-5">
          <h2 className="cr-settings-title font-bold text-base">Meeting Link</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              className="cr-link-input flex-1 px-4 py-3 text-sm rounded-xl outline-none"
              value={meetingLink}
              readOnly
            />
            <button
              onClick={handleCopy}
              className={`cr-copy-btn flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 flex-shrink-0 ${copied ? "cr-copy-btn--copied" : ""}`}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "COPIED!" : "COPY LINK"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={() => {
              if (onStart) {
                onStart({ title, description, settings });
              } else {
                navigate(`/lobby-waiting-room?room=${roomId}&name=You`);
              }
            }}
            className="cr-btn-primary flex-1 py-4 rounded-xl text-sm font-bold tracking-widest transition-all duration-200"
          >
            START MEETING NOW
          </button>
          <button
            onClick={() => {
              if (onSchedule) {
                onSchedule({ title, description, settings });
              } else {
                navigate("/dashboard");
              }
            }}
            className="cr-btn-secondary flex-1 py-4 rounded-xl text-sm font-bold tracking-widest transition-all duration-200"
          >
            SCHEDULE FOR LATER
          </button>
        </div>

      </div>
    </div>
  );
}