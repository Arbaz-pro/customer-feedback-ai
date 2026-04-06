import FeedbackForm from "../components/FeedbackForm";

export default function UserPage({ goBack }) {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      background: "#507baf",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Arial",
      flexDirection: "column"
      
    }}>
    
        
        <FeedbackForm />
<button
          onClick={goBack}
          style={{
            marginTop: "15px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            marginLeft: "-260px",
alignSelf: "center",
          }}
        >
          ⬅ Back
        </button>
        
      </div>
    
  );
}