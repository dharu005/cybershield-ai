\# 🛡️ CyberShield AI

\### Intelligent Multi-Channel Phishing Detection System



CyberShield AI is an AI-powered cybersecurity application designed to detect and prevent phishing threats across multiple communication channels. It analyzes URLs, emails, SMS messages, and USB devices to help users identify potentially malicious activities.



The system combines machine learning-based detection, a user-friendly dashboard, scan history, and browser extension support to provide a multi-layered phishing detection solution.



\---



\## 🚀 Key Features



\- \*\*URL Phishing Detection:\*\* Analyzes URLs and identifies suspicious or phishing websites.

\- \*\*Email Phishing Detection:\*\* Classifies email messages as legitimate or phishing.

\- \*\*SMS Phishing Detection:\*\* Detects suspicious SMS messages and potential smishing attacks.

\- \*\*USB Threat Scanning:\*\* Provides a scanning interface for identifying potential USB-related threats.

\- \*\*Browser Extension:\*\* Supports browser-based URL monitoring and phishing detection.

\- \*\*Dashboard:\*\* Displays security information and scanning statistics.

\- \*\*Scan History:\*\* Maintains records of previous scanning activities.

\- \*\*Browser URL Logs:\*\* Provides access to browsing URL records.



\---



\## 📸 Project Screenshots



\### 1. Home Page and Features



!\[Home Page](screenshots/home%20page.png)



!\[Feature Page](screenshots/feature%20page.png)



\### 2. Dashboard



!\[Dashboard](screenshots/dashboard.png)



\### 3. URL Phishing Detection



!\[URL Scanner](screenshots/url%20scanner.png)



!\[Browsed URL](screenshots/browsed%20url.png)



\### 4. Email Phishing Detection



!\[Email Scanner](screenshots/email%20scanner.png)



!\[Received Email](screenshots/received%20email.png)



\### 5. SMS Phishing Detection



!\[SMS Scanner](screenshots/sms%20scanner.png)



!\[Received SMS](screenshots/received%20sms.png)



\### 6. USB Threat Scanning



!\[USB Scanner](screenshots/usb%20scanner.png)



\### 7. Scan History



!\[History](screenshots/history.png)



\---



\## 🧠 Machine Learning



CyberShield AI uses trained machine learning models for phishing detection across different input types.



| Detection Module | Model Files |

|---|---|

| URL Detection | URL Model and Vectorizer |

| Email Detection | Email Model and Vectorizer |

| SMS Detection | SMS Model and Vectorizer |



The trained models and vectorizers are stored in the `backend/models/` directory.



\---



\## 🛠️ Technology Stack



\*\*Backend\*\*

\- Python

\- Flask

\- Scikit-learn

\- Pandas



\*\*Frontend\*\*

\- React

\- TypeScript

\- JavaScript

\- HTML and CSS



\*\*Machine Learning\*\*

\- TF-IDF Vectorization

\- Classification Models

\- Text and URL Analysis



\*\*Database and Storage\*\*

\- SQLite (where configured)

\- CSV Datasets



\*\*Browser Extension\*\*

\- JavaScript

\- Chrome Extension APIs



\---



\## 📁 Project Structure



```text

CyberShield-AI/

│

├── backend/

│   ├── app.py

│   ├── dataset/

│   ├── models/

│   └── training/

│

├── frontend/

│   ├── src/

│   ├── public/

│   └── package.json

│

├── extension/

│   ├── background.js

│   ├── manifest.json

│   ├── popup.html

│   └── popup.js

│

├── screenshots/

│

├── .gitignore

└── README.md

```



\---



\## ⚙️ Installation and Execution



\### 1. Clone the Repository



```bash

git clone https://github.com/dharu005/cybershield-ai.git

cd cybershield-ai

```



\### 2. Backend Setup



Navigate to the backend directory:



```bash

cd backend

```



Install the Python dependencies required by the backend application, then start the Flask application:



```bash

python app.py

```



\### 3. Frontend Setup



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Open the local development URL displayed in the terminal.



\### 4. Browser Extension Setup



1\. Open Google Chrome.

2\. Navigate to `chrome://extensions/`.

3\. Enable Developer mode.

4\. Select \*\*Load unpacked\*\*.

5\. Choose the project's `extension` folder.



\---



\## 🎯 Project Objective



The main objective of CyberShield AI is to improve cybersecurity awareness and help users identify phishing threats before interacting with malicious links or messages.



By integrating multiple detection modules into a single platform, the system provides a centralized approach to phishing detection.



\---



\## 🔮 Future Enhancements



\- Advanced explainable AI integration.

\- Real-time threat intelligence integration.

\- Improved phishing URL detection accuracy.

\- Enhanced browser extension capabilities.

\- Advanced malware analysis and threat reporting.



\---



\## 👩‍💻 Developer



\*\*Dharani Sundar\*\*



B.E. Computer Science and Engineering (AI \& ML)



GitHub: \[@dharu005](https://github.com/dharu005)



\---



\## ⭐ Support



If you find this project interesting, consider giving this repository a star!



\*\*CyberShield AI – Detect. Protect. Stay Secure.\*\*

