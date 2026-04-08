from collections import deque

from numpy import append

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

    results = []
    combine=deque()
    for part in parts:
        sentiment = "Neutral"  # fallback
        cleaned_part = part.replace("the ", "").replace("The ", "")
        print("CLEANED PART:", cleaned_part)

        predicted = predict_aspects(part)
        print(part,predicted)
        for aspect in predicted:
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
        
    unique_results = {}
    priority = {"Positive": 2, "Neutral": 1, "Negative": 3}

    for item in results:
        aspect = item["aspect"]
        sentiment = item["sentiment"]

        if aspect not in unique_results:
            unique_results[aspect] = sentiment
        else:
            # keep stronger sentiment if conflict exists
            if priority[sentiment] > priority[unique_results[aspect]]:
                unique_results[aspect] = sentiment

# convert back to list
    final_results = [
        {"aspect": a, "sentiment": s}
        for a, s in unique_results.items()
]

    return final_results    

    # return results
def calculate_rating(aspects):
    score_map = {
        "Positive": 1,
        "Neutral": 0,
        "Negative": -1
    }

    # importance weights
    weights = {
        "Product_Quality": 1.5,
        "Delivery": 1.3,
        "App_Experience": 1.2,
        "Price": 1.0,
        "Customer_Service": 1.2,
        "Packaging": 0.8
    }

    if not aspects:
        return 3

    total_score = 0
    total_weight = 0

    for a in aspects:
        sentiment_score = score_map[a["sentiment"]]
        weight = weights.get(a["aspect"], 1)

        total_score += sentiment_score * weight
        total_weight += weight

    avg_score = total_score / total_weight

    predicted_rating = 3 + (avg_score * 2)  # amplify impact

    return round(max(1, min(5, predicted_rating)), 1)

def generate_response(aspects):
    if not aspects:
        return "Thanks for your feedback!"

    negative_parts = []
    positive_parts = []

    for a in aspects:
        aspect = a["aspect"]
        sentiment = a["sentiment"]

        if sentiment == "Negative":
            if aspect == "Delivery":
                negative_parts.append("there was a delay in delivery")
            elif aspect == "Product_Quality":
                negative_parts.append("the product didn’t meet expectations")
            elif aspect == "Price":
                negative_parts.append("the pricing felt off")
            elif aspect == "App_Experience":
                negative_parts.append("the app/website experience wasn’t smooth")
            elif aspect == "Customer_Service":
                negative_parts.append("the support experience wasn’t helpful")
            elif aspect == "Packaging":
                negative_parts.append("the packaging could have been better")

        elif sentiment == "Positive":
            if aspect == "Product_Quality":
                positive_parts.append("you liked the product quality")
            elif aspect == "Delivery":
                positive_parts.append("delivery went smoothly")
            elif aspect == "App_Experience":
                positive_parts.append("the app experience was good")
            elif aspect == "Price":
                positive_parts.append("pricing felt reasonable")

    # 🎯 No negatives → fully positive response
    if not negative_parts:
        return "Glad to hear everything went well — we really appreciate your feedback 😊"

    # 🎯 Build negative sentence (no repeated sorry)
    negative_text = ", ".join(negative_parts)

    # 🎯 Tone adjustment based on severity
    neg_count = len(negative_parts)
    if neg_count >= 3:
        prefix = "We sincerely apologize — "
    elif neg_count == 2:
        prefix = "We’re really sorry — "
    else:
        prefix = "We’re sorry — "

    response = prefix + negative_text

    # 🎯 Add positive contrast if exists
    if positive_parts:
        response += ", but we're glad that " + ", ".join(positive_parts)

    response += ". We’ll work on improving this."

    return response
