import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LabelList,
  Line, LineChart, ResponsiveContainer,
  Legend, CartesianGrid
} from "recharts";

import { getTrendData, getAspectCounts } from "./utils/dataHelpers";

export default function NegativeView({ reviews }) {

  const [range, setRange] = useState("daily");

  const negativeReviews = reviews.filter(
    (r) => r.sentiment === "Negative"
  );

  const negativeAspectData = getAspectCounts(negativeReviews);

  const allAspects = [...new Set(reviews.map(r => r.aspect))];

  const negativeTrendData = getTrendData(negativeReviews);

  const sortedData = negativeTrendData
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
    "#ef4444",
    "#ffdb3a",
    "#ff0090",
    "#00bbff",
    "#f97316",
    "#14b8a6"
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
            <BarChart data={negativeAspectData} margin={{ bottom: 60 }}>
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
    color: "#ce0f0f",
    fontWeight: "bold"
  }}
  itemStyle={{
    color: "#e2e8f0",
    fontSize: "14px"
  }}
  formatter={(value) => [`${value}`, "Count"]}
/>
              <Bar dataKey="value" fill="#ef4444">
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
          <h3>Negative Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={negativeAspectData}
                dataKey="value"
                outerRadius={100}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {negativeAspectData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f0404",
                  borderRadius: "10px",
                  border: "none",
                  color: "white"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📉 LINE CHART */}
      <div style={{
        marginTop: "30px",
        background: "linear-gradient(135deg, #450a0a, #7f1d1d)",
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
          <h3>📉 Negative Trends Over Time</h3>

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
                  background: range === type ? "#ef4444" : "#1f0404",
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
            <CartesianGrid stroke="#7f1d1d" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              stroke="#fecaca"
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

            <YAxis stroke="#fecaca" />

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
                backgroundColor: "#1f0404",
                border: "1px solid #7f1d1d",
                borderRadius: "10px",
                color: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
              }}
              labelStyle={{ color: "#fecaca", fontWeight: "bold" }}
            />

            {/* ✅ LEGEND INSIDE (FIXED POSITION) */}
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