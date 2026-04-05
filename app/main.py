print("ran 1")
from fastapi import FastAPI
print("ran 2")
from pydantic import BaseModel
print("ran 3")
from app.services.analyzer import analyze_comment, calculate_rating,generate_response
print("ran 4")
from app.services.db_service import save_feedback, fetch_feedback
print("ran 5")
from app.services.db_service import save_feedback, fetch_feedback, get_dashboard_data,get_reviews_data
print("ran 6")
from typing import Optional
print("ran 7")
from app.db.database import create_table,engine
print("ran 8")
from fastapi.middleware.cors import CORSMiddleware
print("ran 9")
from sqlalchemy import text
print("ran 10")



app = FastAPI()

print("APP STARTING...")


@app.on_event("startup")
def startup_event():
    print("STARTUP RUNNING...")
    create_table()
    print("model STARTUP COMPLETE!")
    
class CommentRequest(BaseModel):
    comment: str
    rating: Optional[int] = None

@app.get("/")
def home():
    return {"message": "Hello World"}
@app.get("/test-db")
def test_db():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        return {"status": "connected"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
def analyze(request: CommentRequest):
    print("RAW REQUEST:", request)
    print("COMMENT:", request.comment)
    print("RATING:", request.rating)
    comment = request.comment
    user_rating = request.rating

    aspects = analyze_comment(comment)
    predicted_rating = calculate_rating(aspects)
    
    save_feedback(comment, aspects, user_rating, predicted_rating)
    response_message=generate_response(aspects)
    
    return {
        "comment": comment,
        "aspects": aspects,
        "predicted_rating": predicted_rating,
        "user_rating": user_rating,
        "ai_response": response_message
    }
@app.get("/feedback")
def get_feedback():
    data = fetch_feedback()
    return {"data": data}

@app.get("/reviews")
def get_reviews():
    return get_reviews_data()
    
@app.get("/dashboard")
def get_dashboard():
    return get_dashboard_data()