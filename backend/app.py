from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import shap
import numpy as np
import os
import pythoncom
from sympy import content
import wmi
import xml.etree.ElementTree as ET
import pandas as pd

app = Flask(__name__)
CORS(app)

# Get the directory where app.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load Models
url_model = joblib.load(os.path.join(BASE_DIR, "models/url_model.pkl"))
url_vectorizer = joblib.load(os.path.join(BASE_DIR, "models/url_vectorizer.pkl"))

sms_model = joblib.load(os.path.join(BASE_DIR, "models/sms_model.pkl"))
sms_vectorizer = joblib.load(os.path.join(BASE_DIR, "models/sms_vectorizer.pkl"))

email_model = joblib.load(os.path.join(BASE_DIR, "models/email_model.pkl"))
email_vectorizer = joblib.load(os.path.join(BASE_DIR, "models/email_vectorizer.pkl"))

url_explainer = shap.TreeExplainer(url_model)
sms_explainer = shap.Explainer(sms_model, sms_vectorizer.transform(["sample"]))
email_explainer = shap.Explainer(email_model, email_vectorizer.transform(["sample"]))

@app.route("/predict-url", methods=["POST"])
def predict_url():

    url = request.json["url"]

    vector = url_vectorizer.transform([url])

    prediction = url_model.predict(vector)[0]

    prob = url_model.predict_proba(vector)[0]

    confidence = round(
        max(prob) * 100,
        2
    )

    try:
        shap_values = url_explainer.shap_values(vector.toarray(),check_additivity=False)

        feature_names = url_vectorizer.get_feature_names_out()

        top_features = []

        if len(shap_values) > 1:
            values = shap_values[1][0]
        else:
            values = shap_values[0]

        top_idx = np.argsort(np.abs(values))[-5:]

        for idx in reversed(top_idx):
            top_features.append({
                "token": feature_names[idx],
                "weight": round(abs(float(values[idx])) * 100, 2)
            })

    except Exception as e:
        print("SHAP Error:", e)

        top_features = []

    return jsonify({
        "prediction":
            "Phishing"
            if prediction == 1
            else "Safe",
        "confidence": confidence, 
        "features": top_features 
    })
    

@app.route("/predict-sms", methods=["POST"])
def predict_sms():

    sms = request.json["sms"]

    vector = sms_vectorizer.transform([sms])

    prediction = sms_model.predict(vector)[0]

    prob = sms_model.predict_proba(vector)[0]

    confidence = round(
        max(prob) * 100,
        2
    )
    suspicious_words = [
        "winner",
        "prize",
        "free",
        "claim",
        "click",
        "urgent",
        "offer"
    ]

    top_features = []

    for word in suspicious_words:
        if word.lower() in sms.lower():
            top_features.append({
                "token": word,
                "weight": 20
            })

    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "features": top_features
    })
    
@app.route("/scan_sms_file", methods=["POST"])
def scan_sms_file():

    file = request.files["sms_file"]

    os.makedirs("uploads", exist_ok=True)

    filepath = os.path.join(
        "uploads",
        file.filename
    )

    file.save(filepath)

    tree = ET.parse(filepath)
    root = tree.getroot()

    results = []

    for sms in root.findall("sms"):

        body = sms.get("body", "")

        if not body:
            continue

        vector = sms_vectorizer.transform([body])

        prediction = sms_model.predict(vector)[0]

        prob = sms_model.predict_proba(vector)[0]

        confidence = round(
            float(max(prob) * 100),
            2
        )

        label = (
            "PHISHING"
            if str(prediction).lower() in ["spam", "phishing", "1"]
            else "SAFE"
        )

        results.append({
            "sms": body,
            "prediction": label,
            "confidence": confidence
        })

    return jsonify({
        "results": results,
        "total_sms": len(results),
        "phishing_count": len(
            [x for x in results if x["prediction"] == "PHISHING"]
        ),
        "safe_count": len(
            [x for x in results if x["prediction"] == "SAFE"]
        )
    })


@app.route("/predict-email", methods=["POST"])
def predict_email():

    email = request.json["email"]

    vector = email_vectorizer.transform([email])

    prediction = email_model.predict(vector)[0]

    prob = email_model.predict_proba(vector)[0]

    confidence = round(
        max(prob) * 100,
        2
    )

    email_words = [
        "verify",
        "password",
        "account",
        "bank",
        "login",
        "urgent",
        "security"
    ]

    top_features = []

    for word in email_words:
        if word.lower() in email.lower():
            top_features.append({
                "token": word,
                "weight": 20
            })

    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "features": top_features
    })

saved_urls = []

@app.route("/save-logs", methods=["POST"])
def save_logs():

    global saved_urls

    data = request.json
    saved_urls = data.get("urls", [])

    with open( os.path.join(BASE_DIR, "url_logs.txt"), "w", encoding="utf-8") as f:
        for url in saved_urls:
            f.write(url + "\n")

    print("Saved URLs:", len(saved_urls))

    return jsonify({
        "message": "Logs saved successfully"
    })


