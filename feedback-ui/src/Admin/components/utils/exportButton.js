export default function ExportButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 10px",
        fontSize: "12px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        background: "#38bdf8",
        color: "white",
      }}
    >
      ⬇ Export
    </button>
  );
}