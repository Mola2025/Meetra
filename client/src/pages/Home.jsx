function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f1020",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "70px" }}>Welcome to Meetra</h1>

      <p style={{ marginTop: "20px", fontSize: "20px" }}>
        Real-time video conferencing platform
      </p>

      <button
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        Get Started
      </button>
    </main>
  );
}

export default Home;