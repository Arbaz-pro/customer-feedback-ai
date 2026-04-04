from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier

from app.models.train_data import data

# Prepare data
texts = [item[0] for item in data]
labels = [item[1] for item in data]

# Convert labels to binary format
mlb = MultiLabelBinarizer()
y = mlb.fit_transform(labels)

# Convert text to vectors
vectorizer = TfidfVectorizer(ngram_range=(1,2), analyzer='word',stop_words='english')
X = vectorizer.fit_transform(texts)

# Train model
model = OneVsRestClassifier(LogisticRegression())
model.fit(X, y)


def predict_aspects(text: str):
    X_test = vectorizer.transform([text])
    
    probs = model.predict_proba(X_test)[0]

    print("TEXT:", text)
    print("PROBS:", list(zip(mlb.classes_, probs)))  # 🔥 DEBUG

    threshold = 0.35    

    predicted = [mlb.classes_[i] for i, p in enumerate(probs) if p >= threshold]

    return predicted    