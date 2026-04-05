import FeedbackForm from "../components/FeedbackForm";

export default function UserPage({ goBack }) {
  return (
    <div style={{
      height: "100vh",
      background: "#eef2f7",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial",
    }}>
      <div>
        <FeedbackForm />

        <button
          onClick={goBack}
          style={{
            marginTop: "15px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}