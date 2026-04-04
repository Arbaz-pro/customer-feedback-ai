from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from app.models.sentiment_data import data
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
custom_stopwords = list(set(ENGLISH_STOP_WORDS) - {"not", "no"})
texts = [x[0] for x in data]
labels = [x[1] for x in data]

vectorizer = TfidfVectorizer(ngram_range=(1,2),analyzer='word',stop_words=custom_stopwords)
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)


def predict_sentiment(text: str):
    X_test = vectorizer.transform([text])
    return model.predict(X_test)[0]