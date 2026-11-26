import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report

# --------------------------
# LOAD DATASET
# --------------------------
data = pd.read_csv(
    "backend/dataset/sms_ds.csv",
    encoding="latin1"
)

# Keep only required columns
data = data[["v1", "v2"]]

# Labels
X = data["v2"]
y = data["v1"]

print("Dataset Labels:")
print(data["v1"].value_counts())

# --------------------------
# TF-IDF
# --------------------------
vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=5000
)

X_vectorized = vectorizer.fit_transform(X)

# --------------------------
# TRAIN TEST SPLIT
# --------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# --------------------------
# MODELS
# --------------------------
models = {
    "LogisticRegression":
        LogisticRegression(
            max_iter=1000,
            class_weight="balanced"
        ),

    "NaiveBayes":
        MultinomialNB()
}

best_model = None
best_accuracy = 0

# --------------------------
# TRAINING
# --------------------------
for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print(f"{name} Accuracy: {accuracy:.4f}")

    print(
        classification_report(
            y_test,
            predictions
        )
    )

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model

# --------------------------
# SAVE MODEL
# --------------------------
joblib.dump(
    best_model,
    "backend/models/sms_model.pkl"
)

joblib.dump(
    vectorizer,
    "backend/models/sms_vectorizer.pkl"
)

print("SMS model saved successfully!")

