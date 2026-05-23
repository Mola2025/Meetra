function Lobby() {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Meeting Lobby</h2>

      <p>
        Configure your camera and microphone before joining the meeting.
      </p>

      <button
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
