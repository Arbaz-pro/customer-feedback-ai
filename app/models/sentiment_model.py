# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.linear_model import LogisticRegression
# from app.models.sentiment_data import data
# from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

# from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
# custom_stopwords = list(set(ENGLISH_STOP_WORDS) - {"not", "no"})
# texts = [x[0] for x in data]
# labels = [x[1] for x in data]

# vectorizer = TfidfVectorizer(ngram_range=(1,2),analyzer='word',stop_words=custom_stopwords)
# X = vectorizer.fit_transform(texts)

# model = LogisticRegression()
# model.fit(X, labels)


# def predict_sentiment(text: str):
#     X_test = vectorizer.transform([text])
    
#     probs = model.predict_proba(X_test)[0]

#     print("TEXT:", text)
#     print("PROBS:", list(zip(mlb.classes_, probs)))

#     classes = model.classes_

#     max_index = probs.argmax()
    
#     sentiment = classes[max_index]
#     # confidence = probs[max_index]

#     return sentiment
#     # X_test = vectorizer.transform([text])
#     # return model.predict(X_test)[0]


import joblib
import os

# Go UP from app/models → project root
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))

model_path = os.path.join(base_path, "sentiment_model.pkl")
vectorizer_path = os.path.join(base_path, "sentiment_vectorizer.pkl")

print("MODEL PATH:", model_path)

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

def predict_sentiment(text: str):
    X_test = vectorizer.transform([text])
    
    probs = model.predict_proba(X_test)[0]
    classes = model.classes_

    # print("TEXT:", text)
    # print("PROBS:", list(zip(model.classes_, probs)))

    sentiment = classes[probs.argmax()]

    return sentiment