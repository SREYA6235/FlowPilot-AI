# 🌸 FlowPilot AI – Intelligent Data Analytics & Visualization Platform

<p align="center">
  <strong>Turn your data into meaningful insights with interactive visualizations.</strong>
</p>

<p align="center">
  A modern, user-friendly analytics dashboard built with React, FastAPI and Python.
</p>

---

## ✨ About the Project

**FlowPilot AI** is a web-based data analytics and visualization platform designed to help users explore datasets, understand important information, and create interactive charts.

Users can upload datasets, view statistical summaries, identify missing values and duplicates, generate visualizations, and ask questions about their data.

The platform uses Python-based data processing and rule-based analytics without requiring paid AI API services.

## 🚀 Features

- 📁 **Dataset Upload** – Upload supported CSV and Excel datasets.
- 📊 **Interactive Charts** – Create bar, line, area, pie and scatter charts.
- 📈 **Data Summary** – View rows, columns and dataset statistics.
- 🔍 **Data Quality Analysis** – Identify missing values and duplicate records.
- 💡 **Automated Insights** – Generate useful observations from uploaded data.
- 💬 **Ask Your Data** – Ask questions using the platform's rule-based question handling.
- 📥 **Data Export** – Download processed data.
- 🎨 **Modern Dashboard** – Responsive interface with an elegant rose-pink theme.

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Recharts
- Axios
- Lucide React

### Backend
- Python
- FastAPI
- Pandas
- NumPy
- OpenPyXL
- Uvicorn

## 📂 Project Structure

```text
FlowPilot-AI/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── engine.py
│   │   └── schemas.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── style.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone https://github.com/SREYA6235/FlowPilot-AI.git
```

### 2. Open the Project

```bash
cd FlowPilot-AI
```

### 3. Set Up the Backend

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend API:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

### 4. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173`

## 📊 How It Works

1. Upload a dataset.
2. The backend processes the data using Python and Pandas.
3. View the dataset summary and automated insights.
4. Select columns to generate interactive charts.
5. Ask questions about the uploaded data.
6. Download the processed dataset.

## 🔐 Privacy and API Usage

- No paid OpenAI API is required.
- No external LLM is used in the current implementation.
- Data analysis is performed using Python-based processing and rule-based logic.
- The current application keeps uploaded dataset state in backend memory.

Do not upload confidential or sensitive datasets.

## 🎯 Project Objective

The objective of FlowPilot AI is to make data analysis easier and more accessible through a simple web interface, automated statistical summaries, and interactive visualizations.

## 👩‍💻 Developed By

**SREYA6235**

GitHub: [@SREYA6235](https://github.com/SREYA6235)

Project Repository: [FlowPilot AI](https://github.com/SREYA6235/FlowPilot-AI)
PROJECT LIVE WORKING : https://drive.google.com/file/d/1Wf50_131Q0h3LfgjxpAds7Uv5VqLno1M/view?usp=drive_link

---

<p align="center">
  🌸 <strong>FlowPilot AI – Explore Data. Discover Insights. Visualize Better.</strong>
</p>
