export default function ParticipantCard({
  initials,
  name,
  isSpeaking = false,
  isMuted = false,
  avatarColor = "#3d3a6c",
}) {
  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-2xl overflow-hidden
        bg-meetra-card min-h-[180px]
        transition-all duration-300
        ${isSpeaking ? "ring-2 ring-meetra-purple ring-offset-2 ring-offset-meetra-bg" : ""}
      `}
    >
      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full w-20 h-20 text-white font-semibold text-2xl select-none"
        style={{ backgroundColor: avatarColor }}
      >
        {initials}
      </div>

      {/* Name label */}
      <div className="
        absolute bottom-3 left-3
        flex items-center gap-1.5
        bg-black/70 text-white
        text-xs font-semibold
        px-2.5 py-1 rounded-lg
      ">
        {name}
        {isMuted && (
          <span className="text-red-400" aria-label="Muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}