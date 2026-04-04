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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <Header setView={setView} />
      <StatsCards data={data} setView={setView} />

      {view === "table" && <ReviewTable reviews={reviews} />}
      {view === "overview" && (
        <OverviewCharts data={data} reviews={reviews} />
      )}
      {view === "positive" && <PositiveView reviews={reviews} />}
      {view === "negative" && <NegativeView reviews={reviews} />}
    </div>
  );
}

export default Admin;