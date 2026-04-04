from app.models.intent_model import predict_aspects
from app.models.sentiment_model import predict_sentiment
import re

def split_into_parts(comment: str):
    parts = re.split(r'\bbut\b|\band\b|\bhowever\b|\balthough\b|,|\.', comment)
    return [p.strip() for p in parts if p.strip()]

def analyze_comment(comment: str):
    comment = comment.lower()

    parts = split_into_parts(comment)

    all_aspects = set()

    positive_words = ["good", "great", "excellent", "fast", "amazing", "love", "nice", "friendly", "helpful", "delicious", "clean", "comfortable", "enjoyed", "satisfied", "happy", "recommend"]
    negative_words = ["bad", "late", "poor", "worst", "slow", "terrible", "rude", "unhelpful", "disgusting", "dirty", "uncomfortable", "horrible", "unsatisfied", "unhappy", "avoid"]

    results = []

    for part in parts:
        predicted = predict_aspects(part)

        for aspect in predicted:
            sentiment = "neutral"

            sentiment = predict_sentiment(part)

            results.append({
                "aspect": aspect,
                "sentiment": sentiment
            })

            all_aspects.add(aspect)

    return results
def calculate_rating(aspects):
    score_map = {
        "positive": 1,
        "neutral": 0,
        "negative": -1
    }

    if not aspects:
        return 3  # default neutral

    scores = [score_map[a["sentiment"]] for a in aspects]

    avg_score = sum(scores) / len(scores)

    predicted_rating = 3 + avg_score  # shift to 1–5 scale

    # clamp between 1 and 5
    predicted_rating = max(1, min(5, predicted_rating))

    return round(predicted_rating, 1)

def generate_response(aspects):
    for a in aspects:
        if a["aspect"] == "delivery" and a["sentiment"] == "negative":
            return "Sorry about the delivery delay. We'll improve it."

        if a["aspect"] == "product_quality" and a["sentiment"] == "negative":
            return "We’re sorry the product didn’t meet expectations."

        if a["aspect"] == "price" and a["sentiment"] == "negative":
            return "We understand your concern about pricing."

        if a["aspect"] == "app_experience" and a["sentiment"] == "negative":
            return "We’ll work on improving the website experience."

    return "Thanks for your valuable feedback!"