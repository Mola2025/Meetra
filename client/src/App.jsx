import { useState } from "react";
import Lobby from "./components/Lobby";
import MeetingRoom from "./components/MeetingRoom";
import "./App.css";

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <section id="center">
      <h1>Meetra WebRTC Test</h1>

      {!joined ? (
        <Lobby onJoin={() => setJoined(true)} />
      ) : (
        <MeetingRoom />
      )}
    </section>
  );
}

export default App;