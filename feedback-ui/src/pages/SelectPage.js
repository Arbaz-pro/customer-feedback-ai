export default function SelectPage({ setPage }) {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#eef2f7",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2>Customer Feedback System</h2>
        <p style={{ color: "#666" }}>Choose how you want to explore</p>

        <button
          onClick={() => setPage("user")}
          style={{
            margin: "10px",
            padding: "12px 20px",
            background: "#4f6df5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Give Feedback
        </button>

        <button
          onClick={() => setPage("admin")}
          style={{
            margin: "10px",
            padding: "12px 20px",
            background: "#222",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          View Dashboard
        </button>
      </div>
    </div>
  );
}