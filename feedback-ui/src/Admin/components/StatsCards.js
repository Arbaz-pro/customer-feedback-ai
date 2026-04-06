import { cardStyle } from "../styles";
export default function StatsCards({ data, setView }) {
  return (
    <div style={{ display: "flex",flexWrap:"wrap", gap: "20px", marginBottom: "20px" }}>
        
        <button style={cardStyle} onClick={() => setView((prev) => (prev === "overview" ? "table" : "overview"))}>
          <h3>Total Reviews</h3>
          <p>{data.total_reviews}</p>

        </button>

        <button style={cardStyle} onClick={() => setView("positive")}>
  <h3>Positive %</h3>
</button>

        <button style={cardStyle} onClick={() => setView("negative")}>
  <h3>Negative %</h3>
</button>
</div>
  );
}