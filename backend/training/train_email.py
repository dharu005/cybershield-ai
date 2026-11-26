import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load dataset
data = pd.read_csv("backend/dataset/Phishing_Email.csv", encoding="latin1")

X = data["Email Text"].fillna("").astype(str)
y = data["Email Type"]

# Convert text → numbers
vectorizer = TfidfVectorizer()

X_vectorized = vectorizer.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X_vectorized,
    y,
    test_size=0.2,
    random_state=42
)

models = {
    "NaiveBayes": MultinomialNB(),
    "LogisticRegression":
        LogisticRegression(max_iter=1000)
}

best_model = None
best_accuracy = 0

for name, model in models.items():

    model.fit(X_train, y_train)

    prediction = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        prediction
    )

    print(name, accuracy)

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model

joblib.dump(best_model,
            "backend/models/email_model.pkl")

joblib.dump(vectorizer,
            "backend/models/email_vectorizer.pkl")

print("Email model saved")
print(data["Email Type"].value_counts())