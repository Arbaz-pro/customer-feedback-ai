import joblib

# ---- ASPECT MODEL ----
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from app.models.train_data import data

unique = {}

for text, labels in data:
    unique[text.lower().strip()] = labels  # normalize text

data = [(text, labels) for text, labels in unique.items()]
texts = [item[0] for item in data]
labels = [item[1] for item in data]
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(labels)

vectorizer = TfidfVectorizer(ngram_range=(1,2),analyzer='word', stop_words='english')
X = vectorizer.fit_transform(texts)

aspect_model = OneVsRestClassifier(LogisticRegression(max_iter=200))
aspect_model.fit(X, y)

joblib.dump(aspect_model, "aspect_model.pkl")
joblib.dump(vectorizer, "aspect_vectorizer.pkl")
joblib.dump(mlb, "aspect_mlb.pkl")


# ---- SENTIMENT MODEL ----
from app.models.sentiment_data import data as sentiment_data
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

custom_stopwords = list(set(ENGLISH_STOP_WORDS) - {"not", "no"})
unique = {}

for text, labels in sentiment_data:
    unique[text.lower().strip()] = labels  # normalize text

sentiment_data = [(text, labels) for text, labels in unique.items()]
texts = [x[0] for x in sentiment_data]
labels = [x[1] for x in sentiment_data]

vectorizer = TfidfVectorizer(ngram_range=(1,2),analyzer='word',stop_words=custom_stopwords)
X = vectorizer.fit_transform(texts)

sentiment_model = LogisticRegression()
sentiment_model.fit(X, labels)

joblib.dump(sentiment_model, "sentiment_model.pkl")
joblib.dump(vectorizer, "sentiment_vectorizer.pkl")