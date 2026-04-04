import {BarChart,Bar,XAxis,YAxis,Tooltip,PieChart,Pie,Cell,LabelList,Line,LineChart,Legend,CartesianGrid,ResponsiveContainer} from "recharts";

import { COLORS,getTrendData } from "./utils/dataHelpers";

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
    date: new Date(item.date).getTime() // ✅ safe
  }))
  .sort((a, b) => a.date - b.date);
  return (
    <div>
    <div style={{ display: "flex",flexWrap:"wrap", justifyContent: "space-between" }}>

    {/* BAR CHART */}
    <div style={{ flex: 2 }}>
      <h3>Aspect Analysis</h3>
      <ResponsiveContainer width={700} height={450}>
      <BarChart data={aspectData} margin={{
      top: 20,
      right: 60,
      left: 20,
      bottom: 80 }}>
        <XAxis dataKey="name" angle={30} textAnchor="inherit" interval={0} />

        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4f6df5">
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </div>

    {/* PIE CHART */}
    <div style={{ flex: 1 }}>
      <h3>Sentiment Distribution</h3>
      <PieChart width={490} height={350}>
        <Pie
          data={sentimentData}
          dataKey="value"
          nameKey="name"
          outerRadius={130}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {sentimentData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>

  </div>
   <div style={{
  marginTop: "40px",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
  padding: "15px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  color: "white",
  width: "900px",
}}>
  <h3 style={{ marginBottom: "20px" }}>
    📈 Aspect Trends Over Time
  </h3>

  <ResponsiveContainer width={900} height={350}>
    <LineChart data={sortedData}>

      {/* 🔥 Grid */}
      <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

      {/* 🔥 Axes */}
      <XAxis dataKey="date" stroke="#94a3b8" domain={['dataMin', 'dataMax']}
  tickFormatter={(tick) =>
    new Date(tick).toLocaleDateString("en-GB")
  } />
      <YAxis stroke="#94a3b8" />

      {/* 🔥 Tooltip */}
      <Tooltip
        contentStyle={{
          backgroundColor: "#1e293b",
          border: "none",
          borderRadius: "10px",
          color: "white"
        }}
      />

      {/* 🔥 Legend */}
      <Legend />

      {/* 🔥 Dynamic Lines */}
      {allAspects.map((aspect, index) => (
        <Line
          key={aspect}
          type="monotone"
          dataKey={aspect}
          connectNulls={true}
          stroke={[
            "#38bdf8", // cyan
            "#22c55e", // green
            "#f59e0b", // orange
            "#ef4444", // red
            "#a78bfa", // purple
            "#14b8a6"  // teal
          ][index % 6]}
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 7 }}
        />
      ))}

    </LineChart>
  </ResponsiveContainer>

    </div>
    </div>
  );
}
