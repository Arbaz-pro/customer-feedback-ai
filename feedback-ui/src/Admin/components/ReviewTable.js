import { useState } from "react";
import { tableStyle, thStyle, tdStyle } from "../styles";
import { exportCSV } from "./utils/exportUtils";
import ExportButton from "./utils/exportButton";

export default function ReviewTable({ reviews }) {
  const [sortConfig, setSortConfig] = useState({
  key: null,
  direction: "asc",
});
const [year, setYear] = useState("");
const [month, setMonth] = useState("");
const [day, setDay] = useState("");
const filteredReviews = reviews.filter((r) => {
  const date = new Date(r.created_at);

  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString(); // 1-12
  const d = date.getDate().toString();

  return (
    (!year || year === y) &&
    (!month || month === m) &&
    (!day || day === d)
  );
}); 
const sortedReviews = [...filteredReviews].sort((a, b) => {
  if (!sortConfig.key) return 0;

  let aVal = a[sortConfig.key];
  let bVal = b[sortConfig.key];

  if (sortConfig.key === "created_at") {
    aVal = new Date(a.created_at);
    bVal = new Date(b.created_at);
  }

  if (typeof aVal === "string") {
    return sortConfig.direction === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  }

  return sortConfig.direction === "asc"
    ? aVal - bVal
    : bVal - aVal;
});
const handleSort = (key) => {
  setSortConfig((prev) => ({
    key,
    direction:
      prev.key === key && prev.direction === "asc"
        ? "desc"
        : "asc",
  }));
};
const getArrow = (key) => {
  if (sortConfig.key !== key) return "";
  return sortConfig.direction === "asc" ? " ↑" : " ↓";
};

return (
  <div style={{marginTop: "30px",
    background: "linear-gradient(135deg, #314982, #1e293b)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    color: "white",}}>
    <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  flexWrap: "wrap",
  gap: "10px"
}}>

  <h2>All Reviews Data</h2>

  <div style={{ display: "flex", gap: "10px" }}>

    {/* YEAR */}
    <select value={year} onChange={(e) => setYear(e.target.value)}>
      <option value="">Year</option>
      {[...new Set(reviews.map(r => new Date(r.created_at).getFullYear()))]
        .map(y => <option key={y} value={y}>{y}</option>)}
    </select>

    {/* MONTH */}
    <select value={month} onChange={(e) => setMonth(e.target.value)}>
      <option value="">Month</option>
      {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>

    {/* DAY */}
    <select value={day} onChange={(e) => setDay(e.target.value)}>
      <option value="">Day</option>
      {[...Array(31)].map((_, i) => (
        <option key={i+1} value={i+1}>{i+1}</option>
      ))}
    </select>

    {/* EXPORT BUTTON */}
    <ExportButton
      onClick={() =>
        exportCSV(filteredReviews, "filtered_reviews.csv")
      }
    />

  </div>
</div>
<div style={{ overflowX: "auto" }}>
    <table style={{tableStyle, borderRadius: "10px", overflow: "hidden"}}>
  <thead>
    <tr>
      <th style={thStyle} onClick={() => handleSort("id")}>
  ID{getArrow("id")}
</th>

<th style={thStyle} onClick={() => handleSort("comment")}>
  Comment{getArrow("comment")}
</th>

<th style={thStyle} onClick={() => handleSort("aspect")}>
  Aspect{getArrow("aspect")}
</th>

<th style={thStyle} onClick={() => handleSort("sentiment")}>
  Sentiment{getArrow("sentiment")}
</th>

<th style={thStyle} onClick={() => handleSort("user_rating")}>
  User Rating{getArrow("user_rating")}
</th>

<th style={thStyle} onClick={() => handleSort("predicted_rating")}>
  Predicted Rating{getArrow("predicted_rating")}
</th>

<th style={thStyle} onClick={() => handleSort("created_at")}>
  Date{getArrow("created_at")}
</th>
    </tr>
  </thead>

  <tbody>
    {reviews.length > 0 ? (
      sortedReviews.map((r, i) => (
        <tr
          key={i}
          style={{
            background: i % 2 === 0 ? "#1e293b" : "#0f172a", // 🔥 zebra striping
            transition: "0.2s"
          }}
          onMouseEnter={(e) =>
  (e.currentTarget.style.background = "#334155")
}
onMouseLeave={(e) =>
  (e.currentTarget.style.background =
    i % 2 === 0 ? "#1e293b" : "#0f172a")
}
        >
          <td style={tdStyle}>{r.id}</td>
          <td style={tdStyle}>{r.comment}</td>
          <td style={tdStyle}>{r.aspect}</td>

          <td
            style={{
              ...tdStyle,
              color:
  r.sentiment === "Positive"
    ? "#16a34a"
    : r.sentiment === "Neutral"
    ? "#f97316"   // orange
    : "#dc2626",
              fontWeight: "600"
            }}
          >
            {r.sentiment}
          </td>

          <td style={tdStyle}>{r.user_rating}</td>
          <td style={tdStyle}>{r.predicted_rating}</td>

          <td style={tdStyle}>
            {new Date(r.created_at).toLocaleDateString()}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" style={{ padding: "20px", textAlign: "center" }}>
          No data found
        </td>
      </tr>
    )}
  </tbody>
</table>
</div>
  </div>
);
} 