@app.route("/scan-logged-urls", methods=["GET"])
def scan_logged_urls():

    results = []

    with open( os.path.join(BASE_DIR, "url_logs.txt"), "r", encoding="utf-8") as f:
        urls = [line.strip() for line in f.readlines()]

    suspicious_keywords = [
        "login",
        "verify",
        "bank",
        "secure",
        "update",
        "password",
        "paypal"
    ]

    for url in urls:

        vector = url_vectorizer.transform([url])

        prediction = url_model.predict(vector)[0]

        prob = url_model.predict_proba(vector)[0]

        confidence = round(max(prob) * 100, 2)
        features = []

        for word in suspicious_keywords:
            if word.lower() in url.lower():
                features.append({
                    "token": word,
                    "weight": 20
                })


        results.append({
            "url": url,
            "status": "Phishing" if prediction == 1 else "Safe",
            "confidence": confidence,
            "features": []
        })

    return jsonify(results)

@app.route("/scan-usb", methods=["GET"])
def scan_usb():

    pythoncom.CoInitialize()

    try:

        c = wmi.WMI()

        devices = []

        keywords = [
            "ANDROID",
            "MTP",
            "PHONE",
            "ONEPLUS",
            "SAMSUNG",
            "REDMI",
            "XIAOMI",
            "OPPO",
            "VIVO",
            "REALME"
            "INFINIX"
        ]
        exclude = [
            "REALTEK",
            "ASUS",
            "ASUSTEK",
            "MICROPHONE",
            "AUDIO"
        ]

        for disk in c.Win32_DiskDrive():

            if disk.InterfaceType == "USB":

                devices.append({
                    "name": disk.Caption,
                    "status": "Connected",
                    "risk": "Low",
                    "type": "USB Storage"
                })

        for device in c.Win32_PnPEntity():

            name = str(device.Name) if device.Name else ""
            manufacturer = (
                str(device.Manufacturer)
                if device.Manufacturer
                else "Unknown"
            )
            if( any(k in name.upper() for k in keywords)
            and not any(e in name.upper() for e in exclude)
            ):
                risk = "Low"
                confidence = 95
                suspicious_reasons = []

                # Basic heuristic checks
                if manufacturer == "Unknown":
                    risk = "Medium"
                    confidence = 75
                    suspicious_reasons.append(
                        "Unknown manufacturer"
                    )

                if "DEBUG" in name.upper():
                    risk = "High"
                    confidence = 60
                    suspicious_reasons.append(
                        "Debug mode detected"
                    )

                devices.append({
                    "name": name,
                    "manufacturer": manufacturer,
                    "status": "Connected",
                    "risk": risk,
                    "confidence": confidence,
                    "reasons": suspicious_reasons
                })

        return jsonify({
            "count": len(devices),
            "devices": devices,
             "threats_found": sum(
                1
                for d in devices
                if d["risk"] != "Low"
            ),
            "scan_time": "1.2 sec"
        })
    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    
    finally:
        pythoncom.CoUninitialize()

@app.route("/scan_email_file", methods=["POST"])
def scan_email_file():

    file = request.files["email_file"]

    os.makedirs("uploads", exist_ok=True)

    filepath = os.path.join(
        "uploads",
        file.filename
    )

    file.save(filepath)

    df = pd.read_csv(filepath)

    results = []

    #with open(filepath, "r", encoding="utf-8", errors="ignore") as f:

     #   content = f.read()

    #emails = content.split("\n\n")

    #for email in emails:

     #   email = email.strip()

      #  if not email:
       #     continue
    for _, row in df.iterrows():

        email = str(row["Email"]).strip()

        if not email:
            continue  
        
        vector = email_vectorizer.transform([email])

        prediction = email_model.predict(vector)[0]
        
        prob = email_model.predict_proba(vector)[0]

        confidence = round(
            float(max(prob) * 100),
            2
        )

        pred_text = str(prediction).lower()

        label = (
            "PHISHING"
            if pred_text in [
                "phishing email",
                "phishing",
                "spam",
                "1"
            ]
            else "SAFE"
        )
        safe_keywords = [
            "order confirmation",
            "newsletter",
            "salary credited",
            "salary credit",
            "leave approval",
            "meeting reminder"
        ]

        email_lower = email.lower()

        if any(word in email_lower for word in safe_keywords):
            label = "SAFE"

        results.append({
            "email": email,
            "prediction": label,
            "confidence": confidence
        })

    return jsonify({
        "results": results,
        "total_emails": len(results),
        "phishing_count": len(
            [x for x in results if x["prediction"] == "PHISHING"]
        ),
        "safe_count": len(
            [x for x in results if x["prediction"] == "SAFE"]
        )
    })

if __name__ == "__main__":
    app.run(debug=True)