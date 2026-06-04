import { useState } from "react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "Sarah Johnson",
    initials: "SJ",
    avatarColor: "#6c63ff",
    time: "10:15 AM",
    text: "Great progress on the project! Let's review the timeline.",
  },
  {
    id: 2,
    sender: "Michael Chen",
    initials: "MC",
    avatarColor: "#9c4dcc",
    time: "10:16 AM",
    text: "Agreed! I'll share my screen.",
  },
];

export default function MeetingChat({ onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "You",
        initials: "JD",
        avatarColor: "#3d3a7c",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: input.trim(),
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="side-panel flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h2 className="text-white font-semibold text-base">Meeting Chat</h2>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="text-meetra-muted hover:text-white transition-colors duration-150"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
              style={{ backgroundColor: msg.avatarColor }}
            >
              {msg.initials}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white text-sm font-semibold">{msg.sender}</span>
                <span className="text-meetra-muted text-xs">{msg.time}</span>
              </div>
              <p className="text-meetra-muted text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="
            flex-1 bg-white/10 text-white placeholder-meetra-muted
            text-sm rounded-xl px-4 py-2.5
            outline-none border border-transparent
            focus:border-meetra-purple transition-colors duration-150
          "
        />
        <button
          onClick={handleSend}
          className="
            bg-meetra-purple hover:bg-meetra-purple-light
            text-white text-sm font-bold tracking-wider
            px-4 py-2.5 rounded-xl
            transition-colors duration-150
          "
        >
          SEND
        </button>
      </div>
    </aside>
  );
}