import MediaPreview from "./MediaPreview";

function Lobby({ onJoin }) {
  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <MediaPreview />

      <h2>Meeting Lobby</h2>

      <p>Configure your camera and microphone before joining the meeting.</p>

      <button
        type="button"
        onClick={onJoin}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Join Meeting
      </button>
    </div>
  );
}

export default Lobby;