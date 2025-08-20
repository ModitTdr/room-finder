# ----------------- MAIN LIBRARIES -----------------
import pandas as pd
import numpy as np
import nltk
from nltk.corpus import stopwords
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report, accuracy_score
from flask_cors import CORS

# ----------------- FLASK LIBRARY ------------------
from flask import Flask, request, jsonify

# ----------------- HELPING LIBRARIES ----------------
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Download stopwords (first time only)
nltk.download('stopwords')

# ----------------- LOAD DATA -----------------
train_dataset = 'train.csv'
test_dataset = 'test.csv'

if not os.path.exists(train_dataset) or not os.path.exists(test_dataset):
    raise FileNotFoundError("train.csv or test.csv not found!")

print("Loading CSVs...")
train_df = pd.read_csv(train_dataset, encoding='ISO-8859-1')
test_df = pd.read_csv(test_dataset, encoding='ISO-8859-1')

# ----------------- PREPROCESSING -----------------
def preprocess_text(text):
    if pd.isnull(text):
        return ""
    text = text.lower()
    stop_words = set(stopwords.words('english'))
    return " ".join([word for word in text.split() if word not in stop_words])

print("Preprocessing text...")
train_df['processed_text'] = train_df['text'].apply(preprocess_text)
test_df['processed_text'] = test_df['text'].apply(preprocess_text)

# Drop missing labels
train_df = train_df.dropna(subset=['sentiment'])
test_df = test_df.dropna(subset=['sentiment'])

# Normalize sentiment
train_df['sentiment'] = train_df['sentiment'].astype(str).str.strip().str.lower()
test_df['sentiment'] = test_df['sentiment'].astype(str).str.strip().str.lower()

# ----------------- VECTORIZE -----------------
print("Vectorizing text...")
vectorizer = TfidfVectorizer(max_features=5000)
train_TFIDF = vectorizer.fit_transform(train_df['processed_text'])
test_TFIDF = vectorizer.transform(test_df['processed_text'])

# ----------------- TRAIN MODEL -----------------
print("Training model...")
NB_model = MultinomialNB()
NB_model.fit(train_TFIDF, train_df['sentiment'])

# ----------------- EVALUATE -----------------
predictions = NB_model.predict(test_TFIDF)
print("Accuracy:", accuracy_score(test_df['sentiment'], predictions))
print(classification_report(test_df['sentiment'], predictions))

# ----------------- MAPPING FUNCTION -----------------
def sentiment_to_rating(predicted_sentiment, proba):
    """
    Map sentiment + confidence to star rating (1-5)
    """
    confidence = max(proba)

    if predicted_sentiment == "negative":
        return 1 if confidence > 0.7 else 2
    elif predicted_sentiment == "neutral":
        return 3
    elif predicted_sentiment == "positive":
        return 5 if confidence > 0.7 else 4
    else:
        return 3

# ----------------- API ROUTE -----------------
@app.route('/predict', methods=['POST'])
def predict_sentiment():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Please provide input text in JSON as { "text": "your review" }'}), 400

    input_text = data['text']
    processed_input = preprocess_text(input_text)
    input_TFIDF = vectorizer.transform([processed_input])
    
    predicted_sentiment = NB_model.predict(input_TFIDF)[0]
    proba = NB_model.predict_proba(input_TFIDF)[0]
    
    rating = sentiment_to_rating(predicted_sentiment, proba)

    return jsonify({
        'sentiment': predicted_sentiment,
        'rating': rating,
        'confidence': proba.tolist()
    })

# ----------------- RUN APP -----------------
if __name__ == '__main__':
    app.run(debug=True)
