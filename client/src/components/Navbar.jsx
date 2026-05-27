import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#0f1020",
        color: "white",
      }}
    >
      <h2>Meetra</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>

        <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
          Dashboard
        </Link>

        <Link to="/meeting" style={{ color: "white", textDecoration: "none" }}>
          Meeting
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;