function Dashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#15162c",
        color: "white",
        padding: "50px",
      }}
    >
      <h1 style={{ fontSize: "50px" }}>Dashboard</h1>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#1f213d",
            padding: "30px",
            borderRadius: "15px",
            width: "250px",
          }}
        >
          <h2>Meetings</h2>
          <p>0 Scheduled Meetings</p>
        </div>

        <div
          style={{
            background: "#1f213d",
            padding: "30px",
            borderRadius: "15px",
            width: "250px",
          }}
        >
          <h2>Participants</h2>
          <p>0 Connected Users</p>
        </div>

        <div
          style={{
            background: "#1f213d",
            padding: "30px",
            borderRadius: "15px",
            width: "250px",
          }}
        >
          <h2>Account</h2>
          <p>User profile information</p>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;