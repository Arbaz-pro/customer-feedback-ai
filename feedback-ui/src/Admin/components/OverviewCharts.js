import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LabelList,
  Line, LineChart, Legend, CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { COLORS, getTrendData } from "./utils/dataHelpers";



export default function OverviewCharts({ data, reviews }) {

  const aspectData = Object.entries(data.aspect_distribution).map(
    ([k, v]) => ({ name: k, value: v })
  );

  const sentimentData = Object.entries(data.sentiment_distribution).map(
    ([k, v]) => ({ name: k, value: v })
  );

  const allAspects = [...new Set(reviews.map(r => r.aspect))];

  const trendData = getTrendData(reviews);

  const sortedData = trendData
    .map(item => ({
      ...item,
      date: new Date(item.date).getTime()
    }))
    .sort((a, b) => a.date - b.date);

const groupData = (data, type) => {
  const grouped = {};

  data.forEach(item => {
    const d = new Date(item.date);

    let key;

    if (type === "daily") {
      key = d.toISOString().split("T")[0];
    } 
    else if (type === "monthly") {
      key = `${d.getFullYear()}-${d.getMonth()}`;
    } 
    else {
      key = `${d.getFullYear()}`;
    }

    if (!grouped[key]) {
      grouped[key] = {
        date:
          type === "yearly"
            ? new Date(d.getFullYear(), 0, 1).getTime()
            : type === "monthly"
            ? new Date(d.getFullYear(), d.getMonth(), 1).getTime()
            : new Date(key).getTime()
      };

      allAspects.forEach(a => (grouped[key][a] = 0));
    }

    allAspects.forEach(aspect => {
      grouped[key][aspect] += item[aspect] || 0;
    });
  });

  return Object.values(grouped).sort((a, b) => a.date - b.date);
};

const [range, setRange] = useState("daily"); // daily | monthly | yearly
const filteredData = groupData(sortedData, range);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        padding: "15px",
      }}
    >

      {/* 🔥 TOP SECTION */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // ✅ responsive
          gap: "20px",
        }}
      >

        {/* 📊 BAR CHART */}
        <div
          style={{
            flex: "1 1 500px",
            background: "linear-gradient(135deg, #314982, #1e293b)",
            padding: "15px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            color: "white",
          }}
        >
          <h3>Aspect Analysis</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={aspectData}
              margin={{ top: 20, right: 20, bottom: 60 }}
            >
              <XAxis
                dataKey="name"
                angle={-20}
                textAnchor="end"
                interval={0}
                stroke="#fff"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#fff" />
              <Tooltip
  cursor={{ fill: "transparent" }} // 🔥 removes grey block
  contentStyle={{
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "10px",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    padding: "10px"
  }}
  labelStyle={{
    color: "#38bdf8",
    fontWeight: "bold"
  }}
  itemStyle={{
    color: "#e2e8f0",
    fontSize: "14px"
  }}
  formatter={(value) => [`${value}`, "Count"]}
/>

              <Bar dataKey="value">
                {aspectData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={[
                      "#38bdf8",
                      "#22c55e",
                      "#f59e0b",
                      "#ef4444",
                      "#a78bfa",
                      "#14b8a6"
                    ][index % 6]}
                  />
                ))}
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 PIE CHART */}
        <div
          style={{
            flex: "1 1 300px",
            background: "linear-gradient(135deg, #314982, #1e293b)",
            padding: "15px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            color: "white",
          }}
        >
          <h3>Sentiment Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                outerRadius={100}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {sentimentData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

     {/* 📈 LINE CHART */}
<div
  style={{
    marginTop: "30px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: "20px",
        borderRadius: "16px",
        color: "white",
  }}
>
  {/* 🔥 HEADER + BUTTONS */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      flexWrap: "wrap",
        }}
  >
    <h3>📈 Aspect Trends Over Time</h3>

    <div style={{ display: "flex", gap: "8px"}}>
      {["daily", "monthly", "yearly"].map((type) => (
        <button
          key={type}
          onClick={() => setRange(type)}
          style={{
            padding: "4px 10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "12px",
            background: range === type ? "#38bdf8" : "#1e293b",
            color: "white",
            
          }}
        >
          {type.toUpperCase()}
        </button>
      ))}
    </div>
  </div>

  {/* 🔥 THIS WAS MISSING / BROKEN */}
  <ResponsiveContainer width="100%" height={380}>
    <LineChart data={filteredData} margin={{ top: 20, right: 20, left: -35, bottom: 80 }}>
      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

      <XAxis
        dataKey="date"
        stroke="#94a3b8"
        tickFormatter={(tick) => {
          const d = new Date(tick);

          if (range === "daily") return d.toLocaleDateString("en-GB");
          if (range === "monthly")
            return d.toLocaleString("default", {
              month: "short",
              year: "numeric",
            });

          return d.getFullYear();
        }}
      />

      <YAxis stroke="#94a3b8" />

      <Tooltip
      labelFormatter={(label) => {
    const d = new Date(label);

    if (range === "daily") return d.toLocaleDateString("en-GB");
    if (range === "monthly")
      return d.toLocaleString("default", {
        month: "long",
        year: "numeric"
      });

    return d.getFullYear();
  }}
        contentStyle={{
          backgroundColor: "#1e293b",
          border: "none",
          borderRadius: "10px",
          color: "white",
        }}
         labelStyle={{
    color: "#4ade80", // date color
    fontWeight: "bold"
  }}
      />

      <Legend
                   verticalAlign="bottom"
        height={50}
        wrapperStyle={{
          paddingTop: "20px",
          transform: "translateX(30px)" // 👈 smooth shift right
        }}
                  />

      {allAspects.map((aspect, index) => (
        <Line
          key={aspect}
          type="monotone"
          dataKey={aspect}
          connectNulls
          stroke={[
            "#38bdf8",
            "#22c55e",
            "#f59e0b",
            "#ef4444",
            "#a78bfa",
            "#14b8a6",
          ][index % 6]}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
</div>
  </div>

    
  );
}