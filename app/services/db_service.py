from app.db.database import engine
from sqlalchemy import text


# 🔥 SAVE FEEDBACK
def save_feedback(comment, aspects, user_rating, predicted_rating):
    print(f"Saving feedback: {comment}, {aspects}, {user_rating}, {predicted_rating}")

    with engine.begin() as conn:
        for item in aspects:
            conn.execute(text("""
                INSERT INTO feedback (comment, aspect, sentiment, user_rating, predicted_rating)
                VALUES (:comment, :aspect, :sentiment, :user_rating, :predicted_rating)
            """), {
                "comment": comment,
                "aspect": item["aspect"],
                "sentiment": item["sentiment"],
                "user_rating": user_rating,
                "predicted_rating": predicted_rating
            })


# 🔥 FETCH ALL FEEDBACK
def fetch_feedback():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM feedback"))
        rows = result.fetchall()

    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "comment": row[1],
            "aspect": row[2],
            "sentiment": row[3],
            "user_rating": row[4],
            "predicted_rating": row[5],
            "created_at": row[6].strftime("%Y-%m-%d")
        })

    return data


# 🔥 DASHBOARD DATA
def get_dashboard_data():
    with engine.connect() as conn:

        total_reviews = conn.execute(
            text("SELECT COUNT(*) FROM feedback")
        ).scalar()

        aspect_data = conn.execute(text("""
            SELECT aspect, COUNT(*) FROM feedback GROUP BY aspect
        """)).fetchall()

        sentiment_data = conn.execute(text("""
            SELECT sentiment, COUNT(*) FROM feedback GROUP BY sentiment
        """)).fetchall()

    aspect_distribution = {row[0]: row[1] for row in aspect_data}
    sentiment_distribution = {row[0]: row[1] for row in sentiment_data}

    return {
        "total_reviews": total_reviews,
        "aspect_distribution": aspect_distribution,
        "sentiment_distribution": sentiment_distribution
    }

def get_reviews_data():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM feedback"))
        rows = result.fetchall()

    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "comment": row[1],
            "aspect": row[2],
            "sentiment": row[3],
            "user_rating": row[4],
            "predicted_rating": row[5],
            "created_at": row[6].strftime("%Y-%m-%d")
        })

    return data