import "./App.css";
import MediaPreview from "./components/MediaPreview";
import Lobby from "./components/Lobby";

function App() {
  return (
    <section id="center">
      <h1>Meetra WebRTC Test</h1>
      <MediaPreview />
      <Lobby />
    </section>
  );
}

export default App;