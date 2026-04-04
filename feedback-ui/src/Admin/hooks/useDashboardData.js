import { useEffect, useState } from "react";

export const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then(res => res.json())
      .then(setData);

    fetch("http://127.0.0.1:8000/reviews")
      .then(res => res.json())
      .then(setReviews);
  }, []);

  return { data, reviews };
};