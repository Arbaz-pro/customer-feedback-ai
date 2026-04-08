import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LabelList,
  Line, LineChart, ResponsiveContainer,
  Legend, CartesianGrid
} from "recharts";

import { getTrendData } from "./utils/dataHelpers";

export default function PositiveView({ reviews }) {

  const [range, setRange] = useState("daily");

  const positiveReviews = reviews.filter(
    (r) => r.sentiment === "Positive"
  );

  const allAspects = [...new Set(reviews.map(r => r.aspect))];

  const getAspectCounts = (list) => {
    const counts = {};
    list.forEach((r) => {
      counts[r.aspect] = (counts[r.aspect] || 0) + 1;
    });

    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value,
    }));
  };

  const positiveAspectData = getAspectCounts(positiveReviews);

  const positiveTrendData = getTrendData(positiveReviews);

  const sortedData = positiveTrendData
    .map(item => ({
      ...item,
      date: new Date(item.date).getTime()
    }))
    .sort((a, b) => a.date - b.date);

  // 🔥 GROUPING FUNCTION
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

        allAspects.forEach(a => grouped[key][a] = 0);
      }

      allAspects.forEach(aspect => {
        grouped[key][aspect] += item[aspect] || 0;
      });
    });

    return Object.values(grouped).sort((a, b) => a.date - b.date);
  };

  const filteredData = groupData(sortedData, range);

  const COLORS = [
    "#2266c5",
    "#4ade80",
    "#cff43e",
    "#fda0ff",
    "#38bdf8",
    "#bbf7d0"
  ];

  return (
    <div>

      {/* 🔥 TOP SECTION */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>

        {/* 📊 BAR */}
        <div style={{
          flex: "1 1 500px",
          background: "linear-gradient(135deg, #314982, #1e293b)",
          padding: "15px",
          borderRadius: "16px",
          color: "white",
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positiveAspectData} margin={{ bottom: 60 }}>
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
    color: "#3adb62",
    fontWeight: "bold"
  }}
  itemStyle={{
    color: "#e2e8f0",
    fontSize: "14px"
  }}
  formatter={(value) => [`${value}`, "Count"]}
/>
              <Bar dataKey="value" fill="#22c55e">
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🥧 PIE */}
        <div style={{
          flex: "1 1 300px",
          background: "linear-gradient(135deg, #314982, #1e293b)",
          padding: "15px",
          borderRadius: "16px",
          color: "white",
        }}>
          <h3>Positive Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={positiveAspectData}
                dataKey="value"
                outerRadius={100}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {positiveAspectData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📈 LINE CHART */}
      <div style={{
        marginTop: "30px",
        background: "linear-gradient(135deg, #052e16, #064e3b)",
        padding: "20px",
        borderRadius: "16px",
        color: "white",
      }}>

        {/* 🔥 HEADER + BUTTONS */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "10px"
        }}>
          <h3>Positive Trends Over Time</h3>

          <div style={{ display: "flex", gap: "8px" }}>
            {["daily", "monthly", "yearly"].map(type => (
              <button
                key={type}
                onClick={() => setRange(type)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  background: range === type ? "#22c55e" : "#022c22",
                  color: "white",
                }}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 20, left: -35, bottom: 70 }}
          >
            <CartesianGrid stroke="#14532d" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              stroke="#bbf7d0"
              minTickGap={20}
              tickFormatter={(tick) => {
                const d = new Date(tick);

                if (range === "daily") return d.toLocaleDateString("en-GB");
                if (range === "monthly")
                  return d.toLocaleString("default", {
                    month: "short",
                    year: "numeric"
                  });

                return d.getFullYear();
              }}
            />

            <YAxis stroke="#bbf7d0" />

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
                backgroundColor: "#022c22",
                border: "none",
                borderRadius: "10px",
                color: "white"
              }}
    
  labelStyle={{
    color: "#4ade80", // date color
    fontWeight: "bold"
  }}
            />

            {/* ✅ LEGEND INSIDE BUT PUSHED DOWN */}
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
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}