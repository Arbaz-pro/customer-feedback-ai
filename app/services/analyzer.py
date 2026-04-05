from collections import deque

from numpy import append

from app.models.intent_model import predict_aspects
from app.models.sentiment_model import predict_sentiment
import re

def split_into_parts(comment: str):
    parts = re.split(r'\bbut\b|\band\b|\bhowever\b|\balthough\b|,|\.', comment)
    return [p.strip() for p in parts if p.strip()]\

def analyze_comment(comment: str):
    comment = comment.lower()

    parts = split_into_parts(comment)

    all_aspects = set()

    results = []
    combine=deque()
    for part in parts:
        cleaned_part = part.replace("the ", "").replace("The ", "")
        print("CLEANED PART:", cleaned_part)
        aspect = predict_aspects(part)
        print(part, aspect)

        aspect = predict_aspects(part)
        print(part, aspect)

        if len(re.findall(r'\b\w+\b', cleaned_part)) == 1 or cleaned_part in ["customer service", "app experience", "product quality"]:
            print("COMBINE:", part)
            combine.append(aspect)
        else:
            sentiment = predict_sentiment(part)

            while combine:
                j = combine.popleft()
                results.append({
                "aspect": j,
                "sentiment": str(sentiment)
                })

        results.append({
        "aspect": aspect,
        "sentiment": str(sentiment)
        })

        all_aspects.add(aspect)
        

    return results
def calculate_rating(aspects):
    score_map = {
        "Positive": 1,
        "Neutral": 0,
        "Negative": -1
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
        if a["aspect"] == "Delivery" and a["sentiment"] == "Negative":
            return "Sorry about the delivery delay. We'll improve it."

        if a["aspect"] == "Product_Quality" and a["sentiment"] == "Negative":
            return "We’re sorry the product didn’t meet expectations."

        if a["aspect"] == "Price" and a["sentiment"] == "Negative":
            return "We understand your concern about pricing."

        if a["aspect"] == "App_Experience" and a["sentiment"] == "Negative":
            return "We’ll work on improving the website experience."

    return "Thanks for your valuable feedback!"
