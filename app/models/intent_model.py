

# from app.models.train_data import data
# unique = {}

# for text, labels in data:
#     unique[text.lower().strip()] = labels  # normalize text

# data = [(text, labels) for text, labels in unique.items()]

# texts = [x[0] for x in data]
# labels = [x[1] for x in data]

# from sklearn.preprocessing import MultiLabelBinarizer

# mlb = MultiLabelBinarizer()
# y = mlb.fit_transform(labels)

# from sklearn.feature_extraction.text import TfidfVectorizer

# vectorizer = TfidfVectorizer(
#     ngram_range=(1,2),
#     max_features=5000,
#     stop_words="english"
# )

# X = vectorizer.fit_transform(texts)

# from sklearn.linear_model import LogisticRegression
# from sklearn.multiclass import OneVsRestClassifier

# model = OneVsRestClassifier(
#     LogisticRegression(max_iter=200)
# )

# model.fit(X, y)


# import joblib

# joblib.dump(model, "aspect_model.pkl")
# joblib.dump(vectorizer, "aspect_vectorizer.pkl")
# joblib.dump(mlb, "aspect_mlb.pkl")



import logging
import joblib

logging.basicConfig(level=logging.INFO)
model = joblib.load("aspect_model.pkl")
vectorizer = joblib.load("aspect_vectorizer.pkl")
mlb = joblib.load("aspect_mlb.pkl")

def predict_aspects(text: str):
    X_test = vectorizer.transform([text])
    probs = model.predict_proba(X_test)[0]


    logging.info(f"TEXT: {text}")
    logging.info(f"PROBS: {list(zip(mlb.classes_, probs))}")

    threshold = 0.33
    predicted = [mlb.classes_[i] for i, p in enumerate(probs) if p >= threshold]

    return predicted
# test_sentences = [
#     "delivery was late",
#     "product quality is amazing",
#     "app is very slow and crashes",
#     "customer support didn't respond",
#     "worth the money and good quality",
#     "order arrived on time and box was perfect"
# ]

# def predict_aspects(text: str):
#     X_test = vectorizer.transform([text])
#     probs = model.predict_proba(X_test)[0]

#     print("\nTEXT:", text)
#     print("PROBS:", list(zip(mlb.classes_, probs)))

#     threshold = 0.3
#     predicted = [mlb.classes_[i] for i, p in enumerate(probs) if p >= threshold]

#     print("PREDICTED:", predicted)
#     return predicted