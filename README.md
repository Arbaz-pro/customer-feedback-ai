# 🚀 AI-Powered Customer Feedback Analysis System

An intelligent full-stack application that analyzes customer feedback using Machine Learning and NLP to extract insights, predict ratings, and generate automated responses.

---

## 📌 Project Overview

This system allows users to submit feedback and automatically:

- 🔍 Detect key aspects (Delivery, Product Quality, Price, etc.)
- 😊 Analyze sentiment (Positive, Negative, Neutral)
- ⭐ Predict ratings (1–5 scale)
- 🤖 Generate AI-based responses
- 📊 Visualize insights via dashboard

---

## 🧠 Features

- Aspect-Based Sentiment Analysis (ABSA)
- Machine Learning models (TF-IDF + Logistic Regression)
- AI-generated feedback responses
- Interactive Admin Dashboard
- Real-time data visualization
- Full-stack implementation

---

## 🏗️ Tech Stack

### 🔹 Backend
- FastAPI
- Python
- Scikit-learn
- SQLAlchemy
- PostgreSQL (Neon DB)

### 🔹 Frontend
- React.js
- Recharts

### 🔹 ML Models
- TF-IDF Vectorizer
- Logistic Regression (One-vs-Rest)
- Sentiment Classification Model

---

## ⚙️ Architecture

User Input → FastAPI → NLP Processing → Aspect Detection → Sentiment Analysis → Rating Prediction → Database → Dashboard

---

## 📊 Dashboard Features

Aspect Distribution
Sentiment Breakdown
Trends Over Time
Review Table with Sorting
Positive & Negative Insights

--- 

## 🧪 Example

Input:
"Delivery was late but product quality is amazing"

Output:

Delivery → Negative
Product Quality → Positive
Predicted Rating → 3.5
AI Response → Apology + Positive tone
