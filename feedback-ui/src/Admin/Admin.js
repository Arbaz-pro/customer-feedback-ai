import { useState } from "react";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ReviewTable from "./components/ReviewTable";
import OverviewCharts from "./components/OverviewCharts";
import PositiveView from "./components/PositiveView";
import NegativeView from "./components/NegativeView";

import { useDashboardData } from "./hooks/useDashboardData";

function Admin() {
  const { data, reviews } = useDashboardData();
  const [view, setView] = useState("overview");

  if (!data) return <p>Loading...</p>;

  return (
    <div  style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "clamp(10px, 3vw, 30px)", // 🔥 responsive padding
      }}>
        <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px", // 🔥 consistent spacing
        }}
      >
      <Header setView={setView} />
      <StatsCards data={data} setView={setView} />

      <div
          style={{
            marginTop: "10px",
          }}
        ></div>

      {view === "table" && <ReviewTable reviews={reviews} />}
      {view === "overview" && (
        <OverviewCharts data={data} reviews={reviews} style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", padding: "15px" }} />
      )}
      {view === "positive" && <PositiveView reviews={reviews} />}
      {view === "negative" && <NegativeView reviews={reviews} />}
    </div>
    </div>
  );
}

export default Admin;