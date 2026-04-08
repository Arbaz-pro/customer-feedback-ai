import { useEffect, useState } from "react";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // fetch("http://127.0.0.1:8000/dashboard")
    fetch("https://feedback-backend-2j31.onrender.com/dashboard")
      .then(res => {
    if (!res.ok) throw new Error("API failed");
    return res.json();
  })
  .then(setData)
  .catch(err => console.error("Fetch error:", err));

    // fetch("http://127.0.0.1:8000/reviews")
    fetch("https://feedback-backend-2j31.onrender.com/reviews")
      .then(res => {
    if (!res.ok) throw new Error("API failed");
    return res.json();
  })
  .then(setReviews)
  .catch(err => console.error("Fetch error:", err));
  }, []);

  return { data, reviews };
};