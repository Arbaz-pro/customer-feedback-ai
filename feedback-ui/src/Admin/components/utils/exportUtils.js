// CSV EXPORT
export const exportCSV = (data, filename = "data.csv") => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);

  const rows = data.map(obj =>
    headers.map(h => `"${obj[h]}"`).join(",")
  );

  const csv =
    [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};
