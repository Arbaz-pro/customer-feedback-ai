export default function Header({ setView }) {
  return (
    <h1
  style={{
    cursor: "pointer",
    color: "white",
    display: "inline-block",
    transition: "0.2s"
    
  }}
  onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
  onMouseLeave={(e) => (e.target.style.opacity = "1")}
  onClick={() => setView("overview")}
>
  Admin Dashboard
</h1>
  );
}