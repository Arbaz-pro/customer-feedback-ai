import {BarChart,Bar,XAxis,YAxis,Tooltip,PieChart,Pie,Cell,
  LabelList,Line,LineChart,
  ResponsiveContainer,
  Legend,CartesianGrid} from "recharts";
import  {getTrendData}  from "./utils/dataHelpers";
export default function PositiveView({ reviews }) {
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
    date: new Date(item.date).getTime() // ✅ safe
  }))
  .sort((a, b) => a.date - b.date);
  return ( <div>
  <div style={{ display: "flex",flexWrap:"wrap", gap: "40px" }}>
    
    {/* BAR CHART */}
    <div style={{ flex: 2 ,background: "linear-gradient(135deg, #314982, #1e293b)",padding: "15px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  color: "white",
  maxWidth: "700px",
  alignContent: "bottom" }}>
      <ResponsiveContainer width={700} height={450}>
        <BarChart
          data={positiveAspectData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <XAxis
            dataKey="name"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={80}
            stroke="#ffffff"
  tick={{ fill: "#ffffff", fontWeight: "bold" }}
          />
          <YAxis stroke="#ffffff"
  tick={{ fill: "#ffffff", fontWeight: "bold"  }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#00ff5e">
            <LabelList dataKey="value" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* PIE CHART */}
    <div style={{ flex: 1, background: "linear-gradient(135deg, #314982, #1e293b)",padding: "15px", }}>
      <h3 style={{ marginBottom: "10px", color: "white", alignSelf: "left" }}>Positive Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
  <Pie
    data={positiveAspectData}
    dataKey="value"
    nameKey="name"
    outerRadius={100}
    label={({ name, percent }) =>
      `${name} ${(percent * 100).toFixed(0)}%`
    }
  >
    {positiveAspectData.map((entry, index) => (
      <Cell
        key={index}
        fill={["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"][index % 4]}
      />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
      </ResponsiveContainer>
    </div>

  </div>
   <div style={{
    marginTop: "40px",
    background: "linear-gradient(135deg, #052e16, #064e3b)",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    color: "white",
    width: "1400px",
  }}>
    <h3 style={{ marginBottom: "20px" }}>
      📈 Positive Trends Over Time
    </h3>

    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={sortedData}>

        <CartesianGrid stroke="#14532d" strokeDasharray="3 3" />

        <XAxis dataKey="date" stroke="#bbf7d0" domain={['dataMin', 'dataMax']}
  tickFormatter={(tick) =>  
    new Date(tick).toLocaleDateString("en-GB")
  } />
        <YAxis stroke="#bbf7d0" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#022c22",
            border: "none",
            borderRadius: "10px",
            color: "white"
          }}
        />

        <Legend />

        {allAspects.map((aspect, index) => (
  <Line
    key={aspect}
    type="monotone"
    dataKey={aspect}
    connectNulls={true}
    stroke={
      [
       "#2266c5",
        "#4ade80",
        "#cff43e",
        "#fda0ff",
        "#38bdf8",
        "#bbf7d0"  // soft mint
      ][index % 6]
    }
    strokeWidth={3.5}
    dot={{
      r: 4,
      stroke: [
        "#2266c5",
        "#4ade80",
        "#cff43e",
        "#fda0ff",
        "#38bdf8",
        "#bbf7d0"
      ][index % 6],
      strokeWidth: 2,
      fill: "#022c22"
    }}
    activeDot={{
      r: 7,
      stroke: "#ffffff",
      strokeWidth: 2
    }}
    style={{
      filter: "drop-shadow(0 0 4px rgba(34,197,94,0.4))"
    }}
  />
))}

      </LineChart>
    </ResponsiveContainer>
  </div>
  </div>
  
);
}