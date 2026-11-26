import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report


# --------------------------------
# LOAD DATASET
# --------------------------------
data = pd.read_csv("backend/dataset/dataset_phishing.csv")

# Convert labels
data["status"] = data["status"].map({
    "legitimate": 0,
    "phishing": 1
})

X = data["url"]
y = data["status"]


# --------------------------------
# TF-IDF
# --------------------------------
vectorizer = TfidfVectorizer(
    analyzer='word',
    ngram_range=(1,2)
)

X_vectorized = vectorizer.fit_transform(X)


# --------------------------------
# SPLIT
# --------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# --------------------------------
# MODELS
# --------------------------------
models = {
    "RandomForest":
        RandomForestClassifier(
            n_estimators=100,
            random_state=42
        ),

    "LogisticRegression":
        LogisticRegression(
            max_iter=1000
        ),

    "DecisionTree":
        DecisionTreeClassifier(
            random_state=42
        )
}


best_model = None
best_accuracy = 0


for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print(f"{name} Accuracy: {accuracy:.2f}")

    print(classification_report(
        y_test,
        predictions
    ))

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model


# --------------------------------
# SAVE MODEL + VECTORIZER
# --------------------------------
joblib.dump(
    best_model,
    "backend/models/url_model.pkl"
)

joblib.dump(
    vectorizer,
    "backend/models/url_vectorizer.pkl"
)

print("\nBest model saved!")