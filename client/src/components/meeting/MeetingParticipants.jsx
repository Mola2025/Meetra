export default function MeetingParticipants({ onClose, participants = [] }) {
  const list = participants.length > 0
    ? participants.map((p) => ({
        id: p.socketId,
        name: p.userName,
        initials: p.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?",
        avatarColor: "#6c63ff",
        status: null,
        isMuted: false,
      }))
    : [];

  return (
    <aside className="side-panel flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h2 className="text-white font-semibold text-base">Participants ({list.length})</h2>
        <button
          onClick={onClose}
          aria-label="Close participants"
          className="text-meetra-muted hover:text-white transition-colors duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <ul className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {list.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-150"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: p.avatarColor }}
            >
              {p.initials}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white text-sm font-medium truncate">{p.name}</span>
              {p.status && (
                <span className="text-meetra-purple text-xs">{p.status}</span>
              )}
            </div>

            {p.isMuted && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                aria-label="Muted">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
