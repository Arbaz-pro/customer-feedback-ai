import {BarChart,Bar,XAxis,YAxis,Tooltip,PieChart,Pie,Cell,
  LabelList,Line,LineChart,
  ResponsiveContainer,
  Legend,CartesianGrid} from "recharts";
import  {getTrendData,getAspectCounts}  from "./utils/dataHelpers";

export default function NegativeView({ reviews }) {
  
const negativeReviews = reviews.filter(
  (r) => r.sentiment === "Negative"
);
const negativeAspectData = getAspectCounts(negativeReviews);
const allAspects = [...new Set(reviews.map(r => r.aspect))];
const negativeTrendData = getTrendData(negativeReviews);
const sortedData = negativeTrendData
  .map(item => ({
    ...item,
    date: new Date(item.date).getTime() // ✅ safe
  }))
  .sort((a, b) => a.date - b.date);
  return(
 <div>
  <div style={{ display: "flex",flexWrap:"wrap", gap: "40px" }}>
    
    {/* BAR CHART */}
    <div style={{flex: 2 ,background: "linear-gradient(135deg, #314982, #1e293b)",padding: "15px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  color: "white",
  maxWidth: "700px" }}>
      <ResponsiveContainer width={600} height={420}>
        <BarChart
          data={negativeAspectData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <XAxis
            dataKey="name"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={80}
            stroke="#ffffff"
  tick={{ fill: "#ffffff", fontWeight: "bold"  }}
          />
          <YAxis stroke="#ffffff"
  tick={{ fill: "#ffffff", fontWeight: "bold"  }}/>
          <Tooltip />
          <Bar dataKey="value" fill="#cc0000">
            <LabelList dataKey="value" position="top" color="#ffffff" fontWeight="bold"/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* PIE CHART */}
    <div style={{ flex: 1,background: "linear-gradient(135deg, #314982, #1e293b)",padding: "15px", }}>
      <h3 style={{ marginBottom: "10px", color: "white", alignSelf: "left" }}>Negative Distribution</h3>

      <ResponsiveContainer width="100%" height={300}>
       <PieChart>
  <Pie
    data={negativeAspectData}
    dataKey="value"
    nameKey="name"
    outerRadius={100}
    label={({ name, percent }) =>
      `${name} ${(percent * 100).toFixed(0)}%`
    }
  >
    {negativeAspectData.map((entry, index) => (
      <Cell
        key={index}
        fill={["#ef4444", "#f97316", "#6366f1", "#14b8a6"][index % 4]}
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
    background: "linear-gradient(135deg, #450a0a, #7f1d1d)",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    color: "white",
    width: "1400px",
  }}>
    <h3 style={{ marginBottom: "20px" }}>
      📉 Negative Trends Over Time
    </h3>

    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={sortedData}>

        <CartesianGrid stroke="#7f1d1d" strokeDasharray="3 3" />

        <XAxis dataKey="date" stroke="#fecaca" domain={['dataMin', 'dataMax']}
  tickFormatter={(tick) =>  
    new Date(tick).toLocaleDateString("en-GB")
  } />
        <YAxis stroke="#fecaca" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1f0404",
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
            stroke={[
              "#ef4444",
              "#ffdb3a",
              "#ff0090",
              "#00bbff",
              "#f97316",
              "#14b8a6"
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