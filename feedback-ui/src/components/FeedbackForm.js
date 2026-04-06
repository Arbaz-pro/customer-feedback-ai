import { useState } from "react";
import { analyzeFeedback } from "../services/api";

export default function FeedbackForm() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
     if (!comment) return;

  setLoading(true); // start loading

  try {
    const data = await analyzeFeedback(comment, rating);
    setResult(data);
  } catch (err) {
    alert("Backend issue");
  } finally {
    setLoading(false); // stop loading
  }
};

  return (
    
    <div style={{
      
      height: "fit-content",
      maxWidth: "300px",
      width: "90%",
      background: "#ffffff",
      borderRadius: "16px",
      padding: "25px",
      boxShadow: "0 10px 30px rgb(7, 37, 170)",
    }}>
      <h2 style={{ marginBottom: "5px" }}>Give feedback</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>
        What do you think about your experience?
      </p>

      {/* Emoji Rating */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "20px 0"
      }}>
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
          width: "95%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          marginBottom: "15px",
        }}
      />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "20px"}}>
        <button
  onClick={handleSubmit}
  disabled={loading}
  style={{
    flex: 1,
    padding: "10px",
    background: loading ? "#9aa7ff" : "#4f6df5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: loading ? "not-allowed" : "pointer",
  }}
>
  {loading ? "Submitting..." : "Send"}
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

      {/* Result */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <div style={{
            padding: "15px",
            borderRadius: "10px",
            background: "#f1f5ff",
          }}>
            <strong>🤖 AI Response:</strong>
            <p>{result.ai_response}</p>
          </div>

          {result.aspects?.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <strong>Analysis:</strong>

              {result.aspects.map((item, i) => (
                <div
                  key={i}
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    borderRadius: "8px",
                    background:
                      item.sentiment === "Positive"
                        ? "#8bf7a4"
                        : item.sentiment === "Negative"
                        ? "#fda4ac"
                        : "#fcff4b",
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
  );
}