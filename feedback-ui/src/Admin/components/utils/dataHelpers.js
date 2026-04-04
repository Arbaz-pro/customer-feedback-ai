export const getAspectCounts = (list) => {
  const counts = {};

  list.forEach((r) => {
    counts[r.aspect] = (counts[r.aspect] || 0) + 1;
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
};


export const getTrendData = (list) => {
  const trend = {};

  list.forEach((r) => {
    const date = new Date(r.created_at);

    if (!trend[date]) trend[date] = {};
    trend[date][r.aspect] = (trend[date][r.aspect] || 0) + 1;
  });

  return Object.entries(trend).map(([date, aspects]) => ({
    date,
    ...aspects,
  }));
};

export const COLORS = ["#4caf50","#f44336","#ff9800"];