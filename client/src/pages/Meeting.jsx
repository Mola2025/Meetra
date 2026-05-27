import { useState } from "react";
import Lobby from "../components/Lobby";
import MeetingRoom from "../components/MeetingRoom";

function Meeting() {
  const [joined, setJoined] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1020",
        color: "white",
        textAlign: "center",
        paddingTop: "50px",
      }}
    >
      <h1>Meetra Meeting</h1>

      {!joined ? (
        <Lobby onJoin={() => setJoined(true)} />
      ) : (
        <MeetingRoom />
      )}
    </main>
  );
}

export default Meeting;