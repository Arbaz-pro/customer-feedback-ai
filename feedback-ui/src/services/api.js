// src/services/api.js

export const analyzeFeedback = async (comment, rating) => {
  // const res = await fetch("http://127.0.0.1:8000/analyze", {
    const res = await fetch("https://feedback-backend-2j31.onrender.com/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment,
      rating: rating || 1,
    }),
  });

  if (!res.ok) throw new Error("Server error");

  return res.json();
};