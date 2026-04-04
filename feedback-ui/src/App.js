import { useState } from "react";
import Admin from "./Admin/Admin";
// import Admin from "./Admin";

function App() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [result, setResult] = useState(null);
  const [page, setPage] = useState("select");

 const handleSubmit = async () => {
  try {
    const res = await fetch("https://feedback-backend-2j31.onrender.com/analyze", {
      // const res = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment,
        rating: rating || 1,
      }),
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();
    setResult(data);
  } catch (error) {
    console.error("ERROR:", error);
    alert("Backend not reachable / CORS issue / server down");
  }
};

  return (
 <div>
      {page === "select" && (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#eef2f7",
      fontFamily: "Arial"
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
    >
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
)}
      {page === "user" && (
 <div
    style={{
      height: "100vh",
      background: "#eef2f7",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial",
    }}
  >
    <div
      style={{
        width: "400px",
        background: "white",
        borderRadius: "16px",
        padding: "25px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >

      <h2 style={{ marginBottom: "5px" }}>Give feedback</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>
        What do you think about your experience?
      </p>

      {/* Emoji Rating */}
      <div style={{ display: "flex", justifyContent: "space-between", margin: "20px 0" }}>
        {["😡", "😕", "😐", "🙂", "😄"].map((emoji, index) => (
          <span
            key={index}
            onClick={() => setRating(index + 1)}
            style={{
              fontSize: "28px",
              cursor: "pointer",
              transform: rating === index + 1 ? "scale(1.3)" : "scale(1)",
              transition: "0.2s",
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        rows="4"
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            padding: "10px",
            background: "#4f6df5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Send
        </button>

        <button
          onClick={() => {
            setComment("");
            setRating(0);
            setResult(null);
          }}
          style={{
            flex: 1,
            padding: "10px",
            background: "#eee",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>

      {/* AI Response */}
      {result && (
  <div style={{ marginTop: "20px" }}>
    
    {/* AI Response */}
    <div
      style={{
        padding: "15px",
        borderRadius: "10px",
        background: "#f1f5ff",
      }}
    >
      <strong>🤖 AI Response:</strong>
      <p style={{ marginTop: "5px" }}>{result.ai_response}</p>
    </div>

    {/* Aspects */}
    {result.aspects && result.aspects.length > 0 && (
      <div style={{ marginTop: "15px" }}>
        <strong>Analysis:</strong>

        {result.aspects.map((item, index) => (
          <div
            key={index}
            style={{
              marginTop: "8px",
              padding: "8px",
              borderRadius: "8px",
              background:
                item.sentiment === "positive"
                  ? "#d4edda"
                  : item.sentiment === "negative"
                  ? "#f8d7da"
                  : "#fff3cd",
            }}
          >
            {item.aspect} → {item.sentiment}
          </div>
        ))}
      </div>
    )}
  </div>
)}
    </div>
  </div>
)}
      {page === "admin" && (<Admin />
  )}
  </div>
);
  
}


export default App;